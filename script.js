const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

function activateTab(tab, moveFocus = false) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    item.classList.toggle('active-link', active);
  });
  panels.forEach((panel) => {
    const active = panel.id === tab.dataset.tab;
    panel.hidden = !active;
    panel.classList.toggle('active-tab', active);
  });
  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    activateTab(tabs[next], true);
  });
});

const sideMenu = document.getElementById('sidemenu');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const menuBackdrop = document.querySelector('.menu-backdrop');
const mobileMenu = window.matchMedia('(max-width: 900px)');

function setMenuOpen(open, restoreFocus = false) {
  sideMenu.classList.toggle('is-open', open);
  menuBackdrop.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  sideMenu.inert = mobileMenu.matches && !open;
  menuBackdrop.inert = !open;
  document.body.classList.toggle('menu-open', open);
  if (open) {
    // Move focus after the click's default focus behavior completes.
    setTimeout(() => menuClose.focus(), 0);
  }
  else if (restoreFocus) menuToggle.focus();
}

function syncMenu() {
  setMenuOpen(false);
  sideMenu.inert = mobileMenu.matches;
}

syncMenu();
mobileMenu.addEventListener('change', syncMenu);
menuToggle.addEventListener('click', () => setMenuOpen(true));
menuClose.addEventListener('click', () => setMenuOpen(false, true));
menuBackdrop.addEventListener('click', () => setMenuOpen(false, true));
sideMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sideMenu.classList.contains('is-open')) setMenuOpen(false, true);
});

const works = [...document.querySelectorAll('.work')];
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const filterStatus = document.getElementById('filter-status');

function showWorks(filter) {
  let count = 0;
  works.forEach((work) => {
    const visible = filter === 'all' || work.dataset.category === filter;
    work.hidden = !visible;
    if (visible) count += 1;
  });
  filterStatus.textContent = `Showing ${count} project${count === 1 ? '' : 's'}.`;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    showWorks(button.dataset.filter);
  });
});
showWorks('all');

const projects = {
  syllabus: {
    category: 'AI academic planning tool',
    title: 'Syllabus SOS',
    challenge: 'Course documents can scatter assignment requirements and deadlines across PDFs, screenshots, and syllabi.',
    solution: 'Built a document-to-plan flow that extracts likely work, shows supporting references, and lets students review, edit, approve, or reject items before planning.',
    stack: 'React, FastAPI, PyMuPDF, Meta Muse Spark',
    outcome: 'Students can organize approved work in weekly and calendar views. Extracted dates still require human verification, especially for images.',
    link: 'https://syllabus-sos.vercel.app/'
  },
  papertrail: {
    category: 'Local-first document tool',
    title: 'Papertrail PDF Q&A',
    challenge: 'Finding a specific answer in a long PDF is slow, and generated answers can be difficult to verify.',
    solution: 'Built a local PDF index with text extraction, OCR, document-scoped retrieval, and clickable page citations. An optional model can synthesize answers from retrieved passages.',
    stack: 'Python, SQLite, Apple NaturalLanguage, Vision, PDFKit',
    outcome: 'The app falls back to cited passages when no model is configured or a generated answer cannot be validated.',
    link: null
  },
  sparoo: {
    category: 'Full-stack auction application',
    title: 'SPAROO Online Auction',
    challenge: 'Timed auctions need coordinated listings, bids, wallet holds, winner selection, and administrator actions.',
    solution: 'Rebuilt an auction concept as a React frontend and Django REST application with MongoDB-backed listings, bidding, demo-coin accounting, and admin workflows.',
    stack: 'React, Tailwind CSS, Django REST Framework, MongoDB',
    outcome: 'The repository documents local buyer and admin flows plus automated checks. This is a demo-coin system, not a real-money payment product.',
    link: null
  },
  libaas: {
    category: 'E-commerce prototype',
    title: 'Alam Libaas',
    challenge: 'A storefront needs catalog browsing, cart state, checkout validation, and basic order management.',
    solution: 'Connected an HTML/CSS storefront to a Spring Boot backend with database-backed products, a session cart, cash-on-delivery checkout, and customer accounts.',
    stack: 'Java, Spring Boot, Thymeleaf, Spring Security, H2',
    outcome: 'The main catalog, cart, checkout, and authentication flows work locally. The project is an incomplete portfolio prototype, not a production store.',
    link: null
  },
  faith: {
    category: 'Local-first web application',
    title: 'Faith & Reflection',
    challenge: 'A personal record book should keep daily entries usable and recoverable without requiring an account.',
    solution: 'Built browser-local records with date-based editing, summaries, search, CSV and JSON export, backup restore, and storage recovery controls alongside learning pages.',
    stack: 'HTML, CSS, JavaScript, browser storage',
    outcome: 'Records stay in the browser profile, with backup and recovery tools. They are not encrypted or synced across devices.',
    link: null
  },
  clipquiz: {
    category: 'AI learning tool',
    title: 'ClipQuiz',
    challenge: 'Video-based learning can be passive and it is difficult to know what needs another review.',
    solution: 'Built a no-code flow that turns YouTube videos into personalized quizzes, smart feedback, and rewatch guidance.',
    stack: 'Google Opal',
    outcome: 'Creates a more active way to check understanding after watching a video.',
    link: 'https://opal.google/app/1VD_A4GF5WvSEHXLvcqS7ml8eiURBvBuN?shared'
  },
  sparklink: {
    category: 'Full-stack web application',
    title: 'SparkLink',
    challenge: 'Creators and professionals need a simple way to curate and share their most important links.',
    solution: 'Developed a link-in-bio builder with magic-link access, drag-and-drop editing, and customizable glassmorphism themes.',
    stack: 'React, Supabase, Tailwind CSS',
    outcome: 'Provides a polished, self-managed profile page with a live deployed demo.',
    link: 'https://sparklink-ten.vercel.app'
  },
  theatre: {
    category: 'Java full-stack application',
    title: 'Theatre Management System',
    challenge: 'Theatre bookings require consistent management of shows, seats, reservations, and payment records.',
    solution: 'Built a Spring Boot application for browsing shows, reserving seats, managing bookings, and tracking cash payments.',
    stack: 'Java, Spring Boot, Hibernate, MySQL, REST APIs',
    outcome: 'Demonstrates entity relationships, CRUD APIs, and database-backed booking workflows.',
    link: 'https://github.com/IrshadAlam-dev/theatre-management-system'
  },
  assistant: {
    category: 'Python desktop application',
    title: 'Python Virtual Assistant',
    challenge: 'Everyday tasks, notes, reminders, and quick information lookups are often split across separate tools.',
    solution: 'Built a Python assistant with typed commands, local task and reminder persistence, notes, weather and news lookups, plus a Tkinter dashboard and optional voice input/output.',
    stack: 'Python, Tkinter, JSON, SpeechRecognition, pyttsx3',
    outcome: 'Core local task and note workflows work without API keys, with optional voice and network-powered lookups.',
    link: 'https://github.com/IrshadAlam-dev/python-virtual-assistant'
  }
};

