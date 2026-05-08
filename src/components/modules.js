function cardFromData(data) {
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = data.title;

  const text = document.createElement('p');
  text.textContent = data.detail;

  card.append(title, text);
  return card;
}

export function createModulesSection(content) {
  const section = document.createElement('section');
  section.id = 'community';
  section.className = 'section';

  const heading = document.createElement('h2');
  heading.textContent = content.communityHighlights.heading;

  const grid = document.createElement('div');
  grid.className = 'card-grid';
  content.communityHighlights.list.forEach((item) => {
    grid.appendChild(cardFromData(item));
  });

  section.append(heading, grid);
  return section;
}
