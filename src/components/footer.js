export function createFooter(content) {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';

  const text = document.createElement('p');
  text.textContent = `${content.brandName} - ${content.footerTag}`;

  footer.append(text);
  return footer;
}
