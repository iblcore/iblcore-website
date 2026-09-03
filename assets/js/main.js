const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const mobileNavQuery = window.matchMedia("(max-width: 900px)");

const closeMobileSubmenus = () => {
  document.querySelectorAll("[data-nav-submenu-toggle]").forEach((button) => {
    const item = button.closest(".site-nav__item--has-children");

    item?.classList.remove("is-submenu-open");
    button.setAttribute("aria-expanded", "false");
  });
};

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
      closeMobileSubmenus();
    }
  });
}

document.querySelectorAll("[data-nav-submenu-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!mobileNavQuery.matches) {
      return;
    }

    const item = button.closest(".site-nav__item--has-children");

    if (!item) {
      return;
    }

    const shouldOpen = !item.classList.contains("is-submenu-open");

    closeMobileSubmenus();
    item.classList.toggle("is-submenu-open", shouldOpen);
    button.setAttribute("aria-expanded", String(shouldOpen));
  });
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (!mobileNavQuery.matches || !nav || !toggle) {
      return;
    }

    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    closeMobileSubmenus();
  });
});

document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  const items = Array.from(accordion.querySelectorAll("[data-accordion-item]"));
  const defaultOpen = accordion.dataset.accordionDefaultOpen || "none";

  const setOpen = (item, isOpen) => {
    const button = item.querySelector("[data-accordion-button]");
    const panel = item.querySelector("[data-accordion-panel]");

    if (!button || !panel) {
      return;
    }

    item.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
    panel.inert = !isOpen;
  };

  items.forEach((item, index) => {
    const button = item.querySelector("[data-accordion-button]");

    if (!button) {
      return;
    }

    setOpen(item, defaultOpen === "all" || (defaultOpen === "first" && index === 0));

    button.addEventListener("click", () => {
      setOpen(item, !item.classList.contains("is-open"));
    });
  });

  accordion.classList.add("accordion-ready");
});

const projectViewButtons = Array.from(document.querySelectorAll("[data-project-view-button]"));
const projectViewPanels = Array.from(document.querySelectorAll("[data-project-view-panel]"));
const projectFilterButtons = Array.from(document.querySelectorAll("[data-project-filter]"));
const projectBannerTitle = document.querySelector("[data-project-banner-title]");
const projectBannerContents = Array.from(document.querySelectorAll("[data-project-banner-content]"));
const projectPrimarySection = document.querySelector("[data-project-primary-section]");
const projectInternalCta = document.querySelector("[data-project-internal-cta]");
let activeProjectView = "list";
let activeProjectFilter = "all";
let projectMapReady = false;

const updateProjectPanels = () => {
  projectViewPanels.forEach((panel) => {
    const matchesView = panel.dataset.projectViewPanel === activeProjectView;
    const category = panel.dataset.projectCategoryPanel;
    const matchesCategory = !category || activeProjectFilter === "all" || category === activeProjectFilter;
    panel.hidden = !(matchesView && matchesCategory);
  });
  if (projectPrimarySection) {
    projectPrimarySection.hidden = activeProjectView === "list" && activeProjectFilter === "affiliate";
  }
  if (projectInternalCta) {
    projectInternalCta.hidden = activeProjectView !== "list" || activeProjectFilter !== "all";
  }
};

const updateProjectBanner = () => {
  const activeContent = projectBannerContents.find((content) => content.dataset.projectBannerContent === activeProjectFilter);
  projectBannerContents.forEach((content) => {
    const isActive = content === activeContent;
    content.classList.toggle("is-active", isActive);
    content.setAttribute("aria-hidden", String(!isActive));
  });
  if (projectBannerTitle && activeContent) projectBannerTitle.textContent = activeContent.dataset.projectBannerTitle;
};

const setProjectView = (view) => {
  if (view === "map" && !projectMapReady) return;

  activeProjectView = view;
  projectViewButtons.forEach((viewButton) => {
    const isActive = viewButton.dataset.projectViewButton === view;
    viewButton.classList.toggle("is-active", isActive);
    viewButton.setAttribute("aria-pressed", String(isActive));
  });
  updateProjectPanels();
  if (view === "map") window.dispatchEvent(new CustomEvent("project-map:shown"));
};

projectViewButtons.forEach((button) => {
  button.addEventListener("click", () => setProjectView(button.dataset.projectViewButton));
});

