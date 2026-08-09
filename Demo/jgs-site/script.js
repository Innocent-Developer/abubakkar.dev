document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('js-ready');

  // ===== Footer year =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===== Scroll progress =====
  const progress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
  };

  // ===== Ambient glow follows pointer =====
  const glow = document.querySelector('.page-glow');
  if (glow && !reduceMotion) {
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      glow.style.setProperty('--mx', `${x}%`);
      glow.style.setProperty('--my', `${y}%`);
    }, { passive: true });
  }

  // ===== Hero background slider + parallax =====
  const slides = document.querySelectorAll('.hero__slide');
  const dotsWrap = document.getElementById('heroDots');
  let currentSlide = 0;
  let slideTimer;

  if (dotsWrap && slides.length) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
  }
  const dots = dotsWrap ? dotsWrap.querySelectorAll('button') : [];

  function goToSlide(i) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = i;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    resetTimer();
  }
  function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
  function resetTimer() {
    clearInterval(slideTimer);
    if (!reduceMotion && slides.length > 1) slideTimer = setInterval(nextSlide, 5000);
  }
  if (slides.length) resetTimer();

  const heroMedia = document.getElementById('heroSlider');
  if (heroMedia && !reduceMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroMedia.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
      }
    }, { passive: true });
  }

  // ===== Navbar shrink =====
  const navbar = document.getElementById('navbar');
  const onScrollChrome = () => {
    if (navbar) navbar.classList.toggle('shrink', window.scrollY > 40);
    updateProgress();
  };
  window.addEventListener('scroll', onScrollChrome, { passive: true });
  onScrollChrome();

  // ===== Mobile menu =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const backdrop = document.getElementById('mobileBackdrop');

  function closeMenu() {
    if (!hamburger || !navLinks || !backdrop) return;
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    backdrop.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function toggleMenu() {
    if (!hamburger || !navLinks || !backdrop) return;
    const isOpen = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active', isOpen);
    backdrop.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  }

  // ===== Magnetic buttons =====
  if (!reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const strength = 18;
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
        const label = btn.querySelector('span');
        if (label) label.style.transform = `translate(${x / (strength * 2)}px, ${y / (strength * 2)}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
        const label = btn.querySelector('span');
        if (label) label.style.transform = '';
      });
    });
  }

  // ===== Scroll-reveal =====
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentElement ? el.parentElement.children : []).filter((n) => n.hasAttribute('data-reveal'));
      const siblingIndex = Math.max(0, siblings.indexOf(el));
      el.style.transitionDelay = reduceMotion ? '0ms' : `${Math.min(siblingIndex * 100, 500)}ms`;
      el.classList.add('in-view');
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => revealObserver.observe(el));

  // ===== Animated counters =====
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count') || '0', 10);
      if (reduceMotion) {
        el.textContent = String(target);
        counterObserver.unobserve(el);
        return;
      }
      const duration = 1100;
      const start = performance.now();
      const tick = (now) => {
        const progressRatio = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progressRatio, 4);
        el.textContent = String(Math.floor(eased * target));
        if (progressRatio < 1) requestAnimationFrame(tick);
        else el.textContent = String(target);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.45 });
  counters.forEach((el) => counterObserver.observe(el));

  // ===== Programs tabs with sliding ink =====
  const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = document.querySelectorAll('.tab-panel');
  const tabsInk = document.getElementById('tabsInk');

  function moveInk(activeBtn) {
    if (!tabsInk || !activeBtn || window.innerWidth <= 620) return;
    const nav = activeBtn.parentElement;
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    tabsInk.style.width = `${btnRect.width}px`;
    tabsInk.style.transform = `translateX(${btnRect.left - navRect.left - 8}px)`;
  }

  function activateTab(btn) {
    const idx = btn.getAttribute('data-tab');
    tabBtns.forEach((b) => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', String(b === btn));
    });
    tabPanels.forEach((p) => p.classList.toggle('active', p.getAttribute('data-panel') === idx));
    moveInk(btn);
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn));
  });
  if (tabBtns[0]) {
    requestAnimationFrame(() => moveInk(tabBtns[0]));
    window.addEventListener('resize', () => {
      const active = document.querySelector('.tab-btn.active');
      if (active) moveInk(active);
    });
  }

  // ===== Gallery tiles + lightbox =====
  // Add more photos as assets/gallery-8.jpg … then list them here.
  const galleryItems = [
    { src: 'assets/gallery-1.jpg', label: 'Classroom Session' },
    { src: 'assets/gallery-2.jpg', label: 'Students Learning' },
    { src: 'assets/gallery-3.jpg', label: 'Campus Life' },
    { src: 'assets/gallery-4.jpg', label: 'School Activities' },
    { src: 'assets/gallery-5.jpg', label: 'Learning Moments' },
    { src: 'assets/gallery-6.jpg', label: 'Our Students' },
    { src: 'assets/gallery-7.jpg', label: 'School Community' },
  ];

  const galleryGrid = document.getElementById('galleryGrid');

  if (galleryGrid) {
    galleryItems.forEach((item) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'gallery__tile';
      tile.setAttribute('data-reveal', '');
      tile.setAttribute('aria-label', `View ${item.label}`);
      tile.innerHTML = `
        <img src="${item.src}" alt="${item.label}" loading="lazy" decoding="async">
        <span>${item.label}</span>
      `;
      tile.addEventListener('click', () => openLightbox(item));
      galleryGrid.appendChild(tile);
    });
    document.querySelectorAll('.gallery__tile[data-reveal]').forEach((el) => revealObserver.observe(el));
  }

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Close">&times;</button>
    <figure class="lightbox__box">
      <img id="lightboxImg" src="" alt="">
      <figcaption id="lightboxLabel"></figcaption>
    </figure>
  `;
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('#lightboxImg');
  const lightboxLabel = lightbox.querySelector('#lightboxLabel');
  const lightboxClose = lightbox.querySelector('.lightbox__close');

  function openLightbox(item) {
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.label;
    }
    if (lightboxLabel) lightboxLabel.textContent = item.label;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMenu();
    }
  });

  // ===== School video player (replaces broken Facebook embed) =====
  const videoPlayer = document.getElementById('videoPlayer');
  const schoolVideo = document.getElementById('schoolVideo');
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const videoSlides = document.getElementById('videoSlides');
  const videoHint = document.getElementById('videoHint');
  const videoFbLink = document.getElementById('videoFbLink');
  let hasLocalVideo = false;
  let reelTimer = null;
  let reelIndex = 0;

  const reelImages = galleryItems.map((item) => item.src);

  if (videoSlides && reelImages.length) {
    reelImages.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      if (i === 0) img.classList.add('active');
      videoSlides.appendChild(img);
    });
  }

  function startReel() {
    if (!videoSlides || reduceMotion) return;
    const imgs = videoSlides.querySelectorAll('img');
    if (imgs.length < 2) return;
    clearInterval(reelTimer);
    reelTimer = setInterval(() => {
      imgs[reelIndex].classList.remove('active');
      reelIndex = (reelIndex + 1) % imgs.length;
      imgs[reelIndex].classList.add('active');
    }, 3200);
  }
  startReel();

  function detectLocalVideo() {
    return new Promise((resolve) => {
      if (!schoolVideo) {
        resolve(false);
        return;
      }
      const probe = document.createElement('video');
      probe.preload = 'metadata';
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        probe.removeAttribute('src');
        probe.load();
        resolve(ok);
      };
      probe.addEventListener('loadedmetadata', () => done(true), { once: true });
      probe.addEventListener('error', () => done(false), { once: true });
      probe.src = 'assets/school-video.mp4';
      // Safety timeout for slow/blocked file checks
      setTimeout(() => done(false), 2500);
    });
  }

  detectLocalVideo().then((ok) => {
    hasLocalVideo = ok;
    if (videoHint) {
      videoHint.textContent = ok
        ? 'Tap play to watch the campus video'
        : 'Tap play for campus photo reel';
    }
    if (videoPlayer && ok) videoPlayer.classList.add('is-ready');
    // Avoid browser trying (and failing) to load missing mp4 in the main player
    if (!ok && schoolVideo) {
      schoolVideo.removeAttribute('src');
      const source = schoolVideo.querySelector('source');
      if (source) source.remove();
      schoolVideo.load();
    }
  });

  function playLocalVideo() {
    if (!schoolVideo || !videoPlayer) return;
    clearInterval(reelTimer);
    videoPlayer.classList.add('is-playing', 'is-ready');
    schoolVideo.play().catch(() => {
      // Autoplay blocked — keep controls visible for manual play
      schoolVideo.controls = true;
    });
  }

  function playPhotoReel() {
    if (videoHint) videoHint.textContent = 'Campus photo reel playing';
    startReel();
    // Soft “playing” feel: hide big play, keep cover visible with slides
    if (videoPlayBtn) videoPlayBtn.style.display = 'none';
  }

  if (videoPlayBtn) {
    videoPlayBtn.addEventListener('click', () => {
      if (hasLocalVideo) playLocalVideo();
      else playPhotoReel();
    });
  }

  if (schoolVideo) {
    schoolVideo.addEventListener('ended', () => {
      if (videoPlayer) videoPlayer.classList.remove('is-playing');
      if (videoPlayBtn) videoPlayBtn.style.display = '';
      startReel();
    });
    schoolVideo.addEventListener('pause', () => {
      if (schoolVideo.currentTime > 0 && !schoolVideo.ended && videoPlayer) {
        // keep playing state while scrubbing; only restore cover if near start
      }
    });
  }

  // ===== Admission form =====
  const form = document.getElementById('admissionForm');
  const successMsg = document.getElementById('formSuccess');
  if (form && successMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    });
  }

  // ===== Smooth active section highlight (optional polish) =====
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.navbar__links a[href^="#"]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach((a) => {
        const match = a.getAttribute('href') === `#${id}`;
        a.style.color = match && !a.classList.contains('navbar__cta') ? 'var(--green-900)' : '';
      });
    });
  }, { threshold: 0.35 });
  sections.forEach((s) => sectionObserver.observe(s));
});
