import type { Topic, TopicId } from '../types/content';

export const TOPIC_MAP: Record<TopicId, Topic> = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    shortName: 'JS',
    tagline: 'Coercion, closures, async and the event loop',
    description: 'Sharpen the runtime details that show up in interviews and real bugs.',
    accent: '#f7df1e',
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    shortName: 'TS',
    tagline: 'Types that model your data safely',
    description: 'Practise generics, narrowing, utility types and compiler behaviour.',
    accent: '#4a9eff',
  },
  scss: {
    id: 'scss',
    name: 'SCSS',
    shortName: 'SCSS',
    tagline: 'Modules, mixins and maintainable styles',
    description: 'Refresh the Sass features that keep large stylesheets tidy.',
    accent: '#cf649a',
  },
};

export const TOPICS: Topic[] = [TOPIC_MAP.javascript, TOPIC_MAP.typescript, TOPIC_MAP.scss];
