const year = document.getElementById('year');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const filterButtons = document.querySelectorAll('.filter-button');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialButtons = document.querySelectorAll('[data-action]');
const contactForm = document.getElementById('contactForm');
const formToast = document.getElementById('formToast');
const revealElements = document.querySelectorAll('.reveal');
const body = document.body;

year.textContent = new Date().getFullYear();

function setTheme(mode) {
  body.classList.toggle('theme-light', mode === 'light');
  body.classList.toggle('theme-dark', mode !== 'light');
  localStorage.setItem('themeMode', mode);
}

function initTheme() {
  const saved = localStorage.getItem('themeMode');
  if (saved) {
    setTheme(saved);
    return;
  }
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(prefersLight ? 'light' : 'dark');
}

themeToggle?.addEventListener('click', () => {
  const current = body.classList.contains('theme-light') ? 'light' : 'dark';
  setTheme(current === 'light' ? 'dark' : 'light');
});

menuToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.hasAttribute('hidden');
  if (isOpen) {
    mobileMenu.removeAttribute('hidden');
    menuToggle.setAttribute('aria-label', 'Close menu');
  } else {
    mobileMenu.setAttribute('hidden', '');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.setAttribute('hidden', '');
    menuToggle.setAttribute('aria-label', 'Open menu');
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    portfolioCards.forEach((card) => {
      const category = card.dataset.category;
      const visible = filter === 'all' || category === filter;
      card.style.display = visible ? 'block' : 'none';
    });
  });
});

[...portfolioCards].forEach((card) => {
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      card.click();
    }
  });
});

let testimonialIndex = 0;
const testimonialSlides = testimonialTrack ? [...testimonialTrack.querySelectorAll('.testimonial-slide')] : [];

function updateTestimonials(direction) {
  if (!testimonialSlides.length) return;
  testimonialSlides[testimonialIndex].classList.remove('active');
  testimonialIndex = direction === 'next' ? (testimonialIndex + 1) % testimonialSlides.length : (testimonialIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
  testimonialSlides[testimonialIndex].classList.add('active');
}

testimonialButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'next' || action === 'prev') {
      updateTestimonials(action);
    }
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  contactForm.reset();
  formToast?.classList.add('visible');
  window.setTimeout(() => formToast?.classList.remove('visible'), 3200);
});

function revealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealElements.forEach((element) => observer.observe(element));
}

initTheme();
revealObserver();
