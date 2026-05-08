import { createHero } from './components/hero.js';
import { createModulesSection } from './components/modules.js';
import { createFeaturesSection } from './components/features.js';
import { createWhyUsSection } from './components/why-us.js';
import { createCommunityBoardSection } from './components/community-board.js';
import { createEventsListSection } from './components/events-list.js';
import { createContactSection } from './components/contact.js';

function routeHome(content) {
  const homeHero = {
    ...content.hero,
    routeId: 'home',
  };

  return [
    createHero({
      ...content,
      hero: homeHero,
    }),
    createModulesSection(content),
    createFeaturesSection(content),
    createWhyUsSection(content),
    createContactSection(content),
  ];
}

function routeCommunity(content) {
  const communityHero = {
    ...content.hero,
    routeId: 'community',
    eyebrow: 'Community board',
    headline: 'Share what you know, ask what you need.',
    copy: 'The community center helps candidates find relevant insights quickly and keep momentum between rounds.',
    ctaPrimary: {
      label: 'Back to home',
      route: '#home',
    },
    ctaSecondary: {
      label: 'Contribute now',
      route: '#share',
    },
  };

  return [
    createHero({
      ...content,
      hero: communityHero,
    }),
    createCommunityBoardSection(content),
    createContactSection(content),
  ];
}

function routeResources(content) {
  const resourceHero = {
    ...content.hero,
    routeId: 'resources',
    eyebrow: 'Community resources',
    headline: 'Free references contributed by candidates.',
    copy: 'Use practical notes, templates, and interview playbooks from peers with real recruiting experience.',
    ctaPrimary: {
      label: 'Browse community',
      route: '#community',
    },
    ctaSecondary: {
      label: 'Submit your own',
      route: '#share',
    },
  };

  return [
    createHero({
      ...content,
      hero: resourceHero,
    }),
    createFeaturesSection(content),
    createContactSection(content),
  ];
}

function routeEvents(content) {
  const eventsHero = {
    ...content.hero,
    routeId: 'events',
    eyebrow: 'Session calendar',
    headline: 'Join peer sessions without any fee or login.',
    copy: 'Use these live windows to review case studies, compare strategies, and improve quickly.',
    ctaPrimary: {
      label: 'See events',
      route: '#events',
    },
    ctaSecondary: {
      label: 'Tell us about your local meetup',
      route: '#share',
    },
  };

  return [createHero({ ...content, hero: eventsHero }), createEventsListSection(content)];
}

function routeShare(content) {
  const shareHero = {
    ...content.hero,
    routeId: 'share',
    eyebrow: 'Contribute',
    headline: 'Add your note, prompt, or review request.',
    copy: 'Every submission improves the quality of help for the next candidate.',
    ctaPrimary: {
      label: 'Back to home',
      route: '#home',
    },
    ctaSecondary: {
      label: 'Check upcoming sessions',
      route: '#events',
    },
  };

  return [createHero({ ...content, hero: shareHero }), createContactSection(content)];
}

const routeMap = {
  home: routeHome,
  community: routeCommunity,
  resources: routeResources,
  events: routeEvents,
  share: routeShare,
};

function normalize(route) {
  const trimmed = String(route || '').replace('#', '').toLowerCase();
  if (!trimmed || !routeMap[trimmed]) {
    return 'home';
  }
  return trimmed;
}

export function renderRoute(content) {
  const pathname = normalize(window.location.hash);
  return routeMap[pathname](content);
}

export { normalize, routeMap };