const setProjectFilter = (filter) => {
  activeProjectFilter = filter;
  projectFilterButtons.forEach((filterButton) => {
    const isActive = filter === "all" ? filterButton.dataset.projectFilter === "all" : filterButton.dataset.projectFilter === filter;
    filterButton.setAttribute("aria-pressed", String(isActive));
  });
  updateProjectPanels();
  updateProjectBanner();
  window.dispatchEvent(new CustomEvent("project-filter:changed", { detail: { filter } }));
};

projectFilterButtons.forEach((button) => {
  button.addEventListener("click", () => setProjectFilter(button.dataset.projectFilter));
});

document.querySelectorAll("[data-team-network-map]").forEach((mapRoot) => {
  const d3 = window.d3;
  const topojson = window.topojson;
  const svgElement = mapRoot.querySelector("[data-team-network-svg]");
  const membersScript = mapRoot.parentElement.querySelector("[data-team-network-members]");
  if (!d3 || !topojson || !svgElement || !membersScript) return;
  const members = JSON.parse(membersScript.textContent || "[]");
  const grouped = Array.from(d3.group(members, (member) => member.location), ([location, people]) => ({
    location,
    latitude: people[0].latitude,
    longitude: people[0].longitude,
    count: people.length,
  }));
  const svg = d3.select(svgElement);
  const countries = svg.append("g").attr("class", "projects-network__countries");
  const markers = svg.append("g").attr("class", "projects-network__markers");
  const render = (world) => {
    const width = svgElement.clientWidth || 900;
    const height = Math.max(320, width * 0.48);
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const features = topojson.feature(world, world.objects.countries);
    const projection = d3.geoNaturalEarth1().fitExtent([[16, 16], [width - 16, height - 16]], features);
    const path = d3.geoPath(projection);
    countries.selectAll("path").data(features.features).join("path").attr("d", path);
    markers.selectAll("g").data(grouped, (place) => place.location).join("g")
      .attr("class", "projects-network__marker")
      .attr("transform", (place) => `translate(${projection([place.longitude, place.latitude]).join(",")})`)
      .each(function(place) {
        const marker = d3.select(this);
        marker.selectAll("circle").data([place]).join("circle").attr("r", 15);
        marker.selectAll("text").data([place]).join("text").attr("text-anchor", "middle").attr("dy", "0.35em").text(place.count);
        marker.attr("aria-label", `${place.location}: ${place.count} IBL Core team member${place.count === 1 ? "" : "s"}`);
      });
  };
  fetch(mapRoot.dataset.mapUrl).then((response) => response.json()).then(render);
  new ResizeObserver(() => fetch(mapRoot.dataset.mapUrl).then((response) => response.json()).then(render)).observe(mapRoot);
});

