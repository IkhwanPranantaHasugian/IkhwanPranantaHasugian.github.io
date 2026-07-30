/* ══════════════════════════════════════
   IKHWAN PORTFOLIO — MAIN SCRIPT
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
  if (nav) {
    if (window.pageYOffset > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
}, { passive: true });

// ── Active Nav Section ──
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a[data-section]');

if (sections.length && navLinksAll.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-20% 0px -50% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));
}

// ── Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu() {
  if (hamburger) hamburger.classList.toggle('active');
  if (navLinks) navLinks.classList.toggle('open');
  if (navOverlay) navOverlay.classList.toggle('active');
  document.body.style.overflow = (navLinks && navLinks.classList.contains('open')) ? 'hidden' : '';
}

if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (navOverlay) navOverlay.addEventListener('click', toggleMenu);

if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

// ── Smooth Scroll for Anchor Links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Page Transitions ──
const pageTransition = document.getElementById('pageTransition');

document.querySelectorAll('.page-link').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#')) return;

  link.addEventListener('click', function (e) {
    e.preventDefault();
    if (pageTransition) {
      pageTransition.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 350);
    } else {
      window.location.href = href;
    }
  });
});

// Fade in on page load
window.addEventListener('load', () => {
  if (pageTransition) {
    pageTransition.classList.remove('active');
  }
});

// ── Typing Effect ──
const typingEl = document.getElementById('typingText');
const phrases = [
  'Unity Developer',
  'Game Enthusiast',
  'Open to Opportunities'
];

if (typingEl) {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 80;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      speed = 40;
    } else {
      typingEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      speed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 800);
}

// ── Animated Counters ──
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(counter => {
          const statType = counter.getAttribute('data-stat');
          let target = 0;

          if (statType === 'projects') {
            // Dynamically count total project cards present in DOM
            const projectCards = document.querySelectorAll('.project-card');
            target = projectCards.length;
          } else if (statType === 'experience') {
            // Dynamically calculate years of experience from start year (default: last year)
            const currentYear = new Date().getFullYear();
            const startYearAttr = counter.getAttribute('data-start-year');
            const startYear = startYearAttr ? parseInt(startYearAttr, 10) : (currentYear - 1);
            target = Math.max(1, currentYear - startYear);
          } else {
            target = parseInt(counter.getAttribute('data-target') || '0', 10);
          }

          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 1500;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            counter.textContent = current + suffix;

            if (progress < 1) {
              requestAnimationFrame(update);
            }
          }

          requestAnimationFrame(update);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterObserver.observe(statsGrid);
}

// ── Hero Particle Canvas ──
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.3 + 0.1
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? '224, 112, 80' : '196, 93, 62';

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
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

  const hoverTargets = 'a, button, .project-card, .stat-card, .contact-link, .form-submit, .filter-btn';
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
    if (window.pageYOffset > window.innerHeight * 0.8) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
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

// ── Contact Form Handling ──
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    const action = this.getAttribute('action');

    if (action && action.includes('your-form-id')) {
      e.preventDefault();

      const submitBtn = this.querySelector('.form-submit');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Message Sent!
        `;
        submitBtn.style.background = '#2e7d32';
        submitBtn.style.borderColor = '#2e7d32';

        this.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 4000);
      }
    }
  });
}

// ── Project Carousel & Filter Controller ──
const projectTrack = document.getElementById('projectTrack');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');
const filterBtns = document.querySelectorAll('.filter-btn');

if (projectTrack) {
  let currentIndex = 0;
  let activeFilter = 'all';

  function getVisibleCards() {
    const allCards = Array.from(projectTrack.querySelectorAll('.project-card'));
    if (activeFilter === 'all') return allCards;
    return allCards.filter(card => card.getAttribute('data-category') === activeFilter);
  }

  function getItemsPerPage() {
    return window.innerWidth > 768 ? 2 : 1;
  }

  function updateCarousel() {
    const allCards = Array.from(projectTrack.querySelectorAll('.project-card'));
    const visibleCards = getVisibleCards();

    allCards.forEach(card => {
      if (visibleCards.includes(card)) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    const itemsPerPage = getItemsPerPage();
    const totalVisible = visibleCards.length;
    const maxIndex = Math.max(0, totalVisible - itemsPerPage);

    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    if (visibleCards.length > 0) {
      const firstCard = visibleCards[0];
      const cardWidth = firstCard.getBoundingClientRect().width;
      const trackGap = 32;
      const moveDistance = currentIndex * (cardWidth + trackGap);
      projectTrack.style.transform = `translateX(-${moveDistance}px)`;
    } else {
      projectTrack.style.transform = 'translateX(0px)';
    }

    if (carouselPrev) carouselPrev.disabled = (currentIndex <= 0);
    if (carouselNext) carouselNext.disabled = (currentIndex >= maxIndex || totalVisible <= itemsPerPage);

    if (carouselDots) {
      carouselDots.innerHTML = '';
      const pageCount = Math.max(1, totalVisible - itemsPerPage + 1);
      if (pageCount > 1) {
        for (let i = 0; i < pageCount; i++) {
          const dot = document.createElement('div');
          dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
          dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
          });
          carouselDots.appendChild(dot);
        }
      }
    }
  }

  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  }

  if (carouselNext) {
    carouselNext.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      const itemsPerPage = getItemsPerPage();
      const maxIndex = Math.max(0, visibleCards.length - itemsPerPage);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });
  }

  if (filterBtns.length) {
    // Dynamic Filter Category Count Badges
    const allCards = Array.from(projectTrack.querySelectorAll('.project-card'));
    const counts = {
      all: allCards.length,
      vr: allCards.filter(c => c.getAttribute('data-category') === 'vr').length,
      ar: allCards.filter(c => c.getAttribute('data-category') === 'ar').length,
      mobile: allCards.filter(c => c.getAttribute('data-category') === 'mobile').length
    };

    filterBtns.forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      const count = counts[filter] !== undefined ? counts[filter] : 0;
      let badge = btn.querySelector('.filter-count');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'filter-count';
        btn.appendChild(badge);
      }
      badge.textContent = ` (${count})`;

      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        currentIndex = 0;
        updateCarousel();
      });
    });
  }

  window.addEventListener('resize', updateCarousel);
  setTimeout(updateCarousel, 100);
}


// ── Toast Notification Helper ──
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ── Copy Email ──
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    const email = 'ikhwanprananta01@email.com';
    navigator.clipboard.writeText(email).then(() => {
      const originalHTML = copyEmailBtn.innerHTML;
      copyEmailBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;
      copyEmailBtn.style.borderColor = '#2e7d32';
      showToast('Email address copied to clipboard!');
      setTimeout(() => {
        copyEmailBtn.innerHTML = originalHTML;
        copyEmailBtn.style.borderColor = '';
      }, 2000);
    });
  });
}

// ── CV Preview Modal Controller ──
const previewCvBtn = document.getElementById('previewCvBtn');
const cvModal = document.getElementById('cvModal');
const closeCvModal = document.getElementById('closeCvModal');
const cvModalBackdrop = document.getElementById('cvModalBackdrop');
const cvIframe = document.getElementById('cvIframe');

function openCvModal() {
  if (cvModal && cvIframe) {
    const pdfSrc = cvIframe.getAttribute('data-src');
    if (pdfSrc && !cvIframe.src) {
      cvIframe.src = pdfSrc;
    }
    cvModal.classList.add('active');
    cvModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeCvModalHandler() {
  if (cvModal) {
    cvModal.classList.remove('active');
    cvModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

if (previewCvBtn) previewCvBtn.addEventListener('click', openCvModal);
if (closeCvModal) closeCvModal.addEventListener('click', closeCvModalHandler);
if (cvModalBackdrop) cvModalBackdrop.addEventListener('click', closeCvModalHandler);

// ── Keyboard Navigation ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (cvModal && cvModal.classList.contains('active')) {
      closeCvModalHandler();
    } else if (navLinks && navLinks.classList.contains('open')) {
      toggleMenu();
    }
  } else if (e.key === 'ArrowRight') {
    if (carouselNext && !carouselNext.disabled) {
      carouselNext.click();
    }
  } else if (e.key === 'ArrowLeft') {
    if (carouselPrev && !carouselPrev.disabled) {
      carouselPrev.click();
    }
  }
});
