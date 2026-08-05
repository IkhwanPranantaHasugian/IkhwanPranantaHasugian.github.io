/* ══════════════════════════════════════
   js/project-detail.js
   Loads data/projects.json, reads ?id=
   from the URL, and populates every
   section of projects/project-detail.html
══════════════════════════════════════ */

import {
  fetchProjects,
  resolveAsset,
  initScrollReveal,
  initTheme,
  initNav,
  initPageTransitions,
  initCustomCursor,
  initBackToTop,
  initFooterYear,
  SVG_GITHUB,
  SVG_EXTERNAL,
  SVG_BACK_ARROW
} from '../js/utils.js';

/* ─────────────────────────────────────
   URL Parameter Helper
───────────────────────────────────── */
function getProjectId() {
  return new URLSearchParams(window.location.search).get('id') || '';
}

/* ─────────────────────────────────────
   SEO / <head> updater
───────────────────────────────────── */
function updateHead(project) {
  document.title = `${project.title} — Ikhwan Prananta Hasugian`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', project.tagline);
}

/* ─────────────────────────────────────
   Hero Section
───────────────────────────────────── */
function renderHero(project) {
  const titleEl = document.getElementById('detailTitle');
  const taglineEl = document.getElementById('detailTagline');
  const metaEl = document.getElementById('detailMeta');
  if (!titleEl || !taglineEl || !metaEl) return;

  titleEl.textContent = project.title;
  taglineEl.textContent = project.tagline;

  const techTags = project.technologies
    .map(t => `<span class="detail-tech-tag">${t}</span>`)
    .join('');

  let linksHTML = '';
  if (project.github) {
    linksHTML += `
      <a href="${project.github}" target="_blank" rel="noopener" class="detail-link-btn primary">
        ${SVG_GITHUB} View on GitHub
      </a>`;
  }
  if (project.demo) {
    linksHTML += `
      <a href="${project.demo}" target="_blank" rel="noopener" class="detail-link-btn secondary">
        ${SVG_EXTERNAL} Live Demo
      </a>`;
  }

  metaEl.innerHTML = `${techTags}${linksHTML ? `<div class="detail-links">${linksHTML}</div>` : ''}`;
}

/* ─────────────────────────────────────
   Gallery Section
───────────────────────────────────── */
function renderGallery(project) {
  const gridEl = document.getElementById('galleryGrid');
  const mainEl = document.getElementById('galleryMain');
  const thumbsEl = document.getElementById('galleryThumbs');
  if (!gridEl || !mainEl || !thumbsEl) return;

  // Portrait mode for mobile-screenshot galleries (e.g. EcoAlert)
  if (project.galleryMode === 'portrait') {
    gridEl.classList.add('portrait-mode');
  } else {
    gridEl.classList.remove('portrait-mode');
  }

  const firstItem = project.gallery[0];
  mainEl.innerHTML = `<img src="${resolveAsset(firstItem.src)}" alt="${firstItem.alt}">`;

  thumbsEl.innerHTML = project.gallery.map((item, idx) => {
    const isVideo = item.type === 'video';
    const thumbSrc = resolveAsset(isVideo ? project.thumbnail : item.src);
    const activeClass = idx === 0 ? ' active' : '';
    const videoClass = isVideo ? ' video-thumb' : '';
    return `
      <div class="gallery-thumb${activeClass}${videoClass}"
           data-type="${item.type}"
           data-src="${resolveAsset(item.src)}">
        <img src="${thumbSrc}" alt="${item.alt}" loading="lazy">
      </div>
    `;
  }).join('');
}

/* ─────────────────────────────────────
   Content Sections
───────────────────────────────────── */
function renderContent(project) {
  // Overview
  const overviewEl = document.getElementById('overviewSection');
  if (overviewEl) {
    const paragraphs = project.overview.map(p => `<p>${p}</p>`).join('');
    overviewEl.innerHTML = `<h2 class="detail-section-title">Overview</h2>${paragraphs}`;
  }

  // Key Features
  const featuresEl = document.getElementById('featuresSection');
  if (featuresEl) {
    const items = project.features.map(f => `<li>${f}</li>`).join('');
    featuresEl.innerHTML = `<h2 class="detail-section-title">Key Features</h2><ul class="feature-list">${items}</ul>`;
  }

  // Challenges & Learnings
  const challengeEl = document.getElementById('challengeSection');
  if (challengeEl) {
    const paragraphs = project.challenge.map(p => `<p>${p}</p>`).join('');
    challengeEl.innerHTML = `<h2 class="detail-section-title">Challenges &amp; Learnings</h2>${paragraphs}`;
  }
}

