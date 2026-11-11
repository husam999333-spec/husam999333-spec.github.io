(() => {
  const d = document;
  const nav = d.querySelector(".nav");
  const burger = d.querySelector(".burger");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sticky nav background
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 20);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  d.querySelectorAll(".links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  // Reveal on scroll
  const items = d.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add("in"));

  // Count-up stats
  const counters = d.querySelectorAll("[data-count]");
  const run = (el) => {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && !reduce) {
    const co = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } }), { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  // Active nav link
  const links = [...d.querySelectorAll(".links a")];
  const map = { about: "about", services: "services", work: "work", ads: "work", creative: "work", websites: "work", experience: "experience", skills: "experience", education: "experience", contact: "contact" };
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = map[e.target.id];
      links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    d.querySelectorAll("section[id]").forEach((s) => so.observe(s));
  }

  // Lightbox
  const lb = d.getElementById("lb");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  let last = null;
  const close = () => { lb.hidden = true; d.body.style.overflow = ""; last && last.focus(); };
  d.querySelectorAll(".zoom").forEach((b) =>
    b.addEventListener("click", () => {
      last = b;
      lbImg.src = b.dataset.full;
      lbImg.alt = b.dataset.cap || "";
      lbCap.textContent = b.dataset.cap || "";
      lb.hidden = false;
      d.body.style.overflow = "hidden";
      lb.querySelector(".lb-x").focus();
    })
  );
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lb-x")) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) close(); });
})();
