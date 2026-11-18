// Start a looping clip only for visitors who have not asked for reduced
// motion.
//
// The markup omits `autoplay` because neither CSS nor a media query can gate
// it: hiding a playing clip stops the motion but still downloads the file
// behind it. Playback is opted into here instead of switched off after the
// fact, so nothing moves unrequested, nothing is fetched unrequested, and a
// browser without JavaScript simply shows the poster and its controls.
(() => {
  const clips = document.querySelectorAll("[data-autoplay-clip]");
  if (!clips.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (const clip of clips) {
    clip.preload = "auto";
    clip.autoplay = true;
    // Browsers may still refuse unprompted playback; the controls are right
    // there, so a rejection needs no recovery.
    clip.play().catch(() => {});
  }
})();
