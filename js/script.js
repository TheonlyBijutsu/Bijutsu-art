document.addEventListener("DOMContentLoaded", () => {

  // ── SCROLL FADE-IN ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

  // ── MOBILE NAV ──
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

  // ── PORTFOLIO AUTO-DETECT ──
  // Naming convention:
  //   pfp.png, pfp1.png, pfp2.png ...     → Anime PFP category
  //   oc.png, oc1.png, c1.png, c2.png ... → OC Design category
  //   animation.mp4, anim1.mp4 ...         → Animation category
  // Supports: .png .jpg .jpeg .webp .gif .mp4 .webm

  const gallery = document.getElementById("portfolio-gallery");
  if (gallery) {
    const pfpNames   = ["pfp","pfp1","pfp2","pfp3","pfp4","pfp5","pfp6","pfp7","pfp8","pfp9","pfp10"];
    const ocNames    = ["oc","oc1","oc2","oc3","oc4","oc5","c1","c2","c3","c4","c5","char1","char2","char3"];
    const animNames  = ["animation","anim","anim1","anim2","animation1","animation2","video1","video2"];
    const imgExts    = ["png","jpg","jpeg","webp","gif"];
    const vidExts    = ["mp4","webm"];

    const items = [];

    function tryLoad(baseName, exts, category, label, isVideo) {
      exts.forEach(ext => {
        const src = `images/${baseName}.${ext}`;
        if (isVideo) {
          // For video, we probe with fetch HEAD (no-cors fallback: just add it)
          const vid = document.createElement("video");
          vid.src = src;
          vid.muted = true;
          vid.loop = true;
          vid.playsInline = true;
          vid.preload = "metadata";
          vid.onloadedmetadata = () => buildCard(src, category, label, true);
        } else {
          const img = new Image();
          img.onload = () => buildCard(src, category, label, false);
          img.src = src;
        }
      });
    }

    function buildCard(src, category, label, isVideo) {
      const card = document.createElement("div");
      card.className = "port-card fade-in";
      card.dataset.cat = category;

      if (isVideo) {
        const vid = document.createElement("video");
        vid.src = src;
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        vid.autoplay = true;
        vid.style.cssText = "width:100%;height:100%;object-fit:cover;position:absolute;inset:0;";
        card.appendChild(vid);
        card.addEventListener("mouseenter", () => vid.play());
        card.addEventListener("mouseleave", () => vid.pause());
      } else {
        const img = document.createElement("img");
        img.src = src;
        img.alt = label;
        img.style.cssText = "width:100%;height:100%;object-fit:cover;position:absolute;inset:0;";
        card.appendChild(img);
      }

      const overlay = document.createElement("div");
      overlay.className = "port-overlay";
      overlay.innerHTML = `<div class="port-title">${label}</div><div class="port-tag">${getCatLabel(category)}</div>`;
      card.appendChild(overlay);

      gallery.appendChild(card);

      // Re-observe for fade-in
      observer.observe(card);

      // Re-apply current filter
      const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter;
      if (activeFilter && activeFilter !== "all" && card.dataset.cat !== activeFilter) {
        card.style.display = "none";
      }
    }

    function getCatLabel(cat) {
      return cat === "pfp" ? "Anime PFP" : cat === "oc" ? "OC Design" : "Animation";
    }

    pfpNames.forEach((n, i)  => tryLoad(n, imgExts, "pfp",  `Anime PFP${i > 0 ? " #"+i : ""}`, false));
    ocNames.forEach((n, i)   => tryLoad(n, imgExts, "oc",   `OC Design${i > 0 ? " #"+i : ""}`, false));
    animNames.forEach((n, i) => tryLoad(n, vidExts, "anim", `Animation${i > 0 ? " #"+i : ""}`, true));
    // Also try .gif for animations
    animNames.forEach((n, i) => tryLoad(n, ["gif"], "anim", `Animation${i > 0 ? " #"+i : ""}`, false));
  }

  // ── PORTFOLIO FILTER ──
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      document.querySelectorAll(".port-card").forEach(card => {
        const show = filter === "all" || card.dataset.cat === filter;
        card.style.display = show ? "" : "none";
      });
    });
  });

  // ── PRICING TABS ──
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".pricing-panel").forEach(p => p.classList.remove("active"));
      const panel = document.getElementById("tab-" + btn.dataset.tab);
      if (panel) panel.classList.add("active");
    });
  });

  // ── FAQ ACCORDION ──
  document.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // ── CONTACT MAILTO GENERATOR ──
  const mailtoBtn = document.getElementById("generate-mailto");
  if (mailtoBtn) {
    mailtoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const name = document.getElementById("f-name")?.value || "(your name)";
      const pkg  = document.getElementById("f-package")?.value || "(not selected)";
      const desc = document.getElementById("f-desc")?.value || "(no description)";
      const refs = document.getElementById("f-refs")?.value || "None";
      const subject = encodeURIComponent("Commission Request — " + pkg);
      const body = encodeURIComponent(
        "Hi Bijutsu!\n\nName / Handle: " + name +
        "\nPackage: " + pkg +
        "\n\nCharacter / Idea:\n" + desc +
        "\n\nReferences:\n" + refs +
        "\n\nLooking forward to working with you!"
      );
      window.location.href = "mailto:errorarmy987@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  // ── HERO STAT COUNTER ANIMATION ──
  document.querySelectorAll(".stat-num[data-target]").forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    let current = 0;
    const step = Math.ceil(target / 60);
    const io2 = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        io2.disconnect();
        const tick = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(tick);
        }, 25);
      }
    });
    io2.observe(el);
  });

});
