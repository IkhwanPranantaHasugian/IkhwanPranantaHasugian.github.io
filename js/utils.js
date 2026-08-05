/* ══════════════════════════════════════
   js/utils.js — Shared Utilities
   Handles UI bootstrapping shared by
   both index.html and project-detail.html
══════════════════════════════════════ */

/**
 * Compute the root path relative to the current page location.
 * index.html is at root → './'
 * projects/project-detail.html is one level deep → '../'
 */
export const ROOT_PATH = window.location.pathname.includes('/projects/')
  ? '../'
  : './';

/** Cached projects data to avoid duplicate fetches */
let _projectsCache = null;

/**
 * Fetch and cache projects.json from the data directory.
 * @returns {Promise<Array>} Parsed array of project objects
 */
export async function fetchProjects() {
  if (_projectsCache) return _projectsCache;
  const res = await fetch(`${ROOT_PATH}data/projects.json`);
  if (!res.ok) throw new Error(`Failed to load projects data (HTTP ${res.status})`);
  _projectsCache = await res.json();
  return _projectsCache;
}

/**
 * Resolve an image/video path from the JSON (root-relative) to a
 * path that works from the current page location.
 * @param {string} src  e.g. "image/projects/garagesim/thumb.png"
 * @returns {string}    e.g. "../image/projects/garagesim/thumb.png"
 */
export function resolveAsset(src) {
  if (!src) return '';
  return `${ROOT_PATH}${src}`;
}

/**
 * Set up the IntersectionObserver for .reveal, .reveal-stagger,
 * .reveal-left, .reveal-right, and .reveal-bounce elements.
 */
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-bounce'
  ).forEach(el => observer.observe(el));

  // Section dividers draw-in
  const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible-divider');
        dividerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section-divider').forEach(el => dividerObserver.observe(el));
}

/** Dark mode toggle, reading from localStorage / prefers-color-scheme */
export function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
}

/** Navbar scroll shadow + mobile hamburger menu */
export function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.pageYOffset > 40);
  }, { passive: true });

  function toggleMenu() {
    hamburger?.classList.toggle('active');
    navLinks?.classList.toggle('open');
    navOverlay?.classList.toggle('active');
    document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', toggleMenu);
  navOverlay?.addEventListener('click', toggleMenu);
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) toggleMenu();
    });
  });
}

/** Page transition overlay for .page-link elements */
export function initPageTransitions() {
  const overlay = document.getElementById('pageTransition');

  document.querySelectorAll('.page-link').forEach(link => {
    if (link.getAttribute('href')?.startsWith('#')) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 350);
      } else {
        window.location.href = href;
      }
    });
  });

  window.addEventListener('load', () => overlay?.classList.remove('active'));
}

/** Custom cursor dot + ring (fine pointer only) */
export function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || !window.matchMedia('(pointer: fine)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    dot.classList.add('visible');
    ring.classList.add('visible');
  });

  (function animate() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animate);
  })();

  document.querySelectorAll('a, button, .gallery-thumb, .project-nav-item, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.remove('visible');
    ring.classList.remove('visible');
  });
}

/** Back-to-top button */
export function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.pageYOffset > window.innerHeight * 0.5);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/** Footer year */
export function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── SVG Icon Strings ── */
export const SVG_GITHUB = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`;

export const SVG_EXTERNAL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

export const SVG_BACK_ARROW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

export const SVG_LINKEDIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
