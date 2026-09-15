// Partners and Affiliates page: shared category filter, collapsible map,
// profile deep links from the Events page, and the clustered project map.
// Loaded only for the new-partners layout; main.js has already set up accordions.
const projectCategoryPanels = Array.from(document.querySelectorAll("[data-project-category-panel]"));
const projectFilterButtons = Array.from(document.querySelectorAll("[data-project-filter]"));
const projectBannerTitle = document.querySelector("[data-project-banner-title]");
const projectBannerContents = Array.from(document.querySelectorAll("[data-project-banner-content]"));
const projectInternalCta = document.querySelector("[data-project-internal-cta]");
const projectMapRoot = document.querySelector("[data-project-map]");
const projectMapContent = document.querySelector("[data-project-map-content]");
const projectMapToggle = document.querySelector("[data-project-map-toggle]");
const projectMapToggleLabel = projectMapToggle?.querySelector("[data-project-map-toggle-label]");
let activeProjectFilter = "all";
const projectUrlParams = new URLSearchParams(window.location.search);
const requestedProjectView = projectUrlParams.get("view");
const requestedProjectFilter = projectUrlParams.get("filter");
const projectMapPreferenceKey = "iblcore-partners-map-expanded";

const updateProjectPanels = () => {
  projectCategoryPanels.forEach((panel) => {
    const category = panel.dataset.projectCategoryPanel;
    const matchesCategory = !category || activeProjectFilter === "all" || category === activeProjectFilter;
    panel.hidden = !matchesCategory;
  });
  if (projectInternalCta) projectInternalCta.hidden = activeProjectFilter !== "all";
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

const setProjectMapExpanded = (expanded, { persist = true, updateUrl = true } = {}) => {
  if (!projectMapContent || !projectMapToggle) return;
  projectMapContent.hidden = !expanded;
  projectMapToggle.setAttribute("aria-expanded", String(expanded));
  if (projectMapToggleLabel) projectMapToggleLabel.textContent = expanded ? "Hide map" : "Show map";
  projectMapRoot?.classList.toggle("is-collapsed", !expanded);
  if (persist) {
    try {
      window.sessionStorage.setItem(projectMapPreferenceKey, String(expanded));
    } catch {
      // The disclosure remains usable when browser storage is unavailable.
    }
  }
  if (updateUrl) {
    const url = new URL(window.location.href);
    if (expanded) url.searchParams.delete("view");
    else url.searchParams.set("view", "list");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }
  if (expanded) window.dispatchEvent(new CustomEvent("project-map:shown"));
};

let initialMapExpanded = requestedProjectView !== "list";
if (!requestedProjectView) {
  try {
    initialMapExpanded = window.sessionStorage.getItem(projectMapPreferenceKey) !== "false";
  } catch {
    initialMapExpanded = true;
  }
}
setProjectMapExpanded(initialMapExpanded, { persist: false, updateUrl: false });
projectMapToggle?.addEventListener("click", () => {
  setProjectMapExpanded(projectMapToggle.getAttribute("aria-expanded") !== "true");
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

const openProjectProfile = (profileId, highlight = false) => {
  if (!profileId) return;
  const profile = document.getElementById(profileId);
  const accordionButton = profile?.querySelector("[data-accordion-button]");
  if (!profile || !accordionButton) return;
  const category = profile.closest("[data-project-category-panel]")?.dataset.projectCategoryPanel;
  if (category && activeProjectFilter !== "all" && activeProjectFilter !== category) setProjectFilter(category);
  if (accordionButton.getAttribute("aria-expanded") === "false") accordionButton.click();
  profile.scrollIntoView({ block: "center" });
  // Keep keyboard focus on the opened profile without leaving a focus ring
  // around the entire accordion header (which reads as a stray line below
  // the collapse icon after following an Events-page profile link).
  profile.setAttribute("tabindex", "-1");
  profile.focus({ preventScroll: true });
  if (highlight) {
    profile.classList.add("is-map-target");
    window.setTimeout(() => profile.classList.remove("is-map-target"), 2400);
  }
};

const openLinkedProjectProfile = () => {
  const profileId = decodeURIComponent(window.location.hash.slice(1));
  openProjectProfile(profileId);
};

if (["all", "partner", "affiliate"].includes(requestedProjectFilter)) {
  setProjectFilter(requestedProjectFilter);
}
if (window.location.hash) window.requestAnimationFrame(openLinkedProjectProfile);

document.querySelectorAll("[data-project-map]").forEach((mapRoot) => {
  const d3 = window.d3;
  const topojson = window.topojson;
  const worldMap = window.IBLWorldMap;
  const svgElement = mapRoot.querySelector("[data-map-svg]");
  const canvas = mapRoot.querySelector(".world-map__canvas");
  const tooltip = mapRoot.querySelector("[data-map-tooltip]");
  const selection = mapRoot.querySelector("[data-map-selection]");
  const cityTitle = mapRoot.querySelector("[data-map-city-title]");
  const optionButtons = Array.from(mapRoot.querySelectorAll("[data-map-project-option]"));

  if (!d3 || !topojson || !worldMap || !svgElement || !canvas) {
    mapRoot.hidden = true;
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
  worldMap.appendMixedGradient({
    svg,
    id: "new-partners-map-mixed-marker",
    firstStopClass: "new-partners-map__mixed-partner-stop",
    secondStopClass: "new-partners-map__mixed-affiliate-stop",
  });
  const viewport = svg.append("g").attr("class", "world-map__viewport");
  const countryLayer = viewport.append("g").attr("class", "world-map__countries");
  const connectionLayer = viewport.append("g").attr("class", "new-partners-map__connections");
  const markerLayer = viewport.append("g").attr("class", "world-map__markers");
  const tooltipControl = worldMap.createTooltip({ tooltip, canvas });
  let worldFeatures;
  let projection;
  let activeFilter = activeProjectFilter;

  const showTooltip = (city, event) => {
    tooltipControl.show((node) => {
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
      node.append(entryList);
    }, event);
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
    worldMap.setSelectedMarkers(markerLayer, (markerCity) => markerCity.key === city.key);
    worldMap.scrollToSelection(selection);
  };

  const zoom = worldMap.createZoom({ d3, svg, viewport, onZoom: tooltipControl.hide });

  const render = () => {
    if (!worldFeatures || canvas.clientWidth < 1) return;

    const baseMap = worldMap.renderBase({
      d3,
      svg,
      countryLayer,
      features: worldFeatures,
      canvas,
      heightForWidth: (width) => Math.max(340, Math.min(620, width * 0.54)),
    });
    if (!baseMap) return;
    projection = baseMap.projection;
    const path = baseMap.path;

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

    worldMap.createMarkers({
      layer: markerLayer,
      data: visibleCities,
      key: (city) => city.key,
      position: (city) => projection([city.longitude, city.latitude]),
      modifier: (city) => `new-partners-map__marker--${city.recordTypes.length > 1 ? "mixed" : city.recordTypes[0]}`,
      label: (city) => `${city.label}: ${city.entries.length} lab location${city.entries.length === 1 ? "" : "s"}`,
      count: (city) => city.entries.length,
      onSelect: selectCity,
      onHover: showTooltip,
      onLeave: tooltipControl.hide,
    });
  };

  optionButtons.forEach((option) => {
    option.addEventListener("click", () => {
      const projectId = option.dataset.mapProjectOption;
      openProjectProfile(`profile-${projectId}`, true);
    });
  });

  window.addEventListener("project-filter:changed", (event) => {
    activeFilter = event.detail?.filter || "all";
    if (selection) selection.hidden = true;
    optionButtons.forEach((option) => {
      option.hidden = true;
    });
    worldMap.setSelectedMarkers(markerLayer, false);
    render();
  });

  worldMap.bindZoomControls({
    root: mapRoot,
    selector: "[data-map-zoom]",
    dataAttribute: "mapZoom",
    d3,
    svg,
    zoom,
  });

  worldMap.loadFeatures({ url: mapRoot.dataset.mapUrl, topojson })
    .then((features) => {
      worldFeatures = features;
      if (!projectMapContent?.hidden) window.requestAnimationFrame(render);
      if (window.location.hash) window.requestAnimationFrame(openLinkedProjectProfile);
    })
    .catch(() => {
      mapRoot.classList.add("has-map-error");
      mapRoot.hidden = true;
    });

  worldMap.observeResize(canvas, render);
  window.addEventListener("project-map:shown", () => window.requestAnimationFrame(render));
});
