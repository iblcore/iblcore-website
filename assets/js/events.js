document.querySelectorAll("[data-events-browser]").forEach((browser) => {
  const page = browser.closest("[data-events-page]") || document;
  const viewButtons = Array.from(page.querySelectorAll("[data-events-view-button]"));
  const filterControls = page.querySelector("[data-events-enhanced-controls]");
  const filterButtons = Array.from(page.querySelectorAll("[data-events-status-filter]"));
  const dataScript = browser.querySelector("[data-events-data]");
  if (!dataScript) return;

  let rawEvents;
  try {
    rawEvents = JSON.parse(dataScript.textContent || "[]");
  } catch (error) {
    console.error("The enhanced Events views could not read the event data. Showing the event list instead.", error);
    return;
  }
  if (!Array.isArray(rawEvents) || rawEvents.length === 0) {
    console.error("The enhanced Events views require a non-empty event list. Showing the event list instead.");
    return;
  }

  const parseDate = (value) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day, 12);
  };
  const dayKey = (date) => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  const isOnlineEvent = (event) => event.format === "online";
  const hasValidCoordinates = (event) => {
    const latitude = Number(event.latitude);
    const longitude = Number(event.longitude);
    return event.latitude !== null
      && event.latitude !== ""
      && event.longitude !== null
      && event.longitude !== ""
      && Number.isFinite(latitude)
      && Number.isFinite(longitude)
      && latitude >= -90
      && latitude <= 90
      && longitude >= -180
      && longitude <= 180;
  };
  const invalidPhysicalEvent = rawEvents.find((event) => !isOnlineEvent(event) && !hasValidCoordinates(event));
  if (invalidPhysicalEvent) {
    console.error(`Physical event "${invalidPhysicalEvent.name || invalidPhysicalEvent.id}" has invalid coordinates. Showing the event list instead.`);
    return;
  }
  const events = rawEvents.map((event) => ({
    ...event,
    start: parseDate(event.start_date),
    end: parseDate(event.end_date),
    status: event.end_date < dayKey(new Date()) ? "past" : "upcoming",
  }));
  const viewPanels = Array.from(browser.querySelectorAll("[data-events-view-panel]"));
  const statusGroups = Array.from(browser.querySelectorAll("[data-events-status-group]"));
  const readyViews = new Set(["list"]);
  let activeStatusFilter = "all";
  let activeCalendarMonth = null;
  let activeCalendarYear = new Date().getFullYear();

  const visibleEvents = () => events.filter((event) => (
    activeStatusFilter === "all" || event.status === activeStatusFilter
  ));

  const setView = (view) => {
    if (!readyViews.has(view)) return;

    viewButtons.forEach((button) => {
      const isActive = button.dataset.eventsViewButton === view;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    viewPanels.forEach((panel) => {
      panel.hidden = panel.dataset.eventsViewPanel !== view;
    });
    if (view === "map") window.dispatchEvent(new CustomEvent("events-map:shown"));
  };

  const enableView = (view) => {
    readyViews.add(view);
    viewButtons
      .filter((button) => button.dataset.eventsViewButton === view)
      .forEach((button) => {
        button.disabled = false;
        button.hidden = false;
      });
  };

  if (filterControls) filterControls.hidden = false;

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.eventsViewButton));
  });

  const cloneEventCard = (eventId) => {
    const template = browser.querySelector(`[data-event-template="${eventId}"]`);
    return template?.content.firstElementChild?.cloneNode(true) || null;
  };

  const appendEventCards = (container, selectedEvents, emptyMessage) => {
    container.replaceChildren();
    if (selectedEvents.length === 0) {
      const message = document.createElement("p");
      message.className = "events-list-group__empty";
      message.textContent = emptyMessage;
      container.append(message);
      return;
    }

    const list = document.createElement("div");
    list.className = "events-list";
    selectedEvents.forEach((event) => {
      const card = cloneEventCard(event.id);
      if (card) list.append(card);
    });
    container.append(list);
  };

  const calendar = browser.querySelector("[data-events-calendar]");
  const calendarOverview = calendar?.querySelector("[data-calendar-overview]");
  const calendarMonths = calendar?.querySelector("[data-calendar-months]");
  const calendarExpanded = calendar?.querySelector("[data-calendar-expanded]");
  const calendarTitle = calendar?.querySelector("[data-calendar-title]");
  const calendarGrid = calendar?.querySelector("[data-calendar-grid]");
  const calendarOverviewButton = calendar?.querySelector("[data-calendar-overview-button]");
  const calendarMonthButtons = Array.from(calendar?.querySelectorAll("[data-calendar-month-change]") || []);
  const calendarYearLabel = calendar?.querySelector("[data-calendar-year-label]");
  const calendarYearButtons = Array.from(calendar?.querySelectorAll("[data-calendar-year-change]") || []);
  const calendarSelection = browser.querySelector("[data-calendar-selection]");
  const monthFormatter = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });
  const monthNameFormatter = new Intl.DateTimeFormat("en", { month: "long" });
  const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const eventsInMonth = (year, month) => {
    const monthStart = new Date(year, month, 1, 12);
    const monthEnd = new Date(year, month + 1, 0, 12);
    return visibleEvents().filter((event) => event.start <= monthEnd && event.end >= monthStart);
  };

  const focusCalendarEvent = (eventId) => {
    const card = calendarSelection?.querySelector(`[data-event-card-id="${eventId}"]`);
    if (!card) return;
    card.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
    });
    card.setAttribute("tabindex", "-1");
    card.focus({ preventScroll: true });
  };

  const renderMonth = (year, month) => {
    if (!calendarOverview || !calendarExpanded || !calendarTitle || !calendarGrid || !calendarSelection) return;

    const selectedMonth = new Date(year, month, 1, 12);
    const selectedEvents = eventsInMonth(year, month).sort((first, second) => first.start - second.start);
    activeCalendarYear = year;
    activeCalendarMonth = { year, month };
    calendarOverview.hidden = true;
    calendarExpanded.hidden = false;
    calendarTitle.textContent = monthFormatter.format(selectedMonth);
    calendarGrid.replaceChildren();

    const grid = document.createElement("div");
    grid.className = "events-calendar__grid";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", monthFormatter.format(selectedMonth));
    grid.setAttribute("aria-describedby", "events-calendar-description");

    weekdayNames.forEach((weekday, index) => {
      const heading = document.createElement("div");
      heading.className = "events-calendar__weekday";
      heading.setAttribute("aria-hidden", "true");
      heading.textContent = weekday.slice(0, 3);
      heading.title = weekday;
      heading.style.gridColumn = index + 1;
      heading.style.gridRow = 1;
      grid.append(heading);
    });

    const firstDay = new Date(year, month, 1, 12);
    const leadingDays = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0, 12).getDate();
    const cellCount = Math.ceil((leadingDays + daysInMonth) / 7) * 7;

    for (let index = 0; index < cellCount; index += 1) {
      const dayNumber = index - leadingDays + 1;
      const cell = document.createElement("div");
      cell.className = "events-calendar__day";
      cell.style.gridColumn = (index % 7) + 1;
      cell.style.gridRow = Math.floor(index / 7) + 2;

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        cell.classList.add("events-calendar__day--empty");
        cell.setAttribute("aria-hidden", "true");
        grid.append(cell);
        continue;
      }

      const date = new Date(year, month, dayNumber, 12);
      const dateKey = dayKey(date);
      const number = document.createElement("time");
      number.className = "events-calendar__day-number";
      number.dateTime = dateKey;
      number.textContent = dayNumber;
      cell.append(number);
      grid.append(cell);
    }

    const calendarStart = new Date(year, month, 1 - leadingDays, 12);
    const monthStart = new Date(year, month, 1, 12);
    const monthEnd = new Date(year, month + 1, 0, 12);
    const weekCount = cellCount / 7;
    const eventLanes = new Map();
    selectedEvents.forEach((event) => {
      let lane = 0;
      while (selectedEvents.some((other) => (
        other.id !== event.id
        && eventLanes.get(other.id) === lane
        && other.start <= event.end
        && other.end >= event.start
      ))) lane += 1;
      eventLanes.set(event.id, lane);
    });
    const renderedEventIds = new Set();
    grid.addEventListener("click", (event) => {
      const eventTarget = event.target.closest("[data-calendar-event-id]");
      if (eventTarget && grid.contains(eventTarget)) focusCalendarEvent(eventTarget.dataset.calendarEventId);
    });

    for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
      const weekStart = new Date(calendarStart);
      weekStart.setDate(calendarStart.getDate() + (weekIndex * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const weekEvents = selectedEvents.filter((event) => event.start <= weekEnd && event.end >= weekStart);

      weekEvents.forEach((event) => {
        const segmentStart = new Date(Math.max(event.start, weekStart, monthStart));
        const segmentEnd = new Date(Math.min(event.end, weekEnd, monthEnd));
        const startColumn = ((segmentStart.getDay() + 6) % 7) + 1;
        const endColumn = ((segmentEnd.getDay() + 6) % 7) + 2;
        const isContinuation = renderedEventIds.has(event.id);
        const segment = document.createElement(isContinuation ? "span" : "button");
        segment.className = `${isContinuation ? "events-calendar__event-continuation" : "events-calendar__event"} events-calendar__event--${event.status}`;
        if (!isContinuation) {
          segment.type = "button";
          segment.textContent = event.name;
          segment.setAttribute(
            "aria-label",
            `${event.name}, ${event.start.toLocaleDateString("en", { dateStyle: "long" })} to ${event.end.toLocaleDateString("en", { dateStyle: "long" })}`,
          );
        } else {
          segment.setAttribute("aria-hidden", "true");
          segment.title = `${event.name} (continued)`;
        }
        segment.dataset.calendarEventId = event.id;
        segment.style.gridColumn = `${startColumn} / ${endColumn}`;
        segment.style.gridRow = weekIndex + 2;
        segment.style.setProperty("--events-calendar-event-lane", eventLanes.get(event.id) || 0);
        grid.append(segment);
        renderedEventIds.add(event.id);
      });
    }

    calendarGrid.append(grid);
    const heading = document.createElement("h2");
    heading.className = "events-selection__title";
    heading.id = "events-calendar-selection-title";
    heading.textContent = `Events in ${monthFormatter.format(selectedMonth)}`;
    calendarSelection.replaceChildren(heading);
    const cards = document.createElement("div");
    appendEventCards(cards, selectedEvents, "No events are listed for this month.");
    calendarSelection.append(cards);
    calendarSelection.hidden = false;
  };

  const renderMonthOverview = () => {
    if (!calendarMonths || !calendarYearLabel) return false;

    calendarYearLabel.textContent = activeCalendarYear;
    calendarMonths.replaceChildren();
    const monthGrid = document.createElement("div");
    monthGrid.className = "events-calendar__month-grid";

    for (let month = 0; month < 12; month += 1) {
      const monthDate = new Date(activeCalendarYear, month, 1, 12);
      const monthEvents = eventsInMonth(activeCalendarYear, month);
      const upcomingCount = monthEvents.filter((event) => event.status === "upcoming").length;
      const pastCount = monthEvents.filter((event) => event.status === "past").length;
      const button = document.createElement("button");
      const monthName = monthNameFormatter.format(monthDate);
      button.className = `events-calendar__month${monthEvents.length > 0 ? " events-calendar__month--has-events" : ""}`;
      button.type = "button";
      const name = document.createElement("span");
      const count = document.createElement("span");
      const statusCounts = document.createElement("span");
      name.className = "events-calendar__month-name";
      name.textContent = monthName;
      count.className = "events-calendar__month-count";
      count.textContent = `${monthEvents.length} event${monthEvents.length === 1 ? "" : "s"}`;
      statusCounts.className = "events-calendar__month-status-counts";
      if (upcomingCount > 0) {
        const upcoming = document.createElement("span");
        upcoming.className = "events-calendar__month-status events-calendar__month-status--upcoming";
        upcoming.textContent = `${upcomingCount} upcoming`;
        statusCounts.append(upcoming);
      }
      if (pastCount > 0) {
        const past = document.createElement("span");
        past.className = "events-calendar__month-status events-calendar__month-status--past";
        past.textContent = `${pastCount} past`;
        statusCounts.append(past);
      }
      button.append(name, count, statusCounts);
      button.setAttribute("aria-label", `${monthName} ${activeCalendarYear}, ${monthEvents.length} event${monthEvents.length === 1 ? "" : "s"}`);
      button.addEventListener("click", () => renderMonth(activeCalendarYear, month));
      monthGrid.append(button);
    }
    calendarMonths.append(monthGrid);
    return true;
  };

  calendarYearButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCalendarYear += Number(button.dataset.calendarYearChange);
      activeCalendarMonth = null;
      renderMonthOverview();
    });
  });

  calendarOverviewButton?.addEventListener("click", () => {
    if (!calendarOverview || !calendarExpanded || !calendarSelection) return;
    calendarExpanded.hidden = true;
    calendarOverview.hidden = false;
    calendarSelection.hidden = true;
    activeCalendarMonth = null;
  });

  calendarMonthButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!activeCalendarMonth) return;
      const month = new Date(
        activeCalendarMonth.year,
        activeCalendarMonth.month + Number(button.dataset.calendarMonthChange),
        1,
        12,
      );
      renderMonth(month.getFullYear(), month.getMonth());
    });
  });

  if (renderMonthOverview()) {
    enableView("calendar");
    setView("calendar");
  }

  const setStatusFilter = (filter) => {
    activeStatusFilter = filter;
    filterButtons.forEach((button) => {
      const isActive = button.dataset.eventsStatusFilter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    statusGroups.forEach((group) => {
      group.hidden = filter !== "all" && group.dataset.eventsStatusGroup !== filter;
    });
    renderMonthOverview();
    if (activeCalendarMonth) renderMonth(activeCalendarMonth.year, activeCalendarMonth.month);
    window.dispatchEvent(new CustomEvent("events-filter:changed"));
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setStatusFilter(button.dataset.eventsStatusFilter));
  });

  const mapRoot = browser.querySelector("[data-events-map]");
  const d3 = window.d3;
  const topojson = window.topojson;
  const worldMap = window.IBLWorldMap;
  const svgElement = mapRoot?.querySelector("[data-events-map-svg]");
  const canvas = mapRoot?.querySelector(".events-map__canvas");
  const tooltip = mapRoot?.querySelector("[data-events-map-tooltip]");
  const mapEmpty = mapRoot?.querySelector("[data-events-map-empty]");
  const onlinePanel = mapRoot?.querySelector("[data-events-map-online]");
  const onlineButton = mapRoot?.querySelector("[data-events-map-online-button]");
  const mapSelection = browser.querySelector("[data-map-selection]");

  if (!mapRoot || !d3 || !topojson || !worldMap || !svgElement || !canvas || !mapSelection) return;

  const buildLocations = () => Array.from(
    d3.group(
      visibleEvents().filter((event) => !isOnlineEvent(event) && hasValidCoordinates(event)),
      (event) => `${event.latitude}|${event.longitude}`,
    ).values(),
    (locationEvents) => ({
      key: `${locationEvents[0].latitude}|${locationEvents[0].longitude}`,
      label: [locationEvents[0].location, locationEvents[0].city, locationEvents[0].country].filter(Boolean).join(", "),
      latitude: Number(locationEvents[0].latitude),
      longitude: Number(locationEvents[0].longitude),
      statuses: Array.from(new Set(locationEvents.map((event) => event.status))),
      events: locationEvents,
    }),
  );
  const svg = d3.select(svgElement);
  const defs = svg.append("defs");
  const mixedMarkerGradient = defs
    .append("linearGradient")
    .attr("id", "events-map-mixed-marker")
    .attr("x1", "0%")
    .attr("x2", "100%");
  mixedMarkerGradient.append("stop").attr("class", "events-map__gradient-stop--upcoming").attr("offset", "50%");
  mixedMarkerGradient.append("stop").attr("class", "events-map__gradient-stop--past").attr("offset", "50%");
  const viewport = svg.append("g").attr("class", "events-map__viewport");
  const countryLayer = viewport.append("g").attr("class", "events-map__countries");
  const markerLayer = viewport.append("g").attr("class", "events-map__markers");
  let worldFeatures;
  let projection;
  let currentOnlineEvents = [];
  let onlineSelectionActive = false;

  const hideTooltip = () => {
    if (tooltip) tooltip.hidden = true;
  };

  const showTooltip = (location, event) => {
    if (!tooltip) return;
    tooltip.replaceChildren();
    const title = document.createElement("strong");
    const names = document.createElement("span");
    title.textContent = location.label;
    names.textContent = location.events.map((item) => item.name).join(" / ");
    tooltip.append(title, names);
    tooltip.hidden = false;

    worldMap.positionTooltip({ tooltip, canvas, event });
  };

  const selectLocation = (location) => {
    const title = document.createElement("h2");
    title.className = "events-selection__title";
    title.textContent = `Events in ${location.label}`;
    mapSelection.replaceChildren(title);
    const cards = document.createElement("div");
    appendEventCards(cards, location.events.sort((first, second) => first.start - second.start), "No events are listed at this location.");
    mapSelection.append(cards);
    mapSelection.hidden = false;
    markerLayer.selectAll(".events-map__marker").classed("is-selected", (item) => item.key === location.key);
    onlineSelectionActive = false;
    onlineButton?.classList.remove("is-selected");
    mapSelection.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
    });
  };

  const selectOnlineEvents = (onlineEvents) => {
    const title = document.createElement("h2");
    title.className = "events-selection__title";
    title.textContent = "Online events";
    mapSelection.replaceChildren(title);
    const cards = document.createElement("div");
    appendEventCards(
      cards,
      onlineEvents.sort((first, second) => first.start - second.start),
      "No online events match this filter.",
    );
    mapSelection.append(cards);
    mapSelection.hidden = false;
    markerLayer.selectAll(".events-map__marker").classed("is-selected", false);
    onlineSelectionActive = true;
    onlineButton?.classList.add("is-selected");
    mapSelection.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
    });
  };

  const renderOnlineEvents = () => {
    const onlineEvents = visibleEvents().filter(isOnlineEvent);
    currentOnlineEvents = onlineEvents;
    if (!onlinePanel || !onlineButton) return onlineEvents;

    onlinePanel.hidden = false;
    const statuses = Array.from(new Set(onlineEvents.map((event) => event.status)));
    const emptyStatus = activeStatusFilter === "all" ? "empty" : activeStatusFilter;
    const status = statuses.length > 1 ? "mixed" : (statuses[0] || emptyStatus);
    onlineButton.className = `events-map__online-button events-map__online-button--${status}`;
    onlineButton.classList.toggle("is-selected", onlineSelectionActive);
    onlineButton.setAttribute("aria-label", `Online events: ${onlineEvents.length} event${onlineEvents.length === 1 ? "" : "s"}`);
    const count = onlineButton.querySelector(".events-map__online-count");
    count.textContent = onlineEvents.length;
    return onlineEvents;
  };

  onlineButton?.addEventListener("click", () => selectOnlineEvents(currentOnlineEvents));

  const zoom = worldMap.createZoom({
    d3,
    svg,
    viewport,
    cssVariable: "--events-map-zoom",
    onZoom: hideTooltip,
  });

  const renderMap = () => {
    if (!worldFeatures || canvas.clientWidth < 1) return;

    const locations = buildLocations();
    const onlineEvents = renderOnlineEvents();
    if (mapEmpty) mapEmpty.hidden = locations.length > 0 || onlineEvents.length > 0;
    if (locations.length === 0 && onlineEvents.length === 0) {
      mapSelection.hidden = true;
      hideTooltip();
    }

    const baseMap = worldMap.renderBase({
      d3,
      svg,
      countryLayer,
      features: worldFeatures,
      canvas,
      heightForWidth: (width) => Math.max(320, Math.min(600, width * 0.54)),
    });
    if (!baseMap) return;
    projection = baseMap.projection;

    const markers = markerLayer
      .selectAll("g")
      .data(locations, (location) => location.key)
      .join((enter) => {
        const marker = enter.append("g").attr("role", "button").attr("tabindex", 0);
        marker.append("circle").attr("class", "events-map__marker-hit");
        marker.append("circle").attr("class", "events-map__marker-dot");
        marker.append("text").attr("class", "events-map__marker-count").attr("text-anchor", "middle").attr("dy", "0.35em");
        return marker;
      })
      .attr("class", (location) => {
        const status = location.statuses.length > 1 ? "mixed" : location.statuses[0];
        return `events-map__marker events-map__marker--${status}`;
      })
      .attr("transform", (location) => `translate(${projection([location.longitude, location.latitude]).join(",")})`)
      .attr("aria-label", (location) => `${location.label}: ${location.events.length} event${location.events.length === 1 ? "" : "s"}`)
      .on("pointerenter", (event, location) => showTooltip(location, event))
      .on("pointermove", (event, location) => showTooltip(location, event))
      .on("pointerleave", hideTooltip)
      .on("focus", (event, location) => showTooltip(location))
      .on("blur", hideTooltip)
      .on("click", (event, location) => selectLocation(location))
      .on("keydown", (event, location) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectLocation(location);
        }
      });
    markers.select(".events-map__marker-count").text((location) => location.events.length);
  };

  worldMap.bindZoomControls({
    root: mapRoot,
    selector: "[data-events-map-zoom]",
    dataAttribute: "eventsMapZoom",
    d3,
    svg,
    zoom,
  });

  worldMap.loadFeatures({ url: mapRoot.dataset.mapUrl, topojson })
    .then((features) => {
      worldFeatures = features;
      enableView("map");
    })
    .catch(() => {
      mapRoot.classList.add("has-map-error");
    });

  worldMap.observeResize(canvas, renderMap);
  window.addEventListener("events-map:shown", () => window.requestAnimationFrame(renderMap));
  window.addEventListener("events-filter:changed", () => {
    mapSelection.hidden = true;
    onlineSelectionActive = false;
    onlineButton?.classList.remove("is-selected");
    markerLayer.selectAll(".events-map__marker").classed("is-selected", false);
    hideTooltip();
    renderMap();
  });
});
