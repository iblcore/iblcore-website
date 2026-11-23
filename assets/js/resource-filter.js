// Wires the dataset grid to the pure predicate in resource-filter-match.js.
import { matchesFilters } from "./resource-filter-match.js";

const readCard = (element) => ({
  modality: (element.dataset.modality || "").split(" ").filter(Boolean),
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
  const filters = index.querySelector("[data-resource-filters]");
  const searchForm = index.querySelector("[data-resource-search]");
  const searchInput = index.querySelector("[data-resource-search] input");
  const status = index.querySelector("[data-resource-status]");
  const empty = index.querySelector("[data-resource-empty]");

  const state = { modality: [], access: [], search: "" };

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
    if (status) status.textContent = `${visible} dataset${visible === 1 ? "" : "s"} shown.`;
  };

  for (const chip of chips) {
    chip.addEventListener("click", () => {
      const group = chip.dataset.filterGroup;
      const value = chip.dataset.filterValue;
      const selected = state[group];
      state[group] = selected.includes(value)
        ? selected.filter((term) => term !== value)
        : [...selected, value];
      apply();
    });
  }

  if (filters) filters.hidden = false;

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
