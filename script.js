/* ==========================================================================
   VERMONT AVENUE RECORDS — script.js
   Lenis smooth scroll + GSAP ScrollTrigger + canvas EQ + cursor + reveals
   ========================================================================== */

"use strict";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- SMOOTH SCROLL (Lenis) ---------- */
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links -> smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    });
  });

  /* ---------- CUSTOM CURSOR ---------- */
  const cursor = document.querySelector(".cursor");
  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");
  const label = cursor.querySelector(".cursor__label");

  if (!isTouch && !prefersReduced) {
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    window.addEventListener("mousemove", (e) => {
      dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY);
    });

    const setHover = (el, txt) => {
      cursor.classList.add("is-hover");
      label.textContent = txt || "";
    };
    const clearHover = () => cursor.classList.remove("is-hover");

    document.querySelectorAll("a, button, input, .roster__row").forEach((el) => {
      el.addEventListener("mouseenter", () => setHover(el, el.dataset.cursor || ""));
      el.addEventListener("mouseleave", clearHover);
    });
    document.addEventListener("mousedown", () => cursor.classList.add("is-down"));
    document.addEventListener("mouseup", () => cursor.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => cursor.classList.add("is-hover"));
    document.addEventListener("mouseenter", clearHover);
  } else {
    cursor.style.display = "none";
  }

  /* ---------- SPLIT HERO TITLE INTO LETTERS ---------- */
  const splitChars = (el) => {
    const text = (el.dataset.text || el.textContent).trim();
    el.textContent = "";
    el.setAttribute("aria-label", text);
    const frag = document.createDocumentFragment();
    [...text].forEach((ch) => {
      const mask = document.createElement("span");
      mask.className = "ch-mask";
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = ch === " " ? "\u00A0" : ch;
      mask.appendChild(span);
      frag.appendChild(mask);
    });
    el.appendChild(frag);
  };

  document.querySelectorAll(".hero__line").forEach(splitChars);

  // Populate any remaining empty [data-text] elements (footer wordmark, etc.)
  document.querySelectorAll("[data-text]").forEach((el) => {
    if (el.textContent.trim() === "") el.textContent = el.dataset.text;
  });

  /* ---------- HERO GYRO (subtle mouse-tilt, composes with scroll parallax) ---------- */
  const heroEl = document.querySelector(".hero");
  const vinyl = document.getElementById("heroVinyl");
  if (heroEl && vinyl && !isTouch && !prefersReduced) {
    let leaveTo = null;
    heroEl.addEventListener("mousemove", (e) => {
      if (leaveTo) clearTimeout(leaveTo);
      const r = heroEl.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(vinyl, { rotationY: x * 7, rotationX: y * 6, transformPerspective: 900, duration: 0.6, ease: "power2.out" });
    });
    heroEl.addEventListener("mouseleave", () => {
      leaveTo = setTimeout(() => {
        gsap.to(vinyl, { rotationY: 0, rotationX: 0, duration: 0.9, ease: "power3.out" });
      }, 200);
    });
  }

  /* ---------- PRELOADER ---------- */
  const preloader = document.querySelector(".preloader");
  const preCount = document.querySelector(".pre__count");
  const preLines = document.querySelectorAll(".pre__word-line");
  const preFill = document.querySelector(".pre__bar-fill");
  const countObj = { v: 0 };

  const heroIntro = () => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // nav
    tl.from(".nav", { y: -30, opacity: 0, duration: 0.8 }, 0.1);

    // hero title letters
    tl.from(".hero__line .ch", {
      yPercent: 120,
      duration: 1.1,
      stagger: { each: 0.03, from: "start" }
    }, 0.25);

    // supporting hero elements
    tl.from(".hero__records", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.75);
    tl.from(".hero__tag", { y: 20, opacity: 0, duration: 0.7 }, 0.9);
    tl.from(".hero__meta", { opacity: 0, duration: 0.8, stagger: 0.1 }, 0.7);
    tl.from(".hero__vinyl", { scale: 0.6, opacity: 0, duration: 1, ease: "back.out(1.4)" }, 0.5);
    tl.from(".hero__scroll", { opacity: 0, duration: 0.6 }, 1.15);
    tl.from(".hero__eq", { opacity: 0, duration: 1.2 }, 0.4);
  };

  if (prefersReduced) {
    preloader.style.display = "none";
    gsap.set(".reveal", { opacity: 1, y: 0 });
    heroIntro();
  } else {
    const counterTween = gsap.to(countObj, {
      v: 100,
      duration: 2.0,
      ease: "power2.inOut",
      onUpdate: () => {
        preCount.textContent = String(Math.round(countObj.v)).padStart(2, "0");
        preFill.style.width = countObj.v + "%";
      }
    });

    gsap.to(preLines, {
      yPercent: -110,
      stagger: 0.08,
      duration: 0.7,
      ease: "power4.in",
      delay: 1.9
    });

    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      delay: 2.3,
      onStart: heroIntro,
      onComplete: () => { preloader.style.display = "none"; counterTween.kill(); }
    });
  }

  /* ---------- CANVAS EQUALIZER ---------- */
  const initEq = (canvas) => {
    const ctx = canvas.getContext("2d");
    let W, H, bars = [], barCount = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      barCount = Math.max(16, Math.floor(W / 12));
      bars = [];
      for (let i = 0; i < barCount; i++) {
        bars.push({
          phase: Math.random() * Math.PI * 2,
          speed: 0.25 + Math.random() * 0.36,   // 0.25–0.61 rad/s -> ~10–25s cycles (slow to regular, never fast)
          pulse: 0.18 + Math.random() * 0.22,   // slow secondary undulation
          base: 0.28 + Math.random() * 0.32,
          amp: 0.32 + Math.random() * 0.42
        });
      }
    };

    /* Fixed-timestep clock so scroll/jank can NEVER speed up the bars.
       Phase advances exactly (real elapsed time) seconds, consumed in 32ms
       logical ticks — immune to rAF bursts or throttling. */
    let eqT = 0, lastNow = null, pending = 0;
    const STEP = 0.032;   // 32ms logical tick (~31fps update)

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      const t = eqT;
      const bw = W / barCount;
      for (let i = 0; i < bars.length; i++) {
        const b = bars[i];
        const s = b.speed;
        const v = b.base +
          Math.sin(t * s + b.phase) * b.amp * 0.6 +
          Math.sin(t * s * 0.45 + b.phase * 1.3) * b.amp * 0.35 +
          Math.sin(t * b.pulse + b.phase * 0.6) * b.amp * 0.25;
        const h = Math.max(0.04, Math.min(1, v)) * H;
        const x = i * bw;
        const grad = ctx.createLinearGradient(0, H, 0, H - h);
        grad.addColorStop(0, "rgba(255,162,51,0.05)");
        grad.addColorStop(1, "rgba(255,162,51,0.85)");
        ctx.fillStyle = grad;
        ctx.fillRect(x + bw * 0.15, H - h, bw * 0.7, h);
      }
    };

    const tick = (now) => {
      if (lastNow === null) lastNow = now;
      let dt = (now - lastNow) / 1000;      // real elapsed seconds
      if (dt < 0) dt = 0;
      if (dt > 0.05) dt = 0.05;            // clamp hiccups (tab switch, GC)
      pending += dt;
      lastNow = now;
      while (pending >= STEP) {
        eqT += STEP;
        pending -= STEP;
        render();                           // advance by fixed tick
      }
      requestAnimationFrame(tick);
    };

    build();
    requestAnimationFrame(tick);
    window.addEventListener("resize", () => { build(); eqT = 0; pending = 0; lastNow = null; });
  };

  document.querySelectorAll("#eqCanvas, #liveEq").forEach(initEq);

  /* ---------- ROTATING DISCS ---------- */
  gsap.to("#heroVinyl .vinyl__disc", { rotation: 360, transformOrigin: "50% 50%", duration: 16, repeat: -1, ease: "none" });
  gsap.to(".live__disc", { rotation: 360, transformOrigin: "50% 50%", duration: 22, repeat: -1, ease: "none" });

  /* ---------- HERO PARALLAX ---------- */
  gsap.to(".hero__title", {
    yPercent: -14, opacity: 0.15, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
  gsap.to(".hero__vinyl", {
    yPercent: 30, rotation: 40, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  /* ---------- MARQUEE ---------- */
  gsap.to(".marquee__track", {
    xPercent: -50,
    ease: "none",
    duration: 26,
    repeat: -1
  });

  /* ---------- GENERIC REVEALS ---------- */
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  /* ---------- MANIFESTO WORD REVEAL ---------- */
  gsap.utils.toArray(".manifesto__lead .w").forEach((w) => {
    gsap.fromTo(w, { opacity: 0, yPercent: 40 }, {
      opacity: 1, yPercent: 0, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: ".manifesto__lead", start: "top 75%" }
    });
  });

  gsap.utils.toArray(".manifesto__body").forEach((p) => {
    const words = p.querySelectorAll(".w");
    gsap.fromTo(words, { opacity: 0 }, {
      opacity: 1, duration: 0.5, stagger: 0.012, ease: "none",
      scrollTrigger: { trigger: p, start: "top 80%" }
    });
  });

  /* ---------- ROSTER FLOATING IMAGES ---------- */
  if (!isTouch) {
    document.querySelectorAll(".roster__row").forEach((row) => {
      const img = row.querySelector(".roster__img");
      const name = row.querySelector(".roster__name");
      const rectOf = () => row.getBoundingClientRect();
      const imgY = gsap.quickTo(img, "y", { duration: 0.3, ease: "power3.out" });

      row.addEventListener("mouseenter", () => {
        gsap.to(img, { xPercent: 0, scale: 1, rotate: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
        gsap.to(name, { x: 40, duration: 0.5, ease: "power3.out" });
      });
      row.addEventListener("mousemove", (e) => {
        const r = rectOf();
        const y = e.clientY - r.top - img.offsetHeight / 2;
        imgY(y);
      });
      row.addEventListener("mouseleave", () => {
        gsap.to(img, { xPercent: -120, scale: 0.8, rotate: -4, opacity: 0, duration: 0.35, ease: "power3.out" });
        gsap.to(name, { x: 0, duration: 0.45, ease: "power3.out" });
      });
    });
  }

  /* ---------- RELEASES HORIZONTAL RAIL ---------- */
  const releasesSection = document.querySelector(".releases");
  const rail = document.querySelector(".releases__rail");
  let railTween = null;

  const setupRail = () => {
    if (railTween) {
      railTween.scrollTrigger && railTween.scrollTrigger.kill();
      railTween.kill();
      railTween = null;
    }
    if (!releasesSection || !rail || prefersReduced) return;
    if (window.innerWidth < 768) return;
    const dist = () => rail.scrollWidth - window.innerWidth;
    railTween = gsap.to(rail, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        trigger: releasesSection,
        start: "top top",
        end: () => "+=" + Math.max(dist(), window.innerHeight),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
  };
  setupRail();
  window.addEventListener("resize", () => { setupRail(); ScrollTrigger.refresh(); });

  /* ---------- NEWSLETTER FORM (frontend placeholder) ---------- */
  const joinForm = document.getElementById("joinForm");
  if (joinForm) {
    joinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        joinForm.querySelector(".join__input").style.borderColor = "#ff5d5d";
        return;
      }
      const note = joinForm.parentElement.querySelector(".join__note");
      const wrap = document.createElement("div");
      wrap.className = "join__success serif-it";
      wrap.style.cssText = "font-size:1.6rem;color:var(--amber);margin-top:1rem;";
      wrap.textContent = "You're on the block list. Welcome.";
      joinForm.style.display = "none";
      if (note) note.remove();
      joinForm.insertAdjacentElement("afterend", wrap);
    });
  }

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- SERVICE WORKER (PWA) ---------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  /* ---------- FALLBACK FOR NO-JS SAFETY ---------- */
  document.body.classList.add("js-ready");
});
