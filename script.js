/* ============================================================
   XYZ REAL ESTATE — DHOLERA
   script.js
   ============================================================ */
"use strict";

/* ============================================================
   ▓▓ CONFIGURATION — EDIT THIS SECTION FIRST ▓▓
   Replace every placeholder below with real, verified details.
   All phone/WhatsApp links, the office card, the footer, the
   enquiry-form fallback and the map links read from this object.

   • whatsapp:  digits only, with country code, no "+" or spaces
               (India = 91XXXXXXXXXX)
   • phoneHref: the tel: link, e.g. "+919876543210"
   • mapsUrl:   your Google Maps link (Share → Copy link)
   • mapsEmbedUrl: your office embed (Google Maps → Share →
               Embed a map → copy the src between the quotes)
   Leave a value as a placeholder ("[...]" / "XXX") and the
   page will visibly keep showing the placeholder — no fake
   details will be invented on your behalf.
   ============================================================ */
const SITE = {
  name: "XYZ Real Estate",
  address: "[XYZ COMPANY FULL ADDRESS]",
  phone: "[PHONE NUMBER]",
  phoneHref: "+910000000000",
  email: "[EMAIL ADDRESS]",
  website: "[DOMAIN NAME]",
  whatsapp: "91XXXXXXXXXX",
  mapsUrl: "",        // e.g. "https://maps.google.com/?q=Your+Office+Address"
  mapsEmbedUrl: "",   // e.g. "https://www.google.com/maps?q=...&output=embed"
};
/* ============================================================
   END OF CONFIGURATION
   ============================================================ */

const doc = document;
const $ = (sel, ctx = doc) => ctx.querySelector(sel);
const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
doc.documentElement.classList.add("js");

const isPlaceholder = (v) =>
  !v || typeof v !== "string" || v.includes("[") || v.includes("]") || v.includes("XXX");

/* ---------- Contextual WhatsApp messages (URL-encoded) ---------- */
const WA_MESSAGES = {
  general: `Hello ${SITE.name}. I would like to know more about the available Dholera properties. Please share the location, price, plot size, and available property documents.`,
  residential: `Hello ${SITE.name}. I am interested in a residential plot in Dholera. Please share available plots with location, size, price and documents.`,
  parcel: `Hello ${SITE.name}. I am interested in a large land parcel in Dholera. Please share available parcels with area, location, land-use information and price.`,
  "site-visit": `Hello ${SITE.name}, I would like to schedule a site visit to view the Dholera plots/parcels available. Please suggest dates, share the exact location, and tell me what documents I should carry.`,
};
const listingMessage = (name) =>
  `Hello ${SITE.name}. I saw “${name}” on your website (a sample listing). Please confirm current availability and share location, size, price and the available documents.`;

const waLink = (message) =>
  `https://wa.me/${isPlaceholder(SITE.whatsapp) ? "91XXXXXXXXXX" : SITE.whatsapp}?text=${encodeURIComponent(message)}`;

