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
