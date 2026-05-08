import { siteContent } from './data/site-content.js';
import { createHeader } from './components/header.js';
import { createFooter } from './components/footer.js';
import { renderRoute, normalize } from './router.js';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('Root #app element not found.');
}

const header = createHeader(siteContent);
const main = document.createElement('main');
main.id = 'content';
main.className = 'content';
const footer = createFooter(siteContent);

const navLinks = header.querySelectorAll('[data-route]');

function setActiveNavigation() {
  const active = normalize(window.location.hash);
  navLinks.forEach((link) => {
    const isActive = link.dataset.route === active;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function render() {
  setActiveNavigation();
  main.replaceChildren(...renderRoute(siteContent));
}

window.addEventListener('hashchange', render);
app.replaceChildren(header, main, footer);
render();
