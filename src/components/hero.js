function button(node, className = 'btn') {
  const label = node.label;
  const href = node.route;
  const action = document.createElement('a');
  action.className = className;
  action.textContent = label;
  action.href = href;
  action.setAttribute('aria-label', `${label}, ${href.replace('#', '')} section`);
  return action;
}

export function createHero(content) {
  const section = document.createElement('section');
  section.className = 'hero';
  section.id = `route-${content.hero.routeId || 'home'}`;

  const wrap = document.createElement('div');
  wrap.className = 'hero-content';

  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = content.hero.eyebrow;

  const imageWrap = document.createElement('figure');
  imageWrap.className = 'hero-visual';
  const image = document.createElement('img');
  image.src = content.hero.image.src;
  image.alt = content.hero.image.alt;
  image.width = 460;
  image.height = 300;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.setAttribute('class', 'hero-image');
  const caption = document.createElement('figcaption');
  caption.className = 'sr-only';
  caption.textContent = content.hero.image.alt;
  imageWrap.append(image, caption);

  const title = document.createElement('h1');
  title.textContent = content.hero.headline;

  const copy = document.createElement('p');
  copy.className = 'hero-copy';
  copy.textContent = content.hero.copy;

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.append(
    button(content.hero.ctaPrimary),
    button(content.hero.ctaSecondary, 'btn btn-soft'),
  );

  wrap.append(kicker, title, copy, actions);
  section.append(wrap, imageWrap);

  return section;
}
