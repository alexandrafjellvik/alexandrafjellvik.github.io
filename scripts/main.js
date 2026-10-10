'use strict';

// Navigation stays visible when JavaScript is unavailable.
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
if (header && menuButton) {
  header.classList.add('enhanced');
  const setMenu = (open) => {
    header.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  };
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  header.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      menuButton.focus();
    }
  });
}

const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const projectCards = Array.from(document.querySelectorAll('[data-categories]'));
const filterStatus = document.querySelector('.filter-status');
function filterProjects(category) {
  let count = 0;
  projectCards.forEach((card) => {
    const visible = category === 'all' || card.dataset.categories.split(' ').includes(category);
    card.hidden = !visible;
    if (visible) count += 1;
  });
  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  });
  if (filterStatus) filterStatus.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
}
filterButtons.forEach((button) => {
  button.addEventListener('click', () => filterProjects(button.dataset.filter));
});
// Deep links reveal their project if an earlier filter hid it.
function revealLinkedProject() {
  let id;
  try { id = decodeURIComponent(window.location.hash.slice(1)); }
  catch { return; }
  const target = document.getElementById(id);
  if (target && target.matches('[data-categories]') && target.hidden) {
    filterProjects('all');
    target.scrollIntoView({ block: 'start' });
  }
}
window.addEventListener('hashchange', revealLinkedProject);
revealLinkedProject();

document.querySelectorAll('.project-gallery').forEach((gallery) => {
  let images;
  try { images = JSON.parse(gallery.dataset.images); }
  catch { return; }
  if (!Array.isArray(images) || images.length < 2) return;
  const image = gallery.querySelector('img');
  const previous = gallery.querySelector('.previous');
  const next = gallery.querySelector('.next');
  const counter = gallery.querySelector('.gallery-counter');
  const fullsize = gallery.querySelector('.gallery-fullsize');
  const imageLink = gallery.querySelector('.gallery-image-link');
  if (!image || !previous || !next || !counter) return;
  let current = 0;
  const originalAlt = image.alt;
  function show(index) {
    current = (index + images.length) % images.length;
    image.src = images[current];
    image.alt = `${originalAlt}, image ${current + 1} of ${images.length}`;
    counter.textContent = `${current + 1} / ${images.length}`;
    if (fullsize) fullsize.href = images[current];
    if (imageLink) imageLink.href = images[current];
  }
  gallery.classList.add('gallery-ready');
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
});
