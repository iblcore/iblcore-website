// Copy buttons for the BibTeX entries.
//
// Added here rather than in the template so that a browser without JavaScript
// shows no button at all, instead of one that does nothing. The entry stays
// selectable either way.
(() => {
  const entries = document.querySelectorAll("[data-citation]");
  if (!entries.length || !navigator.clipboard) return;

  for (const entry of entries) {
    const bibtex = entry.querySelector("pre");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bwb-copy";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy BibTeX entry");

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(bibtex.textContent.trim());
        button.textContent = "Copied";
      } catch {
        // Clipboard access can be refused; say so rather than appear to work.
        button.textContent = "Press Ctrl+C";
      }
      setTimeout(() => { button.textContent = "Copy"; }, 2000);
    });

    entry.insertBefore(button, bibtex);
  }
})();