/* ---------- 1. Inject configured company details ---------- */
(function applySiteConfig() {
  $$('[data-site="name"]').forEach((el) => { el.textContent = SITE.name; });
  if (!isPlaceholder(SITE.address)) $$('[data-site="address"]').forEach((el) => { el.textContent = SITE.address; });
  if (!isPlaceholder(SITE.phone)) $$('[data-site="phone"]').forEach((el) => { el.textContent = SITE.phone; });
  if (!isPlaceholder(SITE.email)) $$('[data-site="email"]').forEach((el) => { el.textContent = SITE.email; });
  if (!isPlaceholder(SITE.website)) $$('[data-site="website"]').forEach((el) => { el.textContent = SITE.website; });

  const telHref = isPlaceholder(SITE.phoneHref) ? "#" : `tel:${SITE.phoneHref.replace(/[^+\d]/g, "")}`;
  $$(".js-tel").forEach((el) => { el.href = telHref; });
  $$(".js-mail").forEach((el) => { el.href = isPlaceholder(SITE.email) ? "#" : `mailto:${SITE.email}`; });
  $$(".js-maps-link").forEach((el) => {
    el.href = !isPlaceholder(SITE.mapsUrl) ? SITE.mapsUrl : "https://maps.google.com/?q=Dholera,+Gujarat";
  });

  /* Directions button: only visible once a real maps link is configured */
  const dirBtn = $(".js-directions");
  const dirHint = $("#officeHint");
  if (!isPlaceholder(SITE.mapsUrl) && dirBtn) {
    dirBtn.href = SITE.mapsUrl;
    dirBtn.hidden = false;
    if (dirHint) dirHint.hidden = true;
  }

  /* Map embed: swap the illustrative area map for the verified office */
  const mapFrame = $(".map-frame__embed");
  if (mapFrame && !isPlaceholder(SITE.mapsEmbedUrl)) {
    mapFrame.src = SITE.mapsEmbedUrl;
    mapFrame.title = `${SITE.name} — corporate office location`;
    const note = $(".map-note");
    if (note) note.textContent = "Corporate office location. “Get Directions” is enabled via the SITE config in script.js.";
  }

  /* Website link (footer) */
  const siteLink = $(".js-website");
  if (siteLink) {
    if (isPlaceholder(SITE.website)) {
      siteLink.href = "#";
      siteLink.setAttribute("aria-disabled", "true");
    } else {
      siteLink.href = SITE.website.startsWith("http") ? SITE.website : `https://${SITE.website}`;
    }
  }

  /* WhatsApp links — general + contextual + per-listing */
  $$("[data-wa]").forEach((el) => { el.href = waLink(WA_MESSAGES[el.dataset.wa] || WA_MESSAGES.general); });
  $$("[data-wa-listing]").forEach((el) => { el.href = waLink(listingMessage(el.dataset.waListing)); });
})();

/* ---------- 2. Header: compact on scroll ---------- */
(function initHeader() {
  const header = $("#siteHeader");
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

/* ---------- 3. Mobile menu ---------- */
(function initMobileMenu() {
  const header = $("#siteHeader");
  const toggle = $("#menuToggle");
  const menu = $("#mobileMenu");
  if (!header || !toggle || !menu) return;
  let open = false;

  const setOpen = (next) => {
    open = next;
    header.classList.toggle("is-open", open);
    doc.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    if (open) {
      const first = $(".mobile-menu__link", menu);
      window.setTimeout(() => { if (first) first.focus({ preventScroll: true }); }, 250);
    } else {
      toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener("click", () => setOpen(!open));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  doc.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && open) setOpen(false);
  });
})();

/* ---------- 4. Hero headline: line-mask word split + reveal ---------- */
(function initHeroTitle() {
  const title = $("#heroTitle");
  if (!title) return;
  const lines = $$(".split-line", title);
  lines.forEach((line, li) => {
    line.style.setProperty("--line", li);
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = "";
    words.forEach((word, wi) => {
      const outer = doc.createElement("span");
      outer.className = "s-w";
      const inner = doc.createElement("span");
      inner.className = "s-i";
      inner.style.setProperty("--i", wi);
      inner.textContent = word;
      outer.appendChild(inner);
      line.appendChild(outer);
      if (wi < words.length - 1) line.appendChild(doc.createTextNode(" "));
    });
  });
  if (prefersReducedMotion) {
    title.classList.add("is-in");
  } else {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => title.classList.add("is-in"), 180);
    });
  }
})();

/* ---------- 5. Reveal-on-scroll (IntersectionObserver) ---------- */
(function initReveals() {
  const items = $$("[data-reveal]");
  if (!items.length) return;
  items.forEach((el) => {
    if (el.dataset.delay) el.style.setProperty("--delay", `${el.dataset.delay}ms`);
  });
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((el) => io.observe(el));
})();

