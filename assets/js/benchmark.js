// Behaviour for the BrainWideBench page: the intro video.
//
// The BibTeX controls are built by the shared assets/js/citation.js, which
// baseof.html loads on any page carrying `citations`, this one included.

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
