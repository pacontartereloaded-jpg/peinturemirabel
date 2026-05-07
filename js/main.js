// Peinture Mirabel — interactions techniques
(function () {
  'use strict';

  // Year in footer
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // FAQ accordion (close others)
  var details = document.querySelectorAll('.faq-list details');
  details.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) {
        details.forEach(function (other) { if (other !== d) other.open = false; });
      }
    });
  });

  // Counter animation for hero spec strip
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    if (isNaN(target)) return;
    var duration = 1400;
    var start = performance.now();
    var raw = el.textContent.replace(/\s/g, '');
    function fmt(n) {
      return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    function frame(t) {
      var p = Math.min(1, (t - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(frame);
  }

  // Intersection observer for counters + reveals
  if ('IntersectionObserver' in window) {
    var counters = document.querySelectorAll('[data-counter]');
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCounter(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { co.observe(c); });

    // Animate the volume bars when in view
    var bars = document.querySelectorAll('.vol .bar span');
    bars.forEach(function (b) {
      var w = b.style.width;
      b.style.width = '0%';
      var bo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            b.style.width = w;
            bo.unobserve(b);
          }
        });
      }, { threshold: 0.5 });
      bo.observe(b);
    });

    // Reveal sections + cards
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.section-title, .etape, .vol, .phase, .cas, .galerie-grid figure').forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });

    var style = document.createElement('style');
    style.textContent =
      '.reveal{opacity:0;transform:translateY(12px);transition:opacity .55s ease,transform .55s ease;}'
      + '.reveal.is-visible{opacity:1;transform:none;}'
      + '@media (prefers-reduced-motion: reduce){.reveal{opacity:1!important;transform:none!important;}}';
    document.head.appendChild(style);
  }
})();