/* ---------- 6. Hero parallax (background wrapper, subtle) ---------- */
(function initHeroParallax() {
  const media = $(".hero__media");
  const img = $("#heroImg");
  if (!media || !img || prefersReducedMotion) return;
  let ticking = false;
  const update = () => {
    const y = Math.min(window.scrollY, 900);
    if (y < window.innerHeight * 1.2) {
      media.style.transform = `translateY(${(y * 0.16).toFixed(1)}px) scale(1.07)`;
    }
    ticking = false;
  };
  media.style.transition = "none";
  window.addEventListener("scroll", () => {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

/* ---------- 6B. Hero 3-Second Auto-Slideshow (Seamless Loop) ---------- */
(function initHeroSlideshow() {
  const heroMedia = $(".hero__media");
  if (!heroMedia) return;

  const slides = $$(".hero__slide", heroMedia);
  if (slides.length <= 1) return;

  let currentIndex = 0;
  const interval = 3000; // 3 seconds loop as requested
  let timer = null;

  // Preload all 5 images for buttery smooth transitions
  slides.forEach((slide) => {
    const img = $("img", slide);
    if (img && img.src) {
      const preloader = new Image();
      preloader.src = img.src;
    }
  });

  function nextSlide() {
    slides[currentIndex].classList.remove("is-active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("is-active");
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!document.hidden) {
        nextSlide();
      }
    }, interval);
  }

  // Pause when tab is hidden, resume when tab is active
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      startTimer();
    }
  });

  startTimer();
})();

/* ---------- 7. Slide Showcase Slider Layout ---------- */
(function initSlider() {
  const container = $("#sliderSection");
  if (!container) return;

  const slidesText = $$(".slider-slide-text", container);
  const slidesMedia = $$(".slider-slide-media", container);
  const prevBtn = $(".slider-nav-btn--prev", container);
  const nextBtn = $(".slider-nav-btn--next", container);

  if (!slidesText.length || slidesText.length !== slidesMedia.length) return;

  let current = 0;
  const total = slidesText.length;
  let isAnimating = false;

  const setSlide = (index) => {
    if (isAnimating) return;
    isAnimating = true;

    // Normalise wrap-around index
    const nextIndex = (index + total) % total;

    slidesText.forEach((slide, i) => {
      const active = i === nextIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", (!active).toString());
    });

    slidesMedia.forEach((media, i) => {
      const active = i === nextIndex;
      media.classList.toggle("is-active", active);
      media.setAttribute("aria-hidden", (!active).toString());
    });

    current = nextIndex;

    setTimeout(() => {
      isAnimating = false;
    }, 450);
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => setSlide(current - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => setSlide(current + 1));
  }

  // Keyboard navigation when focusing inside the container
  container.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSlide(current - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSlide(current + 1);
    }
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  container.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  container.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          setSlide(current + 1);
        } else {
          setSlide(current - 1);
        }
      }
    },
    { passive: true }
  );
})();

/* ---------- 7B. Leadership Marquee (Touch Pause & Seamless Auto Scroll) ---------- */
(function initLeadershipMarquee() {
  const marquee = $(".leadership__marquee");
  if (!marquee) return;
  const track = $(".leadership__track", marquee);
  if (!track) return;

  marquee.addEventListener("touchstart", () => {
    track.style.animationPlayState = "paused";
  }, { passive: true });

  marquee.addEventListener("touchend", () => {
    track.style.animationPlayState = "running";
  }, { passive: true });

  marquee.addEventListener("touchcancel", () => {
    track.style.animationPlayState = "running";
  }, { passive: true });
})();

