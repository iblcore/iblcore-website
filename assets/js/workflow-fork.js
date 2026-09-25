// Forks a workflow page on the dataset a reader picks in its chooser step.
// The page is rendered whole; this narrows it, so with no script the workflow
// is still the complete document.
import { datasetHasModality, stepCardApplies } from "./workflow-fork-match.js";

const readCard = (element) => ({
  path: element.dataset.path || "",
  chooser: element.closest("[data-choice]") !== null,
  access: (element.dataset.access || "").split(" ").filter(Boolean),
  datasets: (element.dataset.datasets || "").split(" ").filter(Boolean),
  modality: (element.dataset.modality || "").split(" ").filter(Boolean),
});

const slugOf = (path) => path.slice(path.lastIndexOf("/") + 1);

const picker = document.querySelector("[data-dataset-picker]");

if (picker) {
  const modalitySelect = picker.querySelector("[data-wf-modality]");
  const datasetSelect = picker.querySelector("[data-wf-select]");
  const hint = picker.querySelector("[data-picker-hint]");
  const hintDefault = hint.textContent;
  const clear = document.querySelector("[data-wf-clear]");
  const status = document.querySelector("[data-wf-status]");
  const help = document.querySelector("[data-route-help]");
  const helpHint = help?.querySelector("[data-route-help-hint]");
  const helpItems = Array.from(help?.querySelectorAll("[data-help-route]") || []);

  const cards = Array.from(document.querySelectorAll("[data-resource-card]")).map((element) => ({
    element,
    card: readCard(element),
  }));
  const steps = Array.from(document.querySelectorAll(".workflow-step"));
  const stepperItems = new Map(
    Array.from(document.querySelectorAll("[data-stepper-item]"), (item) => [item.dataset.stepperItem, item]),
  );
  const stepperStatus = new Map(
    Array.from(document.querySelectorAll("[data-stepper-status]"), (item) => [item.dataset.stepperStatus, item]),
  );

  // A list in English, so the panel's hint names the two routes it compares.
  const listOf = (names) =>
    names.length === 2 ? `${names[0]} and ${names[1]}` : names.join(", ");

  const apply = () => {
    const modality = modalitySelect.value;

    // The dataset list only offers what the modality leaves standing, and a
    // modality matching exactly one dataset has already made the choice.
    const matching = [];
    for (const option of datasetSelect.options) {
      if (!option.value) continue;
      const ok = datasetHasModality({ modality: (option.dataset.modality || "").split(" ").filter(Boolean) }, modality);
      option.hidden = !ok;
      option.disabled = !ok;
      if (ok) matching.push(option.value);
    }
    if (datasetSelect.value && !matching.includes(datasetSelect.value)) datasetSelect.value = "";
    if (modality && matching.length === 1) datasetSelect.value = matching[0];

    const chosenPath = datasetSelect.value;
    const chosen = cards.find(({ card }) => card.chooser && card.path === chosenPath)?.card || null;
    const title = chosen ? datasetSelect.options[datasetSelect.selectedIndex].text : "";

    const routes = [];
    for (const { element, card } of cards) {
      const show =
        stepCardApplies(card, chosen) && (!card.chooser || chosen !== null || datasetHasModality(card, modality));
      element.hidden = !show;
      if (show && card.chooser) {
        for (const route of card.access) if (!routes.includes(route)) routes.push(route);
      }
    }

    // A step whose cards have all gone is no longer part of this reader's
    // path, so it leaves the page and the stepper together.
    for (const step of steps) {
      const empty = step.querySelectorAll("[data-resource-card]:not([hidden])").length === 0;
      step.hidden = empty;
      const item = stepperItems.get(step.id);
      if (item) item.hidden = empty;
    }

    const chooserStep = document.querySelector("[data-choice]");
    const stepStatus = chooserStep ? stepperStatus.get(chooserStep.id) : null;
    if (stepStatus) stepStatus.textContent = title;
    stepperItems.get(chooserStep?.id)?.classList.toggle("is-done", chosen !== null);

    // The prompt has served its purpose once a dataset is chosen.
    hint.hidden = chosen !== null;
    if (!chosen) {
      hint.textContent = modality
        ? `${matching.length} dataset${matching.length === 1 ? "" : "s"} include ${modalitySelect.options[modalitySelect.selectedIndex].text} recordings.`
        : hintDefault;
    }
    if (clear) clear.hidden = !(chosenPath || modality);

    // "Which route should I use?" is only a question while there is a choice.
    if (help) {
      help.hidden = routes.length < 2;
      if (help.hidden) help.open = false;
      for (const item of helpItems) item.hidden = !routes.includes(item.dataset.helpRoute);
      const names = helpItems.filter((item) => !item.hidden).map((item) => item.dataset.routeName);
      helpHint.textContent =
        names.length === 2 ? `Compare ${listOf(names)}.` : "Compare what each route is best for.";
    }

    if (status) {
      status.textContent = chosen
        ? `Showing ${title}.`
        : modality
          ? `Showing ${modalitySelect.options[modalitySelect.selectedIndex].text} datasets.`
          : "Showing all datasets.";
    }

    const url = chosenPath ? `?dataset=${slugOf(chosenPath)}` : window.location.pathname;
    window.history.replaceState({}, "", url);
  };

  modalitySelect.addEventListener("change", apply);
  datasetSelect.addEventListener("change", apply);
  clear?.addEventListener("click", () => {
    modalitySelect.value = "";
    datasetSelect.value = "";
    apply();
  });

  const requested = new URLSearchParams(window.location.search).get("dataset");
  const match = Array.from(datasetSelect.options).find((option) => option.value && slugOf(option.value) === requested);
  if (match) datasetSelect.value = match.value;

  picker.hidden = false;
  apply();
}
