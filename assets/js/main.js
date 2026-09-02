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

document.querySelectorAll("[data-project-view-button]").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.projectViewButton;

    document.querySelectorAll("[data-project-view-button]").forEach((viewButton) => {
      const isActive = viewButton.dataset.projectViewButton === view;
      viewButton.classList.toggle("is-active", isActive);
      viewButton.setAttribute("aria-pressed", String(isActive));
    });

    document.querySelectorAll("[data-project-view-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.projectViewPanel !== view;
    });

    document.querySelectorAll("[data-project-view-content]").forEach((content) => {
      content.hidden = content.dataset.projectViewContent !== view;
    });

    document.querySelectorAll("[data-project-list-only]").forEach((section) => {
      section.hidden = view === "map";
    });

    if (view === "map") {
      window.dispatchEvent(new CustomEvent("project-map:shown"));
    }
  });
});

document.querySelectorAll("[data-project-list-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.projectListJump);
    const listButton = document.querySelector('[data-project-view-button="list"]');

    listButton?.click();
    window.requestAnimationFrame(() => {
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  });
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

  const clusterGroups = d3.group(locations, (_, index) => findCluster(index));
  const cities = Array.from(clusterGroups.values(), (cityLocations) => {
    const placeNames = Array.from(new Set(cityLocations.map((location) => `${location.city}, ${location.country}`)));
    const countries = Array.from(new Set(cityLocations.map((location) => location.country)));
    const cityNames = Array.from(new Set(cityLocations.map((location) => location.city)));
    const key = placeNames.sort().join("|");
    const label = countries.length === 1
      ? `${cityNames.join(" / ")}, ${countries[0]}`
      : placeNames.join(" / ");
    const city = {
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
    };
    cityLocations.forEach((location) => { location.clusterKey = key; });
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

    cityTitle.textContent = city.label;
    selection.hidden = false;
    optionButtons.forEach((option) => {
      const projectId = option.dataset.mapProjectOption;
      const matchingEntries = city.entries.filter((entry) => entry.projectId === projectId);
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

    connectionLayer
      .selectAll("path")
      .data(connections)
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
      .data(cities, (city) => city.key)
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
      .attr("aria-label", (city) => `${city.label}: ${city.projects.length} entr${city.projects.length === 1 ? "y" : "ies"}`)
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

    markers.select(".new-partners-map__marker-count").text((city) => city.projects.length);
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
          card.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
        }
      });
    });
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
      render();
    })
    .catch(() => {
      mapRoot.classList.add("has-map-error");
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
