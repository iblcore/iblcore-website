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

document.querySelectorAll("[data-team-network-map]").forEach((mapRoot) => {
  const d3 = window.d3;
  const topojson = window.topojson;
  const worldMap = window.IBLWorldMap;
  const svgElement = mapRoot.querySelector("[data-team-network-svg]");
  const membersScript = mapRoot.parentElement.querySelector("[data-team-network-members]");
  if (!d3 || !topojson || !worldMap || !svgElement || !membersScript) return;
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
  let worldFeatures;
  const render = () => {
    if (!worldFeatures) return;
    const { projection } = worldMap.renderBase({
      d3,
      svg,
      countryLayer: countries,
      features: worldFeatures,
      canvas: svgElement,
      heightForWidth: (width) => Math.max(320, width * 0.48),
      padding: 16,
    });
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
  worldMap.loadFeatures({ url: mapRoot.dataset.mapUrl, topojson }).then((features) => {
    worldFeatures = features;
    render();
    worldMap.observeResize(mapRoot, render);
  }).catch(() => mapRoot.classList.add("has-map-error"));
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
