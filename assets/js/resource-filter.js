// Wires the resource index to the pure predicate in resource-filter-match.js.
import { matchesFilters } from "./resource-filter-match.js";

const readCard = (element) => ({
  type: element.dataset.type || "",
  modality: (element.dataset.modality || "").split(" ").filter(Boolean),
  stage: (element.dataset.stage || "").split(" ").filter(Boolean),
  access: (element.dataset.access || "").split(" ").filter(Boolean),
  search: element.dataset.search || "",
});

const index = document.querySelector("[data-resource-index]");

if (index) {
  const chips = Array.from(index.querySelectorAll("[data-filter-group]"));
  const cards = Array.from(index.querySelectorAll("[data-resource-card]")).map((element) => ({
    element,
    card: readCard(element),
  }));
  const searchForm = index.querySelector("[data-resource-search]");
  const searchInput = index.querySelector("[data-resource-search] input");
  const status = index.querySelector("[data-resource-status]");
  const empty = index.querySelector("[data-resource-empty]");

  const state = { type: [], modality: [], stage: [], access: [], search: "" };

  const apply = () => {
    let visible = 0;
    for (const { element, card } of cards) {
      const shown = matchesFilters(card, state);
      element.hidden = !shown;
      if (shown) visible += 1;
    }

    for (const chip of chips) {
      const active = state[chip.dataset.filterGroup].includes(chip.dataset.filterValue);
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    }

    if (empty) empty.hidden = visible > 0;
    if (status) status.textContent = `${visible} resource${visible === 1 ? "" : "s"} shown.`;
  };

  // A chip stays a link for keyboard and no-JavaScript use; with the script
  // loaded it filters in place and rewrites the URL to the view it selected,
  // so the address bar still names what is on screen.
  for (const chip of chips) {
    chip.addEventListener("click", (event) => {
      event.preventDefault();
      const group = chip.dataset.filterGroup;
      const value = chip.dataset.filterValue;
      const selected = state[group];
      state[group] = selected.includes(value)
        ? selected.filter((term) => term !== value)
        : [...selected, value];
      apply();
      const only = Object.values(state).flat().filter(Boolean);
      window.history.replaceState({}, "", only.length === 1 ? chip.href : window.location.pathname);
    });
  }

  if (searchForm && searchInput) {
    searchForm.hidden = false;
    searchForm.addEventListener("submit", (event) => event.preventDefault());
    searchInput.addEventListener("input", () => {
      state.search = searchInput.value;
      apply();
    });
  }

  apply();
}