/* ---------- 8. Animated counters (en-IN formatting) ---------- */
(function initCounters() {
  const nums = $$("[data-count]");
  if (!nums.length) return;
  const fmt = (n) => n.toLocaleString("en-IN");
  const run = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (prefersReducedMotion) { el.textContent = fmt(target); return; }
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (t < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };
  if (!("IntersectionObserver" in window)) {
    nums.forEach(run);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((el) => io.observe(el));
})();

/* ---------- 9. Listing detail dialog ---------- */
const LISTINGS = {
  r1: {
    name: "Residential Plot — R1",
    category: "Residential Plot",
    image: "https://images.pexels.com/photos/31639625/pexels-photo-31639625.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=700",
    specs: [
      ["Location", "Dholera SIR · Kheda District"],
      ["Area", "2,400 sq ft (223 m²)"],
      ["Land use", "Residential"],
      ["Documents", "Shared on enquiry"],
      ["Possession", "On enquiry"],
      ["Price", "Request Price"],
    ],
  },
  r2: {
    name: "Residential Plot — R2",
    category: "Residential Plot",
    image: "https://images.pexels.com/photos/3127158/pexels-photo-3127158.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=700",
    specs: [
      ["Location", "Dholera SIR · Kheda District"],
      ["Area", "3,600 sq ft (334 m²)"],
      ["Land use", "Residential"],
      ["Documents", "Shared on enquiry"],
      ["Possession", "On enquiry"],
      ["Price", "Request Price"],
    ],
  },
  p1: {
    name: "Land Parcel — P1",
    category: "Large Land Parcel",
    image: "https://images.pexels.com/photos/20286964/pexels-photo-20286964.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=700",
    specs: [
      ["Location", "Near Dholera SIR · Kheda District"],
      ["Area", "2.5 acres (1.01 ha)"],
      ["Land use", "On enquiry"],
      ["Documents", "Shared on enquiry"],
      ["Access", "On enquiry"],
      ["Price", "Request Price"],
    ],
  },
  p2: {
    name: "Land Parcel — P2",
    category: "Large Land Parcel",
    image: "https://images.pexels.com/photos/12867727/pexels-photo-12867727.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=700",
    specs: [
      ["Location", "Near Dholera SIR · Kheda District"],
      ["Area", "8 acres (3.24 ha)"],
      ["Land use", "On enquiry"],
      ["Documents", "Shared on enquiry"],
      ["Access", "On enquiry"],
      ["Price", "Request Price"],
    ],
  },
};

(function initListingDialog() {
  const dialog = $("#listingDialog");
  if (!dialog) return;
  const closeBtn = $("#listingClose");
  const titleEl = $("#listingDialogTitle");
  const catEl = $("#listingCategory");
  const imgEl = $("#listingImg");
  const specsEl = $("#listingSpecs");
  const waBtn = $("#listingWa");
  let lastFocus = null;

  const open = (id) => {
    const data = LISTINGS[id];
    if (!data || typeof dialog.showModal !== "function") return;
    lastFocus = doc.activeElement;
    titleEl.textContent = data.name;
    catEl.textContent = data.category;
    imgEl.src = data.image;
    imgEl.alt = `${data.name} — sample listing image (placeholder)`;
    specsEl.innerHTML = "";
    data.specs.forEach(([label, value]) => {
      const li = doc.createElement("li");
      const l = doc.createElement("span");
      const v = doc.createElement("span");
      l.textContent = label;
      v.textContent = value;
      li.appendChild(l);
      li.appendChild(v);
      specsEl.appendChild(li);
    });
    if (waBtn) waBtn.href = waLink(listingMessage(data.name));
    dialog.showModal();
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
  };

  $$("[data-listing]").forEach((btn) => {
    btn.addEventListener("click", () => open(btn.dataset.listing));
  });
  if (closeBtn) closeBtn.addEventListener("click", close);
  /* backdrop click (clicks on the dialog padding itself, not content) */
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener("close", () => {
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus({ preventScroll: true });
  });
})();

/* ---------- 10. Contact form — validation + WhatsApp fallback ---------- */
(function initForm() {
  const form = $("#enquiryForm");
  if (!form) return;
  const success = $("#formSuccess");
  const fields = {
    name: {
      el: $("#fName"),
      err: $("#fNameError"),
      validate: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    },
    phone: {
      el: $("#fPhone"),
      err: $("#fPhoneError"),
      validate: (v) => {
        const digits = v.replace(/[^\d]/g, "");
        if (digits.length < 10 || digits.length > 15) return "Please enter a valid mobile number (10–15 digits).";
        return "";
      },
    },
  };

  const clearError = (f) => {
    if (!f || !f.el) return;
    f.el.classList.remove("is-invalid");
    f.el.removeAttribute("aria-invalid");
    if (f.err) f.err.textContent = "";
  };
  const showError = (f, msg) => {
    if (!f || !f.el) return;
    f.el.classList.add("is-invalid");
    f.el.setAttribute("aria-invalid", "true");
    if (f.err) f.err.textContent = msg;
  };

  Object.values(fields).forEach((f) => {
    if (!f || !f.el) return;
    f.el.addEventListener("input", () => clearError(f));
    f.el.addEventListener("blur", () => {
      const msg = f.validate(f.el.value);
      if (msg) showError(f, msg); else clearError(f);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstInvalid = null;
    Object.values(fields).forEach((f) => {
      if (!f || !f.el) return;
      const msg = f.validate(f.el.value);
      if (msg) { showError(f, msg); if (!firstInvalid) firstInvalid = f.el; }
      else clearError(f);
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const email = $("#fEmail") ? $("#fEmail").value.trim() : "";
    const message = $("#fMessage") ? $("#fMessage").value.trim() : "";

    const lines = [
      `Hello ${SITE.name}. New message from your website.`,
      `Name: ${fields.name.el.value.trim()}`,
      `Contact: ${fields.phone.el.value.trim()}`,
    ];
    if (email) lines.push(`Email: ${email}`);
    if (message) lines.push(`Message: ${message}`);
    lines.push("Please get in touch with me.");

    window.open(waLink(lines.join("\n")), "_blank", "noopener");
    if (success) success.hidden = false;
    form.reset();
  });
})();

/* ---------- 10B. Testimonials Auto Slider (4s Interval, 5 Cards Total, Infinite Loop) ---------- */
(function initTestimonialsSlider() {
  const container = $("#testimonialsCarousel");
  const track = $("#testimonialsTrack");
  const prevBtn = $("#testiPrev");
  const nextBtn = $("#testiNext");
  const dots = $$(".testimonials-dot");

  if (!container || !track) return;

  const originalCards = $$(".testimonial-card", track);
  const totalOriginal = originalCards.length;
  if (totalOriginal === 0) return;

  // Clone 3 cards at each end for smooth infinite looping
  const cloneCount = 3;
  for (let i = totalOriginal - cloneCount; i < totalOriginal; i++) {
    const clone = originalCards[i].cloneNode(true);
    clone.classList.add("is-clone");
    clone.setAttribute("aria-hidden", "true");
    track.insertBefore(clone, track.firstChild);
  }
  for (let i = 0; i < cloneCount; i++) {
    const clone = originalCards[i].cloneNode(true);
    clone.classList.add("is-clone");
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  }

  let currentIndex = cloneCount;
  let isTransitioning = false;
  let autoTimer = null;

  const getStepWidth = () => {
    const card = $(".testimonial-card", track);
    if (!card) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return card.offsetWidth + gap;
  };

  const updateSlidePosition = (animated = true) => {
    const step = getStepWidth();
    track.style.transition = animated ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
    track.style.transform = `translateX(-${currentIndex * step}px)`;

    const realIndex = ((currentIndex - cloneCount) % totalOriginal + totalOriginal) % totalOriginal;
    dots.forEach((dot, idx) => {
      const active = idx === realIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active.toString());
    });
  };

  track.addEventListener("transitionend", () => {
    isTransitioning = false;
    if (currentIndex >= cloneCount + totalOriginal) {
      currentIndex = cloneCount;
      updateSlidePosition(false);
    } else if (currentIndex < cloneCount) {
      currentIndex = cloneCount + totalOriginal - 1;
      updateSlidePosition(false);
    }
  });

  const nextSlide = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateSlidePosition(true);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateSlidePosition(true);
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoTimer();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = cloneCount + idx;
      updateSlidePosition(true);
      resetAutoTimer();
    });
  });

  // 4s Auto-slide (Right-to-Left)
  const startAutoTimer = () => {
    if (prefersReducedMotion) return;
    stopAutoTimer();
    autoTimer = setInterval(nextSlide, 4000);
  };

  const stopAutoTimer = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const resetAutoTimer = () => {
    stopAutoTimer();
    startAutoTimer();
  };

  // Pause on hover or focus
  container.addEventListener("mouseenter", stopAutoTimer);
  container.addEventListener("mouseleave", startAutoTimer);
  container.addEventListener("focusin", stopAutoTimer);
  container.addEventListener("focusout", startAutoTimer);

  const bottomBar = $(".testimonials__bottom-bar");
  if (bottomBar) {
    bottomBar.addEventListener("mouseenter", stopAutoTimer);
    bottomBar.addEventListener("mouseleave", startAutoTimer);
  }

  // Touch gesture support
  let touchStartX = 0;
  let isSwiping = false;

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
    stopAutoTimer();
  }, { passive: true });

  container.addEventListener("touchend", (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
    startAutoTimer();
  }, { passive: true });

  // Handle window resizing
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSlidePosition(false);
    }, 100);
  });

  // Initial setup
  requestAnimationFrame(() => {
    updateSlidePosition(false);
    startAutoTimer();
  });
})();

