
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, {threshold: 0.15});

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

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
