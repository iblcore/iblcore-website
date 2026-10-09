// Behaviour for the BrainWideBench page: the intro video and the BibTeX entries.

// Start the intro video only for visitors who have not asked for reduced
// motion. The markup omits `autoplay` because CSS cannot gate it, so playback
// is opted into here instead of switched off after the fact: nothing moves
// unrequested, and a browser without JavaScript simply shows the controls.
(() => {
  const video = document.querySelector("[data-bwb-video]");
  if (!video) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  video.autoplay = true;
  // Browsers may still refuse unprompted playback; the controls are right
  // there, so a rejection needs no recovery.
  video.play().catch(() => {});
})();

// Copy and show controls for the BibTeX entries.
//
// Added here rather than in the template so that a browser without JavaScript
// shows no button at all, instead of one that does nothing. The markup renders
// the entry open; this collapses it, so the BibTeX stays reachable either way.
(() => {
  const items = document.querySelectorAll("[data-citation]");
  if (!items.length) return;

  for (const item of items) {
    const bibtex = item.querySelector("pre");
    if (!bibtex) continue;

    const actions = document.createElement("div");
    actions.className = "bwb-citation__actions";

    // Copying needs the clipboard API; showing does not, so the show control
    // appears even where the clipboard is unavailable.
    if (navigator.clipboard) {
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "button button--bwb-solid";
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
    show.className = "button button--bwb-ghost";
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
