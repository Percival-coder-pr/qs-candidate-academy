function createPoints(points) {
  const list = document.createElement('ol');
  points.forEach((point) => {
    const li = document.createElement('li');
    li.textContent = point;
    list.append(li);
  });
  return list;
}

export function createWhyUsSection(content) {
  const section = document.createElement('section');
  section.id = 'events';
  section.className = 'section section-why';

  const heading = document.createElement('h2');
  heading.textContent = content.whyUs.heading;

  const list = createPoints(content.whyUs.points);
  section.append(heading, list);

  return section;
}