/* ---------- 11. Dynamic copyright year ---------- */
(function initYear() {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

/* ---------- 12. FAQ Accordion ---------- */
(function initFAQAccordion() {
  const faqSection = $("#faq");
  if (!faqSection) return;

  const items = $$(".faq-item", faqSection);
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = $(".faq-item__trigger", item);
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isExpanded = item.classList.contains("is-active");

      // Close all other items for a clean accordion flow
      items.forEach((other) => {
        if (other !== item && other.classList.contains("is-active")) {
          other.classList.remove("is-active");
          const otherTrigger = $(".faq-item__trigger", other);
          if (otherTrigger) {
            otherTrigger.setAttribute("aria-expanded", "false");
          }
        }
      });

      // Toggle current item
      if (isExpanded) {
        item.classList.remove("is-active");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-active");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
})();

/* ============================================================
   13. EXPLORE OUR LEGACY (INTERACTIVE 4S SHOWCASE)
   ============================================================ */
(function initLegacyShowcase() {
  const showcase = $("#legacyShowcase");
  if (!showcase) return;

  const items = $$(".legacy-item", showcase);
  const slides = $$(".legacy__media-slide", showcase);
  if (!items.length || !slides.length) return;

  let currentIndex = 0;
  const duration = 4000; // 4 seconds auto-switch
  let timer = null;
  let isHovered = false;
  let isVisible = false;

  function setSlide(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;

    // 1. Update left accordion items
    items.forEach((item, i) => {
      const isCurrent = i === index;
      item.classList.toggle("is-active", isCurrent);
      item.setAttribute("aria-selected", isCurrent ? "true" : "false");
      
      const header = $(".legacy-item__header", item);
      if (header) {
        header.setAttribute("aria-expanded", isCurrent ? "true" : "false");
      }

      // Reset and trigger smooth progress bar animation
      const progress = $(".legacy-item__progress", item);
      if (progress) {
        progress.style.transition = "none";
        progress.style.width = "0%";
        if (isCurrent && !isHovered) {
          // Force layout reflow to restart transition
          void progress.offsetWidth;
          progress.style.transition = `width ${duration}ms linear`;
          progress.style.width = "100%";
        }
      }
    });

    // 2. Crossfade right media slides
    slides.forEach((slide) => {
      const targetIndex = parseInt(slide.getAttribute("data-legacy-target"), 10) - 1;
      slide.classList.toggle("is-active", targetIndex === index);
    });
  }

  function startTimer() {
    clearTimeout(timer);
    if (isHovered || !isVisible) return;

    timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      setSlide(nextIndex);
      startTimer();
    }, duration);
  }

  // Click & keyboard triggers for each item
  items.forEach((item, index) => {
    const header = $(".legacy-item__header", item);
    const trigger = header || item;

    trigger.addEventListener("click", (e) => {
      // Don't override if user is clicking on inner CTA link
      if (e.target.closest(".legacy-item__btn")) return;
      setSlide(index);
      startTimer();
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSlide(index);
        startTimer();
      }
    });
  });

  // Pause on mouse hover so user can read comfortably
  showcase.addEventListener("mouseenter", () => {
    isHovered = true;
    clearTimeout(timer);
    const activeProgress = $(".legacy-item.is-active .legacy-item__progress", showcase);
    if (activeProgress) {
      const currentWidth = window.getComputedStyle(activeProgress).width;
      activeProgress.style.transition = "none";
      activeProgress.style.width = currentWidth;
    }
  });

  // Resume when mouse leaves
  showcase.addEventListener("mouseleave", () => {
    isHovered = false;
    const activeProgress = $(".legacy-item.is-active .legacy-item__progress", showcase);
    if (activeProgress) {
      activeProgress.style.transition = "width 2500ms linear";
      activeProgress.style.width = "100%";
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      setSlide(nextIndex);
      startTimer();
    }, 2500);
  });

  // IntersectionObserver: Only auto-advance when section is in viewport
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            setSlide(currentIndex);
            startTimer();
          } else {
            isVisible = false;
            clearTimeout(timer);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(showcase);
  } else {
    isVisible = true;
    setSlide(0);
    startTimer();
  }
})();