const projectModal = document.getElementById('project-modal');
const modalClose = projectModal.querySelector('.modal-close');
const modalLink = document.getElementById('modal-link');
const modalNote = document.getElementById('modal-note');
document.querySelectorAll('.case-study-button').forEach((button) => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    for (const field of ['category', 'title', 'challenge', 'solution', 'stack', 'outcome']) {
      document.getElementById(`modal-${field}`).textContent = project[field];
    }
    modalLink.hidden = !project.link;
    modalNote.hidden = Boolean(project.link);
    if (project.link) modalLink.href = project.link;
    else modalLink.removeAttribute('href');
    projectModal.showModal();
    modalClose.focus();
  });
});
modalClose.addEventListener('click', () => projectModal.close());
projectModal.addEventListener('click', (event) => {
  if (event.target === projectModal) projectModal.close();
});

const contactForm = document.getElementById('contact-form');
const contactSubmit = document.getElementById('contact-submit');
const formStatus = document.getElementById('form-status');
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  contactSubmit.disabled = true;
  contactSubmit.textContent = 'Sending…';
  formStatus.textContent = '';
  formStatus.className = 'form-status';
  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Message could not be sent.');
    contactForm.reset();
    formStatus.textContent = 'Thanks — your message has been sent.';
    formStatus.classList.add('is-success');
  } catch {
    formStatus.textContent = 'Something went wrong. Please email me directly instead.';
    formStatus.classList.add('is-error');
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.textContent = 'Send message';
  }
});

const copyEmailButton = document.querySelector('[data-copy-email]');
const emailCopyStatus = document.getElementById('email-copy-status');
copyEmailButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyEmailButton.dataset.copyEmail);
    emailCopyStatus.textContent = 'Email address copied to clipboard.';
  } catch {
    emailCopyStatus.textContent = 'Copy unavailable here. Select the email address above to copy it.';
  }
});

const backToTop = document.getElementById('back-to-top');
let scrollTicking = false;
function updateBackToTop() {
  backToTop.classList.toggle('is-visible', window.scrollY > 500);
}
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateBackToTop();
    scrollTicking = false;
  });
}, { passive: true });
updateBackToTop();
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
document.getElementById('copyright-year').textContent = new Date().getFullYear();
