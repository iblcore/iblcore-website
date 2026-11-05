// Copy and show controls for the BibTeX entries in a citation section.
//
// Shared by the BrainWideBench page and the dataset pages: any page whose
// front matter carries `citations` loads this.
//
// Added here rather than in the template so that a browser without JavaScript
// shows no button at all, instead of one that does nothing. The markup renders
// the entry open; this collapses it, so the BibTeX stays reachable either way.
// An entry with no BibTeX gets no controls.
(() => {
  const items = document.querySelectorAll("[data-citation]");
  if (!items.length) return;

  for (const item of items) {
    const bibtex = item.querySelector("pre");
    if (!bibtex) continue;

    const actions = document.createElement("div");
    actions.className = "citation__actions";

    // Copying needs the clipboard API; showing does not, so the show control
    // appears even where the clipboard is unavailable.
    if (navigator.clipboard) {
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "button button--citation-solid";
      copy.textContent = "Copy BibTeX";
      copy.setAttribute("aria-label", "Copy BibTeX entry");

      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(bibtex.textContent.trim());
          copy.textContent = "Copied";
        } catch {
          // Clipboard access can be refused; say so rather than appear to work.
          copy.textContent = "Press Ctrl+C";
        }
        setTimeout(() => { copy.textContent = "Copy BibTeX"; }, 2000);
      });

      actions.append(copy);
    }

    const show = document.createElement("button");
    show.type = "button";
    show.className = "button button--citation-ghost";
    show.textContent = "Show BibTeX";
    show.setAttribute("aria-expanded", "false");
    show.setAttribute("aria-controls", bibtex.id);

    show.addEventListener("click", () => {
      const open = bibtex.hidden;
      bibtex.hidden = !open;
      show.setAttribute("aria-expanded", String(open));
      show.textContent = open ? "Hide BibTeX" : "Show BibTeX";
    });

    actions.append(show);
    bibtex.hidden = true;
    item.insertBefore(actions, bibtex);
  }
})();
