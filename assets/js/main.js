const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-faq-accordion]").forEach((accordion) => {
  const items = accordion.querySelectorAll(".faq-item");

  const setOpen = (item, isOpen) => {
    const button = item.querySelector(".faq-item__question");
    const answer = item.querySelector(".faq-item__answer");

    if (!button || !answer) {
      return;
    }

    item.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    answer.setAttribute("aria-hidden", String(!isOpen));
    answer.inert = !isOpen;
  };

  items.forEach((item) => {
    const button = item.querySelector(".faq-item__question");

    if (!button) {
      return;
    }

    setOpen(item, false);

    button.addEventListener("click", () => {
      setOpen(item, !item.classList.contains("is-open"));
    });
  });

  accordion.classList.add("faq-accordion-ready");
});
