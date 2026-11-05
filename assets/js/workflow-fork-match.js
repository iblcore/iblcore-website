// Decides whether one card in a workflow step survives the dataset a reader
// picked in the step marked as the workflow's chooser.

/**
 * Whether a step's card still applies once a dataset has been chosen.
 *
 * `card.access` lists the access routes a resource *is*, not the ones it
 * offers, so an access-route card applies only while the chosen dataset is
 * published through one of them. `card.datasets` is the opposite direction: a
 * resource naming the datasets it works with. A card doing neither applies to
 * every dataset, and with nothing chosen every card applies.
 */
export function stepCardApplies(card, chosen) {
  if (!chosen) return true;
  if (card.chooser) return card.path === chosen.path;
  if (card.datasets.length > 0) return card.datasets.includes(chosen.path);
  if (card.access.length > 0) return card.access.some((route) => chosen.access.includes(route));
  return true;
}

/**
 * Whether a dataset card survives the modality filter.
 *
 * Modality shortens the list of datasets to choose between; it says nothing
 * about the steps after the choice, so only the chooser step's own cards are
 * ever asked. No modality means every dataset.
 */
export function datasetHasModality(card, modality) {
  if (!modality) return true;
  return card.modality.includes(modality);
}
