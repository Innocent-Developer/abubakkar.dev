/**
 * Project filtering  projects.html only
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var filterBar = document.querySelector('[data-filter-bar]');
    var grid = document.querySelector('[data-projects-grid]');
    if (!filterBar || !grid) return;

    var buttons = filterBar.querySelectorAll('.filter-btn');
    var cards = grid.querySelectorAll('.project-card');

    function setActive(btn) {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    }

    function filter(category) {
      grid.classList.add('filtering');

      setTimeout(function () {
        cards.forEach(function (card) {
          var cats = (card.getAttribute('data-category') || '').split(' ');
          if (category === 'all' || cats.indexOf(category) !== -1) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
        grid.classList.remove('filtering');
      }, 150);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        setActive(btn);
        filter(cat);
      });
    });
  });
})();
