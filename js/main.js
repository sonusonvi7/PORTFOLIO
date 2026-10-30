/* ==========================================================================
   Sonvi Assis Noronha — portfolio
   GSAP + ScrollTrigger for scroll animation, Lenis for smooth scrolling.
   Everything degrades to a normal static page if JS fails or the visitor
   prefers reduced motion.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = root.classList.contains('reduced');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  function showEverything() {
    $$('.hero-hide').forEach(function (el) { el.style.visibility = 'visible'; });
  }

  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    showEverything();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scrolling ---------- */
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var target = id === '#top' ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(id === '#top' ? 0 : target, { duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Page progress bar ---------- */
  gsap.to('.progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.2 }
  });

  /* ---------- Hero: one orchestrated entrance ---------- */
  gsap.set('.hero__name .line > span', { yPercent: 115 });
  gsap.set(['.hero__role', '.hero__lede', '.hero__cta', '.hero__scroll'], { opacity: 0, y: 20 });
  gsap.set('.portrait__frame', { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set('.portrait__zoom img', { scale: 1.25 });
  gsap.set('.d-corner, .d-line', { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('.d-dot', { scale: 0, transformOrigin: '50% 50%' });
  gsap.set('.detect__label', { opacity: 0, y: 6 });
  gsap.set('.scan', { top: '0%', opacity: 0 });
  gsap.set('.hero-hide', { visibility: 'visible' });

  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .to('.hero__role', { opacity: 1, y: 0, duration: 0.8 }, 0.1)
    .to('.hero__name .line > span', { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.15)
    .to('.portrait__frame', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut' }, 0.2)
    .to('.portrait__zoom img', { scale: 1, duration: 1.8, ease: 'power3.out' }, 0.2)
    .to('.hero__lede', { opacity: 1, y: 0, duration: 0.9 }, 0.8)
    .to('.hero__cta', { opacity: 1, y: 0, duration: 0.9 }, 0.95)
    .to('.hero__scroll', { opacity: 1, y: 0, duration: 0.8 }, 1.2)
    // face detection: scan, box, landmarks, label
    .set('.scan', { opacity: 1 }, 1.5)
    .to('.scan', { top: '100%', duration: 1.1, ease: 'power1.inOut' }, 1.5)
    .to('.scan', { opacity: 0, duration: 0.3, ease: 'none' }, 2.45)
    .to('.d-corner', { strokeDashoffset: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' }, 1.9)
    .to('.d-dot', { scale: 1, duration: 0.5, stagger: 0.07, ease: 'back.out(3)' }, 2.2)
    .to('.d-line', { strokeDashoffset: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' }, 2.3)
    .to('.detect__label', { opacity: 1, y: 0, duration: 0.5 }, 2.6);

  /* ---------- Hero: parallax on scroll ---------- */
  var heroScroll = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  var small = window.innerWidth < 900;
  gsap.to('.hero__text', { y: small ? -50 : -140, ease: 'none', scrollTrigger: heroScroll });
  gsap.to('.portrait', { y: small ? -20 : -50, ease: 'none', scrollTrigger: heroScroll });
  gsap.to('.portrait__zoom', { scale: 1.14, ease: 'none', scrollTrigger: heroScroll });
  gsap.to('.hero__grid', { yPercent: 18, ease: 'none', scrollTrigger: heroScroll });

  /* ---------- About: words light up as you read ---------- */
  var statement = $('.reveal-words');
  if (statement) {
    var words = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    gsap.fromTo('.reveal-words .w', { opacity: 0.16 }, {
      opacity: 1, duration: 0.5, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 52%', scrub: true }
    });
  }

  /* ---------- Skills: dividers draw in ---------- */
  $$('.stack__row').forEach(function (row) {
    gsap.fromTo(row, { '--line': 0 }, {
      '--line': 1, ease: 'none',
      scrollTrigger: { trigger: row, start: 'top 90%', end: 'top 60%', scrub: true }
    });
  });

  /* ---------- Contact photo parallax ---------- */
  gsap.fromTo('.contact__photo img', { yPercent: -8 }, {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.contact__photo', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  /* ---------- Work: counters + pinned horizontal scroll ---------- */
  function initCounters(containerAnimation) {
    $$('[data-count]').forEach(function (el) {
      var end = parseFloat(el.dataset.count);
      var dec = parseInt(el.dataset.decimals || '0', 10);
      var suffix = el.dataset.suffix || '';
      var obj = { v: 0 };
      el.textContent = (0).toFixed(dec) + suffix;
      var config = {
        trigger: el, once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: end, duration: 1.6, ease: 'power2.out',
            onUpdate: function () { el.textContent = obj.v.toFixed(dec) + suffix; }
          });
        }
      };
      if (containerAnimation) {
        config.containerAnimation = containerAnimation;
        config.start = 'left 88%';
      } else {
        config.start = 'top 88%';
      }
      ScrollTrigger.create(config);
    });
  }

  var mm = gsap.matchMedia();

  mm.add('(min-width: 901px)', function () {
    var pin = $('.work__pin');
    var track = $('.work__track');
    var bar = $('.work__bar span');
    var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };

    var tween = gsap.to(track, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top',
        end: function () { return '+=' + distance(); },
        pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (self) { gsap.set(bar, { scaleX: self.progress }); }
      }
    });
    initCounters(tween);
  });

  mm.add('(max-width: 900px)', function () {
    initCounters(null);
  });

  /* Layout can shift once fonts and images arrive */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
