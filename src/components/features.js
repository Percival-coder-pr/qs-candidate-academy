function featureCard(feature) {
  const item = document.createElement('li');

  const h3 = document.createElement('h3');
  h3.textContent = feature.heading || feature.title;

  const p = document.createElement('p');
  p.textContent = feature.text;

  item.append(h3, p);
  return item;
}

export function createFeaturesSection(content) {
  const section = document.createElement('section');
  section.id = 'resources';
  section.className = 'section section-alt';

  const heading = document.createElement('h2');
  heading.textContent = content.resources.heading;

  const list = document.createElement('ul');
  list.className = 'feature-list';
  content.resources.list.forEach((feature) => {
    list.appendChild(featureCard(feature));
  });

  section.append(heading, list);
  return section;
}
