/* ══════════════════════════════════════
   js/projects.js
   Fetches data/projects.json and renders
   project cards into #projectTrack on
   index.html. Dispatches 'projectsReady'
   when cards are in the DOM so script.js
   can initialize the carousel.
══════════════════════════════════════ */

import { fetchProjects, resolveAsset, initScrollReveal } from './utils.js';

/* ── Build one project card HTML string ── */
function buildCardHTML(project) {
  const techBadges = project.technologies
    .map(t => `<span>${t}</span>`)
    .join('');

  return `
    <a href="./projects/project-detail.html?id=${project.id}"
       class="project-card page-link"
       data-category="${project.category}">
      <div class="project-card-image">
        <img src="${resolveAsset(project.thumbnail)}"
             alt="${project.thumbnailAlt}"
             loading="lazy">
        <div class="project-card-overlay"><span>View Project →</span></div>
      </div>
      <div class="project-card-body">
        <h3>${project.title}</h3>
        <p>${project.shortDescription}</p>
        <div class="project-card-tech">${techBadges}</div>
      </div>
    </a>
  `;
}

/* ── Render all project cards into #projectTrack ── */
function renderProjectCards(projects) {
  const track = document.getElementById('projectTrack');
  if (!track) return;

  track.innerHTML = projects.map(buildCardHTML).join('');
}

/* ── Show error state inside the projects section ── */
function showProjectsError(message) {
  const track = document.getElementById('projectTrack');
  if (!track) return;
  track.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;color:var(--text-muted);">
      <p style="font-size:1.1rem;margin-bottom:0.5rem;">⚠️ Could not load projects.</p>
      <p style="font-size:0.9rem;">${message}</p>
    </div>
  `;
}

/* ── Main init ── */
async function init() {
  try {
    const projects = await fetchProjects();
    renderProjectCards(projects);

    // Re-run scroll reveal so dynamically added cards animate in
    initScrollReveal();

    // Signal script.js that cards are ready for carousel + tilt init
    document.dispatchEvent(new CustomEvent('projectsReady'));
  } catch (err) {
    console.error('[projects.js]', err);
    showProjectsError(
      'If viewing locally, please open via a local server (e.g. Live Server). ' +
      err.message
    );
    // Still dispatch so carousel buttons don't hang forever
    document.dispatchEvent(new CustomEvent('projectsReady'));
  }
}

init();