/* ============================================================
   14. CONSTRUCTION EXPERTISE ACROSS MULTIPLE SECTORS (4S SHOWCASE)
   ============================================================ */
(function initExpertiseShowcase() {
  const showcase = $("#expertiseShowcase");
  if (!showcase) return;

  const items = $$(".expertise-item", showcase);
  const slides = $$(".expertise__media-slide", showcase);
  if (!items.length || !slides.length) return;

  let currentIndex = 0;
  const duration = 4000; // 4 seconds auto-switch
  let timer = null;
  let isHovered = false;
  let isVisible = false;

  function setSlide(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;

    // 1. Update sectors list items
    items.forEach((item, i) => {
      const isCurrent = i === index;
      item.classList.toggle("is-active", isCurrent);
      item.setAttribute("aria-selected", isCurrent ? "true" : "false");
      
      const header = $(".expertise-item__header", item);
      if (header) {
        header.setAttribute("aria-expanded", isCurrent ? "true" : "false");
      }

      // Reset and trigger smooth progress bar animation
      const progress = $(".expertise-item__progress", item);
      if (progress) {
        progress.style.transition = "none";
        progress.style.width = "0%";
        if (isCurrent && !isHovered) {
          // Force layout reflow to restart transition
          void progress.offsetWidth;
          progress.style.transition = `width ${duration}ms linear`;
          progress.style.width = "100%";
        }
      }
    });

    // 2. Crossfade media slides
    slides.forEach((slide) => {
      const targetIndex = parseInt(slide.getAttribute("data-expertise-target"), 10) - 1;
      slide.classList.toggle("is-active", targetIndex === index);
    });
  }

  function startTimer() {
    clearTimeout(timer);
    if (isHovered || !isVisible) return;

    timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      setSlide(nextIndex);
      startTimer();
    }, duration);
  }

  // Click & keyboard triggers for each item
  items.forEach((item, index) => {
    const header = $(".expertise-item__header", item);
    const trigger = header || item;

    trigger.addEventListener("click", (e) => {
      // Don't override if user is clicking on inner CTA link
      if (e.target.closest(".expertise-item__btn")) return;
      setSlide(index);
      startTimer();
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSlide(index);
        startTimer();
      }
    });
  });

  // Pause on mouse hover so user can read comfortably
  showcase.addEventListener("mouseenter", () => {
    isHovered = true;
    clearTimeout(timer);
    const activeProgress = $(".expertise-item.is-active .expertise-item__progress", showcase);
    if (activeProgress) {
      const currentWidth = window.getComputedStyle(activeProgress).width;
      activeProgress.style.transition = "none";
      activeProgress.style.width = currentWidth;
    }
  });

  // Resume when mouse leaves
  showcase.addEventListener("mouseleave", () => {
    isHovered = false;
    const activeProgress = $(".expertise-item.is-active .expertise-item__progress", showcase);
    if (activeProgress) {
      activeProgress.style.transition = "width 2500ms linear";
      activeProgress.style.width = "100%";
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      setSlide(nextIndex);
      startTimer();
    }, 2500);
  });

  // IntersectionObserver: Only auto-advance when section is in viewport
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            setSlide(currentIndex);
            startTimer();
          } else {
            isVisible = false;
            clearTimeout(timer);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(showcase);
  } else {
    isVisible = true;
    setSlide(0);
    startTimer();
  }
})();