/* ─────────────────────────────────────
   Sidebar Info Card
───────────────────────────────────── */
function renderSidebar(project) {
  const cardEl = document.getElementById('detailInfoCard');
  if (!cardEl) return;

  const techStackHTML = project.techStack
    .map(t => `<span>${t}</span>`)
    .join('');

  cardEl.innerHTML = `
    <div class="detail-info-item"><h4>Role</h4><p>${project.role}</p></div>
    <div class="detail-info-item"><h4>Year</h4><p>${project.year}</p></div>
    <div class="detail-info-item"><h4>Platform</h4><p>${project.platform}</p></div>
    <div class="detail-info-item">
      <h4>Tech Stack</h4>
      <div class="tech-list">${techStackHTML}</div>
    </div>
  `;
}

/* ─────────────────────────────────────
   Project Navigation (prev / next)
───────────────────────────────────── */
function renderProjectNav(project, allProjects) {
  const navEl = document.getElementById('projectNavGrid');
  if (!navEl) return;

  const idx = allProjects.findIndex(p => p.id === project.id);
  const prev = allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(idx + 1) % allProjects.length];

  navEl.innerHTML = `
    <a href="./project-detail.html?id=${prev.id}" class="project-nav-item prev page-link">
      <span class="project-nav-label">← Previous</span>
      <span class="project-nav-name">${prev.title}</span>
    </a>
    <a href="./project-detail.html?id=${next.id}" class="project-nav-item next page-link">
      <span class="project-nav-label">Next →</span>
      <span class="project-nav-name">${next.title}</span>
    </a>
  `;
}

/* ─────────────────────────────────────
   Not Found State
───────────────────────────────────── */
function showNotFound(id) {
  document.title = 'Project Not Found — Ikhwan Prananta Hasugian';

  const main = document.getElementById('pageMain');
  if (main) main.style.display = 'none';

  const nf = document.getElementById('notFound');
  if (nf) {
    nf.style.display = 'flex';
    const idEl = nf.querySelector('#notFoundId');
    if (idEl) idEl.textContent = id ? `"${id}"` : '(no id provided)';
  }
}

/* ─────────────────────────────────────
   Gallery Interactions (lightbox + thumb switching)
───────────────────────────────────── */
function initGalleryInteractions() {
  const galleryMain = document.querySelector('.gallery-main');
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  if (!galleryMain || !galleryThumbs.length) return;

  // Create lightbox element
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-modal';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close lightbox">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <img class="lightbox-content" src="" alt="Enlarged view">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-content');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  function openLightbox(imgEl) {
    if (!imgEl) return;
    imgEl.style.cursor = 'zoom-in';
    imgEl.addEventListener('click', () => {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || '';
      lightbox.classList.add('active');
    });
  }

  lightboxClose?.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });

  // Wire up initial image
  openLightbox(galleryMain.querySelector('img'));

  // Thumb click handler
  galleryThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const type = thumb.getAttribute('data-type') || 'image';
      const src = thumb.getAttribute('data-src') || thumb.querySelector('img')?.src;

      galleryThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      if (type === 'video') {
        galleryMain.innerHTML = `
          <video controls autoplay playsinline style="width:100%;height:100%;object-fit:cover;border-radius:12px;">
            <source src="${src}" type="video/mp4">
            Your browser does not support HTML5 video.
          </video>`;
      } else {
        const alt = thumb.querySelector('img')?.alt || 'Project preview';
        galleryMain.innerHTML = `<img src="${src}" alt="${alt}">`;
        openLightbox(galleryMain.querySelector('img'));
      }
    });
  });
}

/* ─────────────────────────────────────
   Main Entry Point
───────────────────────────────────── */
async function init() {
  // Bootstrap shared UI immediately (theme, nav, cursor etc.)
  initTheme();
  initNav();
  initBackToTop();
  initFooterYear();

  const projectId = getProjectId();

  try {
    const projects = await fetchProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      showNotFound(projectId);
      initPageTransitions();
      return;
    }

    // Populate all page sections
    updateHead(project);
    renderHero(project);
    renderGallery(project);
    renderContent(project);
    renderSidebar(project);
    renderProjectNav(project, projects);

    // Activate interactions now that DOM is fully populated
    initGalleryInteractions();
    initPageTransitions();
    initScrollReveal();
    initCustomCursor();

  } catch (err) {
    console.error('[project-detail.js]', err);
    showNotFound(projectId);
    // Show error hint inside not-found area
    const hint = document.getElementById('notFoundHint');
    if (hint) {
      hint.textContent = 'Could not load project data. If viewing locally, please use a local server.';
    }
    initPageTransitions();
  }
}

init();
