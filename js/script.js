
document.addEventListener("DOMContentLoaded", () => {
  // ── SCROLL FADE-IN ANIMATIONS ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, {threshold: 0.15});

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

  // ── MOBILE NAV (hamburger) ──
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navOverlay = document.getElementById("nav-overlay");

  function closeMobileNav() {
    navToggle?.classList.remove("open");
    navLinks?.classList.remove("open");
    navOverlay?.classList.remove("open");
  }

  navToggle?.addEventListener("click", () => {
    const open = !navLinks.classList.contains("open");
    navToggle.classList.toggle("open", open);
    navLinks.classList.toggle("open", open);
    navOverlay?.classList.toggle("open", open);
  });

  navOverlay?.addEventListener("click", closeMobileNav);
  navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMobileNav));

  const gallery = document.getElementById("portfolio-gallery");
  if (gallery) {
    const files = ["portfolio.jpg"];
    for (let i = 1; i <= 10; i++) files.push(`portfolio${i}.jpg`);
    files.forEach(file => {
      const img = new Image();
      img.onload = () => {
        const card = document.createElement("div");
        card.className = "card gallery-card reveal visible";
        card.appendChild(img);
        gallery.appendChild(card);
      };
      img.src = `images/${file}`;
      img.alt = file;
    });
  }
});

