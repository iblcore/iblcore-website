const GROUPS = ["modality", "access"];

/**
 * One string reduced to its letters and digits, lowercased.
 *
 * Dropping the spaces as well as the punctuation is what lets a typed
 * "brain wide" meet a written "Brain-wide": the two collapse to the same text.
 *
 * @param {string} text
 * @returns {string}
 */
const loosen = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Whether one dataset card survives the active filters.
 *
 * Terms within a group are alternatives and the groups intersect: a card must
 * carry one of the selected modalities AND one of the selected access routes. The
 * search query is matched as a substring of the card's prebuilt haystack, which
 * the card partial renders already lowercased.
 *
 * Both sides of that comparison are loosened first, so a reader who types
 * "brainwide" or "brain wide" still finds "Brain-wide Map": nobody should have
 * to guess where a name puts its hyphens.
 *
 * @param {{modality: string[], access: string[], search: string}} card
 * @param {{modality: string[], access: string[], search: string}} state
 * @returns {boolean}
 */
export function matchesFilters(card, state) {
  const query = loosen(state.search);
  if (query && !loosen(card.search).includes(query)) return false;

  return GROUPS.every((group) => {
    const selected = state[group];
    if (selected.length === 0) return true;
    const terms = [card[group]].flat();
    return selected.some((term) => terms.includes(term));
  });
}
