const GROUPS = ["type", "modality", "stage", "access"];

/**
 * Whether one resource card survives the active filters.
 *
 * Terms within a group are alternatives and the groups intersect: a card must
 * carry one of the selected modalities AND one of the selected stages. The
 * search query is matched as a substring of the card's prebuilt haystack, which
 * the card partial renders already lowercased.
 *
 * @param {{type: string, modality: string[], stage: string[], access: string[],
 *          search: string}} card
 * @param {{type: string[], modality: string[], stage: string[], access: string[],
 *          search: string}} state
 * @returns {boolean}
 */
export function matchesFilters(card, state) {
  const query = state.search.trim().toLowerCase();
  if (query && !card.search.includes(query)) return false;

  return GROUPS.every((group) => {
    const selected = state[group];
    if (selected.length === 0) return true;
    const terms = [card[group]].flat();
    return selected.some((term) => terms.includes(term));
  });
}
