function createResourceCard(data) {
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = data.title;

  const text = document.createElement('p');
  text.textContent = data.detail;

  card.append(title, text);
  return card;
}

function createResourceGrid(items) {
  const grid = document.createElement('div');
  grid.className = 'card-grid';
  items.forEach((item) => {
    grid.appendChild(createResourceCard(item));
  });
  return grid;
}

export function createCommunityBoardSection(content) {
  const section = document.createElement('section');
  section.id = 'community-board';
  section.className = 'section';
  section.setAttribute('aria-label', 'Community highlights');

  const heading = document.createElement('h2');
  heading.textContent = 'Community Highlights';

  const blurb = document.createElement('p');
  blurb.textContent = 'Highlights rotate from the latest member submissions and peer discussions.';

  section.append(heading, blurb, createResourceGrid(content.communityHighlights.list));
  return section;
}
