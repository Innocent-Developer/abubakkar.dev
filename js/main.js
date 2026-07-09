/**
 * Shared portfolio behaviors
 */
(function () {
  'use strict';

  var T = window.Terminal;

  var QUOTES = [
    '"First, solve the problem. Then, write the code."  John Johnson',
    '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."  Martin Fowler',
    '"Talk is cheap. Show me the code."  Linus Torvalds',
    '"Programs must be written for people to read, and only incidentally for machines to execute."  Harold Abelson',
    '"The best error message is the one that never shows up."  Thomas Fuchs',
    '"Code is like humor. When you have to explain it, it\'s bad."  Cory House',
    '"Simplicity is the soul of efficiency."  Austin Freeman',
    '"Make it work, make it right, make it fast."  Kent Beck'
  ];

  /* ===== Active Nav ===== */
  function initActiveNav() {
    var links = document.querySelectorAll('.nav-desktop a, .nav-mobile a');
    if (!links.length) return;

    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    if (page === '' || page === '/') page = 'index.html';
    var inBlog = path.indexOf('/blog') !== -1 || path.indexOf('\\blog') !== -1;

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPage = href.split('/').pop();
      var isBlogLink = href.indexOf('blog') !== -1;
      var active = isBlogLink ? inBlog : linkPage === page;

      if (active) {
        link.classList.add('active');
        if (link.classList.contains('nav-link') && !link.querySelector('.nav-cursor')) {
          var cursor = document.createElement('span');
          cursor.className = 'nav-cursor';
          cursor.textContent = '▊';
          link.appendChild(cursor);
        }
      }
    });
  }

  /* ===== Mobile Menu ===== */
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.nav-mobile');
    if (!toggle || !mobileNav) return;

    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    function setOpen(isOpen) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      mobileNav.classList.toggle('open', isOpen);
      overlay.classList.toggle('open', isOpen);
      overlay.setAttribute('aria-hidden', String(!isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    }

    function closeMenu() {
      setOpen(false);
    }

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!expanded);
    });

    overlay.addEventListener('click', closeMenu);

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100) closeMenu();
    });
  }

  /* ===== Boot Lines ===== */
  function initBootLines() {
    var bootEl = document.querySelector('[data-boot]');
    var main = document.querySelector('main');
    if (!bootEl || !main) return;

    var command = bootEl.getAttribute('data-boot');
    var body = bootEl.querySelector('.terminal-body') || bootEl;

    if (main.classList.contains('home-main')) return;

    body.textContent = '';

    T.typeSequence([{ type: 'command', text: command }], body, 35).then(function () {
      main.classList.add('loaded');
    });
  }

  /* ===== Scroll Reveals ===== */
  function initScrollReveals() {
    var sections = document.querySelectorAll('[data-reveal]');
    if (!sections.length) return;

    if (T.prefersReducedMotion()) {
      sections.forEach(function (s) { s.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ===== Home Hero ===== */
  function initHomeHero() {
    var container = document.querySelector('[data-hero-terminal]');
    if (!container) return;

    var sequence = [
      { type: 'command', text: '➜ ~ whoami' },
      { type: 'output', text: 'Abubakkar Sajid' },
      { type: 'blank', text: '' },
      { type: 'command', text: '➜ ~ cat /etc/profile' },
      { type: 'output', text: 'Full-Stack Developer · Backend & SaaS Builder' },
      { type: 'blank', text: '' },
      { type: 'command', text: '➜ ~ ./abubakkar --stats' },
      { type: 'output', text: '30+ projects shipped · 10+ SaaS/products built · 3+ years production' },
      { type: 'blank', text: '' },
      { type: 'command', text: '➜ ~ ./abubakkar --location' },
      { type: 'output', text: 'Lahore, Pakistan | Open to Remote & Freelance' },
      { type: 'blank', text: '' },
      { type: 'command', text: '➜ ~ ./abubakkar --stack --core' },
      {
        type: 'output',
        text: 'Node.js · Express · MongoDB · React · Next.js · TypeScript · FastAPI'
      },
      { type: 'blank', text: '' },
      {
        type: 'html',
        text:
          '➜ ~ <a href="assets/cv.pdf" class="btn-cmd btn-cmd--primary no-arrow" target="_blank" rel="noopener">[ Open Resume ]</a>   ' +
          '<a href="https://www.linkedin.com/in/mughal-abubakkar" target="_blank" rel="noopener">linkedin.com/in/abubakkar</a>   ' +
          '<a href="https://github.com/Innocent-Developer" target="_blank" rel="noopener">github.com/Innocent-Developer</a>',
        delay: 400
      }
    ];

    T.typeSequence(sequence, container, 35).then(function () {
      var lastLine = container.lastElementChild;
      if (lastLine) T.addCursor(lastLine);
    });
  }

  /* ===== Daily Cipher Modal ===== */
  function initDailyCipher() {
    var btn = document.querySelector('[data-daily-cipher]');
    var overlay = document.querySelector('[data-modal]');
    if (!btn || !overlay) return;

    var closeBtn = overlay.querySelector('.modal-close');
    var modalBody = overlay.querySelector('.modal-body .terminal-body');

    btn.addEventListener('click', function () {
      overlay.classList.add('open');
      if (modalBody) {
        modalBody.textContent = '';
        var quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        T.typeSequence(
          [
            { type: 'command', text: '➜ ~ ./daily_cipher.sh' },
            { type: 'output', text: quote, className: 'dim' }
          ],
          modalBody,
          25
        );
      }
    });

    function closeModal() {
      overlay.classList.remove('open');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
  }

  /* ===== Ask Abubakkar scroll ===== */
  function initAskScroll() {
    var btn = document.querySelector('[data-ask-scroll]');
    var target = document.querySelector('[data-contact-preview]');
    if (!btn || !target) return;

    btn.addEventListener('click', function () {
      target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ===== Toast ===== */
  var toastApi = null;
  var toastHideTimer;

  function initToast() {
    var toast = document.querySelector('[data-toast]');
    if (!toast) return null;

    var messageEl = toast.querySelector('[data-toast-message]');
    var dismiss = toast.querySelector('.toast-dismiss');

    function hide() {
      toast.classList.remove('show');
      clearTimeout(toastHideTimer);
    }

    function show(message, type) {
      if (messageEl) messageEl.textContent = message;
      toast.classList.remove('toast--success', 'toast--error', 'toast--info');
      if (type) toast.classList.add('toast--' + type);
      toast.classList.add('show');
      clearTimeout(toastHideTimer);
      toastHideTimer = setTimeout(hide, type === 'error' ? 7000 : 5000);
    }

    if (dismiss) dismiss.addEventListener('click', hide);

    return { show: show, hide: hide };
  }

  /* ===== Sudo Easter Egg ===== */
  function initSudoEasterEgg() {
    if (!toastApi) return;

    var buffer = '';

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1) return;

      buffer += e.key.toLowerCase();
      if (buffer.length > 10) buffer = buffer.slice(-10);

      if (buffer.endsWith('sudo')) {
        buffer = '';
        toastApi.show(
          'abubakkar is not in the sudoers file. This incident will be reported.',
          'info'
        );
      }
    });
  }

  /* ===== Contact Form ===== */
  var WEB3FORMS_ACCESS_KEY = '807bb29c-f14d-4b96-8b45-c7b0bb066287';

  function initContactForm() {
    var forms = document.querySelectorAll('[data-contact-form]');
    if (!forms.length) return;

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    forms.forEach(function (form) {
      var successEl = form.parentElement.querySelector('[data-form-success]');
      var submitBtn = form.querySelector('[type="submit"]');

    function showError(input, message) {
      var existing = input.parentElement.querySelector('.form-error');
      if (existing) existing.remove();

      var err = document.createElement('div');
      err.className = 'form-error';
      err.textContent = '✘ error: ' + message;
      input.parentElement.appendChild(err);
      input.setAttribute('aria-invalid', 'true');
    }

    function clearErrors() {
      form.querySelectorAll('.form-error').forEach(function (e) { e.remove(); });
      form.querySelectorAll('[aria-invalid]').forEach(function (i) {
        i.removeAttribute('aria-invalid');
      });
    }

    function setSubmitting(isSubmitting) {
      if (!submitBtn) return;
      submitBtn.disabled = isSubmitting;
      if (isSubmitting) {
        submitBtn.dataset.originalLabel = submitBtn.innerHTML;
        submitBtn.innerHTML = '$ ./sending...<span class="btn-cursor">▊</span>';
      } else if (submitBtn.dataset.originalLabel) {
        submitBtn.innerHTML = submitBtn.dataset.originalLabel;
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var subject = form.querySelector('[name="form_subject"]');
      var message = form.querySelector('[name="message"]');
      var valid = true;

      if (!name.value.trim()) {
        showError(name, 'name is required');
        valid = false;
      }
      if (!email.value.trim()) {
        showError(email, 'email is required');
        valid = false;
      } else if (!emailRe.test(email.value.trim())) {
        showError(email, 'invalid email format');
        valid = false;
      }
      if (!subject.value.trim()) {
        showError(subject, 'subject is required');
        valid = false;
      }
      if (!message.value.trim()) {
        showError(message, 'message is required');
        valid = false;
      }

      if (!valid) {
        if (toastApi) {
          toastApi.show('✘ validation failed  fix errors above', 'error');
        }
        return;
      }

      setSubmitting(true);

      var payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
        from_name: 'Portfolio Contact  ' + name.value.trim()
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setSubmitting(false);

          if (data.success) {
            form.reset();
            form.style.display = 'none';

            if (successEl) {
              successEl.classList.add('is-visible');
              successEl.textContent = '';
              T.typeSequence(
                [
                  { type: 'command', text: '➜ ~ sending message...' },
                  { type: 'output', text: '✔ message queued successfully' },
                  { type: 'command', text: '➜ ~ Abubakkar will reply within 24h' }
                ],
                successEl,
                30
              );
            }

            if (toastApi) {
              toastApi.show('✔ message sent successfully  Abubakkar will reply within 24h', 'success');
            }
          } else {
            if (toastApi) {
              toastApi.show(
                '✘ error: ' + (data.message || 'failed to send message'),
                'error'
              );
            }
          }
        })
        .catch(function () {
          setSubmitting(false);
          if (toastApi) {
            toastApi.show('✘ error: network failure  please try again', 'error');
          }
        });
    });
    });
  }

  /* ===== Back to Top ===== */
  function initBackToTop() {
    var link = document.querySelector('.back-to-top');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Init ===== */
  document.addEventListener('DOMContentLoaded', function () {
    initActiveNav();
    initMobileMenu();
    initBootLines();
    initScrollReveals();
    initHomeHero();
    initDailyCipher();
    initAskScroll();
    toastApi = initToast();
    initSudoEasterEgg();
    initContactForm();
    initBackToTop();

    var main = document.querySelector('main');
    if (main && main.classList.contains('home-main')) {
      main.classList.add('loaded');
    }
  });
})();
