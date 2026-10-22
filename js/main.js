/* TALIA — portfolio interactions (no dependencies) */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  /* ---------- Light / dark toggle (header button + thumb-nav button) ---------- */
  var toggles = document.querySelectorAll('[data-theme-toggle]');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    return (
      root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light')
    );
  }

  function updateToggleLabels() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      var text = btn.querySelector('.thumb-nav__theme-text');
      if (text) text.textContent = next === 'dark' ? 'Dark' : 'Light';
    });
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      updateToggleLabels();
    });
  });
  systemDark.addEventListener('change', updateToggleLabels);
  updateToggleLabels();

  /* ---------- Thumb nav: highlight the section on screen ---------- */
  var thumbLinks = document.querySelectorAll('.thumb-nav a[href^="#"]');
  if (thumbLinks.length && 'IntersectionObserver' in window) {
    var linkFor = {};
    thumbLinks.forEach(function (a) {
      linkFor[a.getAttribute('href').slice(1)] = a;
    });

    // On project pages "Work" is highlighted in the HTML; keep it unless an on-page section takes over
    var allThumb = document.querySelectorAll('.thumb-nav a');
    var defaultCurrent = document.querySelector('.thumb-nav a[aria-current]');
    var sectionIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          allThumb.forEach(function (a) {
            a.removeAttribute('aria-current');
          });
          var link = linkFor[entry.target.id] || defaultCurrent; // hero/top: back to the page default (none on home)
          if (link) link.setAttribute('aria-current', 'true');
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    ); // a thin band across the middle of the screen

    ['top'].concat(Object.keys(linkFor)).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionIO.observe(el);
    });
  }

  /* ---------- Header border + floating "back to top" on scroll ---------- */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('[data-to-top]');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    if (toTop)
      toTop.classList.toggle(
        'is-visible',
        window.scrollY > window.innerHeight * 0.75,
      );
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 404 page: show the missing path and "Throw it again" ---------- */
  var log = document.querySelector('[data-log]');
  if (log) {
    var pathEl = log.querySelector('[data-path]');
    if (pathEl) pathEl.textContent = window.location.pathname;

    var ball = document.querySelector('[data-ball]');
    var replies = [
      'pup got distracted by a squirrel.',
      'returned: 1 × tennis ball (slobbery). Still no page.',
      'sit. stay. still 404.',
      'pup rolled over instead. Very cute, not helpful.',
      'returned: 1 × sock. Where did she even find that?',
      'pup is napping now. Try "Go home" instead.',
    ];
    var tries = 0;
    document
      .querySelector('[data-retry]')
      .addEventListener('click', function () {
        var li = document.createElement('li');
        li.className = 'lost__note';
        li.textContent =
          '// retry ' + (tries + 1) + ': ' + replies[tries % replies.length];
        log.appendChild(li);
        tries++;
        if (ball && !reduceMotion) {
          ball.classList.remove('is-thrown');
          void ball.offsetWidth; // restart the throw animation
          ball.classList.add('is-thrown');
        }
      });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Testimonials: grid for 3 or fewer quotes, swipeable carousel for 4+ ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel__track');
    var cards = Array.prototype.slice.call(track.children);
    var controls = carousel.querySelector('.carousel__controls');

    if (cards.length <= 3) {
      track.removeAttribute('tabindex'); // nothing to scroll, so no need for a focus stop
      return;
    }

    carousel.classList.add('is-carousel');
    controls.hidden = false;
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var status = carousel.querySelector('.carousel__status');

    function step() {
      return cards[1].offsetLeft - cards[0].offsetLeft;
    } // one card + gap
    function perView() {
      return Math.max(1, Math.round(track.clientWidth / step()));
    }

    function update() {
      var n = cards.length;
      var first = Math.min(n - 1, Math.round(track.scrollLeft / step()));
      var last = Math.min(n, first + perView());
      status.textContent =
        last - first > 1
          ? first + 1 + '–' + last + ' of ' + n
          : first + 1 + ' of ' + n;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled =
        track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    }

    function go(dir) {
      track.scrollBy({
        left: dir * step(),
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
    prev.addEventListener('click', function () {
      go(-1);
    });
    next.addEventListener('click', function () {
      go(1);
    });

    // Drag to scroll with a mouse or pen (touch screens already swipe natively)
    var drag = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false };
      track.classList.add('is-dragging'); // turns snapping off while dragging
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 3) drag.moved = true;
      track.scrollLeft = drag.left - dx;
    });
    function endDrag() {
      if (!drag) return;
      var moved = drag.moved;
      drag = null;
      track.classList.remove('is-dragging');
      if (moved) {
        // Settle on the nearest card, like a swipe would
        var target = Math.round(track.scrollLeft / step()) * step();
        track.scrollTo({
          left: target,
          behavior: reduceMotion ? 'auto' : 'smooth',
        });
        setTimeout(update, 450); // refresh the counter once the snap has settled
      }
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    // Don't let a drag accidentally select text or fire a click
    track.addEventListener('dragstart', function (e) {
      e.preventDefault();
    });

    var t;
    track.addEventListener(
      'scroll',
      function () {
        clearTimeout(t);
        t = setTimeout(update, 120);
      },
      { passive: true },
    );
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Open an FAQ answer when a link points at it (e.g. the sticker links to #nail-art) ---------- */
  function openAnswer(id, moveFocus) {
    var target = id && document.getElementById(id);
    if (!target || target.tagName !== 'DETAILS') return;
    target.open = true;
    var reveal = target.closest('.reveal');
    if (reveal) reveal.classList.add('is-visible');
    // Put keyboard / screen-reader users on the question they just jumped to
    if (moveFocus)
      target.querySelector('summary').focus({ preventScroll: true });
  }

  // Clicks cover the case where the URL already ends in that #hash (no hashchange fires)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (link)
      openAnswer(decodeURIComponent(link.getAttribute('href').slice(1)), true);
  });
  window.addEventListener('hashchange', function () {
    openAnswer(decodeURIComponent(location.hash.slice(1)), true);
  });
  openAnswer(decodeURIComponent(location.hash.slice(1)), false);

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
