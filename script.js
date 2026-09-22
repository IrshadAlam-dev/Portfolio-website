const tabLinks = document.querySelectorAll('.tab-links');
const tabContents = document.querySelectorAll('.tab-contents');
const sideMenu = document.getElementById('sidemenu');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');

function closeMenu() {
  sideMenu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

tabLinks.forEach((tab) => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;

    tabLinks.forEach((item) => {
      item.classList.remove('active-link');
      item.setAttribute('aria-selected', 'false');
    });
    tabContents.forEach((content) => {
      content.classList.remove('active-tab');
      content.hidden = true;
    });

    tab.classList.add('active-link');
    tab.setAttribute('aria-selected', 'true');
    const activeContent = document.getElementById(tabName);
    activeContent.classList.add('active-tab');
    activeContent.hidden = false;
  });
});

menuToggle.addEventListener('click', () => {
  sideMenu.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
});
menuClose.addEventListener('click', closeMenu);
sideMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    // <!-- for work section functionality -->

const works = document.querySelectorAll('.work');
      const filterButtons = document.querySelectorAll('.filter-btn');
      let currentFilter = 'all';

      showWorks(currentFilter);
  
      // Event listener for filter buttons
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Set active filter
          currentFilter = button.dataset.filter;
          // Update active button style
          filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
          });
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');
          // Show filtered works
          showWorks(currentFilter);
        });
      });
  
      function showWorks(filter) {
        let filteredWorks = Array.from(works).filter(work => {
          return filter === 'all' || work.dataset.category === filter;
        });
  
        // Hide all works first
        works.forEach(work => work.style.display = 'none');
  
        filteredWorks.forEach((work) => {
          work.style.display = 'block';
        });
      }

const projects = {
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
  }
};

const projectModal = document.getElementById('project-modal');
const modalClose = document.querySelector('.modal-close');

document.querySelectorAll('.case-study-button').forEach((button) => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    document.getElementById('modal-category').textContent = project.category;
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-challenge').textContent = project.challenge;
    document.getElementById('modal-solution').textContent = project.solution;
    document.getElementById('modal-stack').textContent = project.stack;
    document.getElementById('modal-outcome').textContent = project.outcome;
    document.getElementById('modal-link').href = project.link;
    projectModal.showModal();
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

const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('is-visible', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