document.querySelectorAll("[data-project-map]").forEach((mapRoot) => {
  const d3 = window.d3;
  const topojson = window.topojson;
  const svgElement = mapRoot.querySelector("[data-map-svg]");
  const canvas = mapRoot.querySelector(".new-partners-map__canvas");
  const tooltip = mapRoot.querySelector("[data-map-tooltip]");
  const selection = mapRoot.querySelector("[data-map-selection]");
  const cityTitle = mapRoot.querySelector("[data-map-city-title]");
  const optionButtons = Array.from(mapRoot.querySelectorAll("[data-map-project-option]"));
  const projectCards = Array.from(mapRoot.querySelectorAll("[data-map-project-card]"));

  if (!d3 || !topojson || !svgElement || !canvas) {
    return;
  }

  const locations = Array.from(mapRoot.querySelectorAll("[data-project-location]")).map((location) => ({
    projectId: location.dataset.projectId,
    projectTitle: location.dataset.projectTitle,
    recordType: location.dataset.recordType,
    city: location.dataset.city,
    country: location.dataset.country,
    latitude: Number(location.dataset.latitude),
    longitude: Number(location.dataset.longitude),
  }));
  const clusterRadiusKm = 175;
  const radians = (degrees) => degrees * Math.PI / 180;
  const distanceKm = (first, second) => {
    const latitudeDelta = radians(second.latitude - first.latitude);
    const longitudeDelta = radians(second.longitude - first.longitude);
    const latitudeA = radians(first.latitude);
    const latitudeB = radians(second.latitude);
    const haversine = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  };
  const clusterParents = locations.map((_, index) => index);
  const findCluster = (index) => {
    if (clusterParents[index] !== index) clusterParents[index] = findCluster(clusterParents[index]);
    return clusterParents[index];
  };
  const joinClusters = (firstIndex, secondIndex) => {
    const firstRoot = findCluster(firstIndex);
    const secondRoot = findCluster(secondIndex);
    if (firstRoot !== secondRoot) clusterParents[secondRoot] = firstRoot;
  };

  locations.forEach((location, index) => {
    locations.slice(index + 1).forEach((candidate, offset) => {
      if (distanceKm(location, candidate) <= clusterRadiusKm) joinClusters(index, index + offset + 1);
    });
  });

  const summarizeCity = (cityLocations, stableKey) => {
    if (cityLocations.length === 0) return null;

    const placeNames = Array.from(new Set(cityLocations.map((location) => `${location.city}, ${location.country}`)));
    const countries = Array.from(new Set(cityLocations.map((location) => location.country)));
    const cityNames = Array.from(new Set(cityLocations.map((location) => location.city)));
    const key = stableKey || placeNames.sort().join("|");
    const label = countries.length === 1
      ? `${cityNames.join(" / ")}, ${countries[0]}`
      : placeNames.join(" / ");
    return {
      key,
      label,
      latitude: d3.mean(cityLocations, (location) => location.latitude),
      longitude: d3.mean(cityLocations, (location) => location.longitude),
      projectIds: Array.from(new Set(cityLocations.map((location) => location.projectId))),
      recordTypes: Array.from(new Set(cityLocations.map((location) => location.recordType))),
      entries: Array.from(
        new Map(cityLocations.map((location) => [`${location.projectId}|${location.city}|${location.country}`, location])).values(),
        (location) => ({ projectId: location.projectId, city: location.city, projectTitle: location.projectTitle, recordType: location.recordType }),
      ),
      projects: Array.from(
        new Map(cityLocations.map((location) => [location.projectId, location])).values(),
        (location) => ({ id: location.projectId, title: location.projectTitle, recordType: location.recordType }),
      ),
      locations: cityLocations,
    };
  };

  const clusterGroups = d3.group(locations, (_, index) => findCluster(index));
  const cities = Array.from(clusterGroups.values(), (cityLocations) => {
    const city = summarizeCity(cityLocations);
    cityLocations.forEach((location) => { location.clusterKey = city.key; });
    return city;
  });
  const citiesByKey = new Map(cities.map((city) => [city.key, city]));
  const projects = d3.group(locations, (location) => location.projectId);
  const connections = [];

  projects.forEach((projectLocations, projectId) => {
    const projectCities = Array.from(
      new Set(projectLocations.map((location) => location.clusterKey)),
      (clusterKey) => citiesByKey.get(clusterKey),
    );
    for (let index = 0; index < projectCities.length - 1; index += 1) {
      for (let targetIndex = index + 1; targetIndex < projectCities.length; targetIndex += 1) {
        connections.push({
          projectId,
          recordType: projectLocations[0].recordType,
          source: projectCities[index],
          target: projectCities[targetIndex],
        });
      }
    }
  });

  const svg = d3.select(svgElement);
  const definitions = svg.append("defs");
  const mixedMarkerGradient = definitions.append("linearGradient").attr("id", "new-partners-map-mixed-marker");
  mixedMarkerGradient.append("stop").attr("class", "new-partners-map__mixed-partner-stop").attr("offset", "0%");
  mixedMarkerGradient.append("stop").attr("class", "new-partners-map__mixed-partner-stop").attr("offset", "50%");
  mixedMarkerGradient.append("stop").attr("class", "new-partners-map__mixed-affiliate-stop").attr("offset", "50%");
  mixedMarkerGradient.append("stop").attr("class", "new-partners-map__mixed-affiliate-stop").attr("offset", "100%");
  const viewport = svg.append("g").attr("class", "new-partners-map__viewport");
  const countryLayer = viewport.append("g").attr("class", "new-partners-map__countries");
  const connectionLayer = viewport.append("g").attr("class", "new-partners-map__connections");
  const markerLayer = viewport.append("g").attr("class", "new-partners-map__markers");
  let worldFeatures;
  let projection;
  let activeFilter = "all";

  const hideTooltip = () => {
    if (tooltip) tooltip.hidden = true;
  };

  const showTooltip = (city, event) => {
    if (!tooltip) return;

    tooltip.replaceChildren();
    const entryList = document.createElement("ul");
    city.entries.forEach((entry) => {
      const listItem = document.createElement("li");
      const category = document.createElement("span");
      const cityName = document.createElement("strong");
      const projectTitle = document.createElement("span");
      listItem.className = `new-partners-map__tooltip-entry new-partners-map__tooltip-entry--${entry.recordType}`;
      category.className = "visually-hidden";
      category.textContent = `${entry.recordType === "affiliate" ? "Affiliate" : "Partner"}: `;
      cityName.textContent = `${entry.city}: `;
      projectTitle.textContent = entry.projectTitle;
      listItem.append(category, cityName, projectTitle);
      entryList.append(listItem);
    });
    tooltip.append(entryList);
    tooltip.hidden = false;

    const bounds = canvas.getBoundingClientRect();
    const left = event?.clientX ? event.clientX - bounds.left : bounds.width / 2;
    const top = event?.clientY ? event.clientY - bounds.top : bounds.height / 2;
    tooltip.style.left = `${Math.max(12, Math.min(left, bounds.width - 12))}px`;
    tooltip.style.top = `${Math.max(12, top)}px`;
  };

  const selectCity = (city) => {
    if (!selection || !cityTitle) return;

    const visibleEntries = city.entries.filter((entry) => activeFilter === "all" || entry.recordType === activeFilter);
    cityTitle.textContent = city.label;
    selection.hidden = false;
    optionButtons.forEach((option) => {
      const projectId = option.dataset.mapProjectOption;
      const matchingEntries = visibleEntries.filter((entry) => entry.projectId === projectId);
      const localTitles = Array.from(new Set(matchingEntries.map((entry) => entry.projectTitle)));
      option.hidden = matchingEntries.length === 0;
      const optionTitle = option.querySelector("[data-map-option-title]");
      if (optionTitle && localTitles.length > 0) optionTitle.textContent = localTitles.join(" / ");
    });
    projectCards.forEach((card) => {
      card.hidden = true;
    });
    markerLayer.selectAll(".new-partners-map__marker").classed("is-selected", (markerCity) => markerCity.key === city.key);
    selection.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  };

  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", (event) => {
    viewport.attr("transform", event.transform);
    viewport.style("--map-zoom", event.transform.k);
    hideTooltip();
  });
  svg.call(zoom);

  const render = () => {
    if (!worldFeatures || canvas.clientWidth < 1) return;

    const width = canvas.clientWidth;
    const height = Math.max(340, Math.min(620, width * 0.54));
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    projection = d3.geoNaturalEarth1().fitExtent([[20, 20], [width - 20, height - 20]], worldFeatures);
    const path = d3.geoPath(projection);

    countryLayer
      .selectAll("path")
      .data(worldFeatures.features)
      .join("path")
      .attr("d", path);

    const visibleCities = cities
      .map((city) => summarizeCity(
        city.locations.filter((location) => activeFilter === "all" || location.recordType === activeFilter),
        city.key,
      ))
      .filter(Boolean);
    const visibleCitiesByKey = new Map(visibleCities.map((city) => [city.key, city]));
    const visibleConnections = connections
      .filter((connection) => activeFilter === "all" || connection.recordType === activeFilter)
      .map((connection) => ({
        ...connection,
        source: visibleCitiesByKey.get(connection.source.key),
        target: visibleCitiesByKey.get(connection.target.key),
      }))
      .filter((connection) => connection.source && connection.target);

    connectionLayer
      .selectAll("path")
      .data(visibleConnections, (connection) => `${connection.projectId}-${connection.source.key}-${connection.target.key}`)
      .join("path")
      .attr("class", (connection) => `new-partners-map__connection new-partners-map__connection--${connection.recordType}`)
      .attr("d", (connection) => path({
        type: "LineString",
        coordinates: [
          [connection.source.longitude, connection.source.latitude],
          [connection.target.longitude, connection.target.latitude],
        ],
      }));

    const markers = markerLayer
      .selectAll("g")
      .data(visibleCities, (city) => city.key)
      .join((enter) => {
        const marker = enter
          .append("g")
          .attr("role", "button")
          .attr("tabindex", 0);
        marker.append("circle").attr("class", "new-partners-map__marker-hit");
        marker.append("circle").attr("class", "new-partners-map__marker-dot");
        marker.append("text").attr("class", "new-partners-map__marker-count").attr("text-anchor", "middle").attr("dy", "0.35em");
        return marker;
      })
      .attr("class", (city) => `new-partners-map__marker new-partners-map__marker--${city.recordTypes.length > 1 ? "mixed" : city.recordTypes[0]}`)
      .attr("transform", (city) => `translate(${projection([city.longitude, city.latitude]).join(",")})`)
      .attr("aria-label", (city) => `${city.label}: ${city.entries.length} lab location${city.entries.length === 1 ? "" : "s"}`)
      .on("pointerenter", (event, city) => showTooltip(city, event))
      .on("pointermove", (event, city) => showTooltip(city, event))
      .on("pointerleave", hideTooltip)
      .on("focus", (event, city) => showTooltip(city))
      .on("blur", hideTooltip)
      .on("click", (event, city) => selectCity(city))
      .on("keydown", (event, city) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectCity(city);
        }
      });

    markers.select(".new-partners-map__marker-count").text((city) => city.entries.length);
  };

  optionButtons.forEach((option) => {
    option.addEventListener("click", () => {
      const projectId = option.dataset.mapProjectOption;
      projectCards.forEach((card) => {
        const isSelected = card.dataset.mapProjectCard === projectId;
        card.hidden = !isSelected;
        if (isSelected) {
          const accordionButton = card.querySelector("[data-accordion-button]");
          if (accordionButton?.getAttribute("aria-expanded") === "false") accordionButton.click();
        }
      });
    });
  });

  window.addEventListener("project-filter:changed", (event) => {
    activeFilter = event.detail?.filter || "all";
    if (selection) selection.hidden = true;
    optionButtons.forEach((option) => {
      option.hidden = true;
    });
    projectCards.forEach((card) => {
      const accordionButton = card.querySelector("[data-accordion-button]");
      if (accordionButton?.getAttribute("aria-expanded") === "true") accordionButton.click();
      card.hidden = true;
    });
    markerLayer.selectAll(".new-partners-map__marker").classed("is-selected", false);
    render();
  });

  mapRoot.querySelectorAll("[data-map-zoom]").forEach((control) => {
    control.addEventListener("click", () => {
      const action = control.dataset.mapZoom;
      const transition = svg.transition().duration(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 250);
      if (action === "in") transition.call(zoom.scaleBy, 1.5);
      if (action === "out") transition.call(zoom.scaleBy, 1 / 1.5);
      if (action === "reset") transition.call(zoom.transform, d3.zoomIdentity);
    });
  });

  fetch(mapRoot.dataset.mapUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Map data request failed: ${response.status}`);
      return response.json();
    })
    .then((world) => {
      worldFeatures = topojson.feature(world, world.objects.countries);
      projectMapReady = true;
      projectViewButtons
        .filter((button) => button.dataset.projectViewButton === "map")
        .forEach((button) => { button.disabled = false; });
      setProjectView("map");
    })
    .catch(() => {
      mapRoot.classList.add("has-map-error");
      document.querySelector('[data-project-view-button="list"]')?.click();
    });

  new ResizeObserver(render).observe(canvas);
  window.addEventListener("project-map:shown", () => window.requestAnimationFrame(render));
});

document.querySelectorAll("[data-publication-browser]").forEach((browser) => {
  const filters = Array.from(browser.querySelectorAll("[data-publication-filter]"));
  const publications = Array.from(browser.querySelectorAll("[data-publication-item]"));
  const status = browser.querySelector("[data-publication-status]");

  const applyFilter = (selectedFilter) => {
    let visibleCount = 0;

    publications.forEach((publication) => {
      const keywords = publication.dataset.publicationKeywords?.split(" ") || [];
      const isVisible = selectedFilter === "date" || keywords.includes(selectedFilter);

      publication.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    filters.forEach((filter) => {
      const isActive = filter.dataset.publicationFilter === selectedFilter;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    if (status) {
      status.textContent = `${visibleCount} publication${visibleCount === 1 ? "" : "s"} shown.`;
    }
  };

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      applyFilter(filter.dataset.publicationFilter || "date");
    });
  });

  applyFilter("date");
});
