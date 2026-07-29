/* ══════════════════════════════════════
   PROJECT DETAIL — SHARED SCRIPT
══════════════════════════════════════ */

// ── Scroll Reveal ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
  observer.observe(el);
});

// ── Dark Mode Toggle ──
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('theme');

if (storedTheme) {
  document.documentElement.setAttribute('data-theme', storedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ── Navbar Scroll Style ──
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu() {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (navOverlay) navOverlay.addEventListener('click', toggleMenu);

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) toggleMenu();
  });
});

// ── Page Transitions ──
const pageTransition = document.getElementById('pageTransition');

document.querySelectorAll('.page-link').forEach(link => {
  if (link.getAttribute('href')?.startsWith('#')) return;

  link.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (pageTransition) {
      pageTransition.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 350);
    } else {
      window.location.href = href;
    }
  });
});

window.addEventListener('load', () => {
  if (pageTransition) pageTransition.classList.remove('active');
});

// ── Gallery & Lightbox ──
const galleryMainContainer = document.querySelector('.gallery-main');
const galleryThumbs = document.querySelectorAll('.gallery-thumb');

// Create Lightbox DOM element dynamically
const lightbox = document.createElement('div');
lightbox.className = 'lightbox-modal';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close lightbox">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>
  <img class="lightbox-content" src="" alt="Enlarged view">
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('.lightbox-content');
const lightboxClose = lightbox.querySelector('.lightbox-close');

function initImageLightbox(imgEl) {
  if (!imgEl) return;
  imgEl.style.cursor = 'zoom-in';
  imgEl.addEventListener('click', () => {
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || '';
    lightbox.classList.add('active');
  });
}

const initialImg = galleryMainContainer ? galleryMainContainer.querySelector('img') : null;
if (initialImg) {
  initImageLightbox(initialImg);
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
}

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('active');
});

if (galleryMainContainer && galleryThumbs.length) {
  galleryThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const type = thumb.getAttribute('data-type') || 'image';
      const src = thumb.getAttribute('data-src') || thumb.querySelector('img')?.src;

      galleryThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      if (type === 'video') {
        galleryMainContainer.innerHTML = `
          <video controls autoplay playsinline style="width:100%;height:100%;object-fit:cover;border-radius:12px;">
            <source src="${src}" type="video/mp4">
            Your browser does not support HTML5 video.
          </video>
        `;
      } else if (type === 'youtube') {
        galleryMainContainer.innerHTML = `
          <iframe src="${src}" title="Project Video Preview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;border-radius:12px;border:none;"></iframe>
        `;
      } else {
        const altText = thumb.querySelector('img')?.alt || 'Project preview';
        galleryMainContainer.innerHTML = `<img src="${src}" alt="${altText}">`;
        const newImg = galleryMainContainer.querySelector('img');
        initImageLightbox(newImg);
      }
    });
  });
}



// ── Custom Cursor ──
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    cursorDot.classList.add('visible');
    cursorRing.classList.add('visible');
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, .gallery-thumb, .project-nav-item';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('visible');
    cursorRing.classList.remove('visible');
  });
}

// ── Back to Top ──
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.pageYOffset > window.innerHeight * 0.5);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Auto Footer Year ──
const footerYear = document.getElementById('footerYear');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

