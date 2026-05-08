export const siteContent = {
  brandName: 'QS Candidate Academy',
  brandTagline: 'A community for candidates to share interview experiences, resources, and practical tips.',
  navItems: [
    { id: 'home', label: 'Home' },
    { id: 'community', label: 'Community' },
    { id: 'resources', label: 'Resources' },
    { id: 'events', label: 'Events' },
    { id: 'share', label: 'Share' },
  ],
  hero: {
    eyebrow: 'Candidate Community Hub',
    headline: 'Learn faster when candidates teach and support each other.',
    copy: 'QS Candidate Academy is a shared space for practical prep: explain tricky concepts, compare case-study approaches, and exchange experiences from real hiring rounds.',
    ctaPrimary: {
      label: 'Browse community posts',
      route: '#community',
    },
    ctaSecondary: {
      label: 'Contribute your tip',
      route: '#share',
    },
    image: {
      src: '/public/community-hero.svg',
      alt: 'Community study session illustration',
    },
  },
  communityHighlights: {
    heading: 'What you can find here',
    list: [
      {
        title: 'Shared Interview Playbooks',
        detail: 'Templates, solved examples, and practical breakdowns contributed by peers.',
      },
      {
        title: 'Knowledge Board',
        detail: 'Curated notes on data structures, aptitude, and behavioral prompts with versioned improvements.',
      },
      {
        title: 'Peer Review Circle',
        detail: 'Structured feedback on resumes, case responses, and mock performance.',
      },
      {
        title: 'Weekly Challenges',
        detail: 'Small group activities and peer-vetted questions to keep momentum high.',
      },
    ],
  },
  resources: {
    heading: 'Community-curated resources',
    list: [
      {
        title: 'Starter pack for first-time candidates',
        text: 'A practical checklist for the first 14 days of prep.',
      },
      {
        heading: 'Behavioral answer library',
        text: 'Example stories and evidence-based refinements from members.',
      },
      {
        heading: 'Case method notes',
        text: 'Reusable frameworks for structured reasoning and clear communication.',
      },
    ],
  },
  whyUs: {
    heading: 'How this community stays useful',
    points: [
      'Contributions are practical, short, and reusable.',
      'Members share what worked, what failed, and how they improved.',
      'The platform is open by design: no tiers, no paid gates.',
    ],
  },
  contact: {
    heading: 'Share with the community',
    description: 'Post an insight, a mock question, or a review request. The community team will moderate for clarity and respect.',
    buttonText: 'Submit insight',
    endpoint: '/api/submit-share',
    fields: [
      {
        name: 'name',
        label: 'Full name',
        type: 'text',
        autocomplete: 'name',
        required: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        autocomplete: 'email',
        required: true,
      },
      {
        name: 'focus',
        label: 'Focus area',
        type: 'text',
        autocomplete: 'off',
        required: true,
        placeholder: 'e.g., data structures, behavioral, aptitude',
      },
      {
        name: 'message',
        label: 'Your tip or question',
        type: 'textarea',
        required: true,
      },
    ],
  },
  events: {
    heading: 'Community sessions',
    list: [
      {
        title: 'Friday Live Revision',
        date: 'Friday, 07:00 PM UTC',
        detail: 'Members share one interview case and run a live critique on structured answers.',
      },
      {
        title: 'Weekend Problem Jam',
        date: 'Saturday, 11:00 AM UTC',
        detail: 'Timed practice block for aptitude and coding logic questions.',
      },
      {
        title: 'Peer Review Night',
        date: 'Second Sunday, 06:00 PM UTC',
        detail: 'Resume and portfolio rounds with structured scoring rubrics.',
      },
    ],
  },
  footerTag: 'Built for candidates, by candidates. No sales funnel.',
};
