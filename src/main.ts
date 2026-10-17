/**
 * Bio-Cápsulas de Hidrorretención — Dashboard Informativo
 * Main TypeScript entry point
 * Handles: scroll animations, counter animations, FAQ, nav, particles
 */

import './style.css';

// ────────────────────────────────────────────
//  TYPES
// ────────────────────────────────────────────
interface ParticleConfig {
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
}

// ────────────────────────────────────────────
//  DOM Ready
// ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initNavigation();
  initScrollReveal();
  initCounters();
  initFAQ();
  initParticles();
  initSmoothScroll();
  initParallax();
});

// ────────────────────────────────────────────
//  PAGE LOAD Animation
// ────────────────────────────────────────────
function initPageLoad(): void {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
    // Trigger hero content reveal immediately
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      setTimeout(() => {
        heroContent.classList.add('revealed');
      }, 300);
    }
  });
}

// ────────────────────────────────────────────
//  NAVIGATION
// ────────────────────────────────────────────
function initNavigation(): void {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (!nav || !toggle || !mobileMenu) return;

  // Scroll handler for nav style
  const handleScroll = (): void => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ────────────────────────────────────────────
//  SCROLL REVEAL (IntersectionObserver)
// ────────────────────────────────────────────
function initScrollReveal(): void {
  const elements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// ────────────────────────────────────────────
//  ANIMATED COUNTERS
// ────────────────────────────────────────────
function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');

  const animateCounter = (el: HTMLElement): void => {
    const target = parseInt(el.getAttribute('data-count') || '0', 10);
    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

    const update = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(startVal + (target - startVal) * easedProgress);
      
      el.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

// ────────────────────────────────────────────
//  FAQ Accordion
// ────────────────────────────────────────────
function initFAQ(): void {
  const faqItems = document.querySelectorAll('[data-faq]');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('open');
        const btn = otherItem.querySelector('.faq-item__question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ────────────────────────────────────────────
//  FLOATING PARTICLES (Hero)
// ────────────────────────────────────────────
function initParticles(): void {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    const config: ParticleConfig = {
      x: (Math.random() - 0.5) * 200,
      y: -(Math.random() * 200 + 50),
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 10,
      size: Math.random() * 4 + 2,
    };

    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.width = `${config.size}px`;
    particle.style.height = `${config.size}px`;
    particle.style.setProperty('--particle-x', `${config.x}px`);
    particle.style.setProperty('--particle-y', `${config.y}px`);
    particle.style.setProperty('--particle-duration', `${config.duration}s`);
    particle.style.setProperty('--particle-delay', `${config.delay}s`);

    // Alternate between green and teal particles
    if (i % 3 === 0) {
      particle.style.background = 'rgba(137, 196, 196, 0.25)';
    } else if (i % 3 === 1) {
      particle.style.background = 'rgba(168, 213, 162, 0.2)';
    }

    container.appendChild(particle);
  }
}

// ────────────────────────────────────────────
//  SMOOTH SCROLL (nav links)
// ────────────────────────────────────────────
function initSmoothScroll(): void {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e: Event) => {
      const href = (link as HTMLAnchorElement).getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = 72;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}

// ────────────────────────────────────────────
//  PARALLAX Effects
// ────────────────────────────────────────────
function initParallax(): void {
  const impactImage = document.querySelector<HTMLElement>('.impact__image');
  
  if (!impactImage) return;

  const handleScroll = (): void => {
    const section = impactImage.closest('.section--impact');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const offset = (progress - 0.5) * 60;
      impactImage.style.transform = `translateY(${offset}px) scale(1.08)`;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}
