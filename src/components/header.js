export function createHeader(content) {
  const header = document.createElement('header');
  header.className = 'site-header';

  const skipLink = document.createElement('a');
  skipLink.href = '#content';
  skipLink.textContent = 'Skip to content';
  skipLink.className = 'skip-link';

  const brand = document.createElement('a');
  brand.href = '#home';
  brand.className = 'brand';
  brand.textContent = content.brandName;
  brand.setAttribute('aria-label', `${content.brandName} home`);

  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', 'Primary navigation');

  content.navItems.forEach((item) => {
    const link = document.createElement('a');
    link.href = `#${item.id}`;
    link.textContent = item.label;
    link.dataset.route = item.id;
    link.className = 'nav-link';
    nav.appendChild(link);
  });

  header.append(skipLink, brand, nav);
  return header;
}
