import type { Challenge } from '../types/content';

export const CHALLENGES: Challenge[] = [
  {
    id: 'js-challenge-reduce',
    topic: 'javascript',
    type: 'predict',
    title: 'Seed values in reduce',
    prompt: 'What is logged?',
    code: `const total = [1, 2, 3].reduce((sum, n) => sum + n, 10);
console.log(total);`,
    options: ['6', '16', '10', 'NaN'],
    answerIndex: 1,
    explanation:
      'The second argument to reduce is the initial accumulator. Starting at 10, adding 1, 2 and 3 gives 16.',
  },
  {
    id: 'js-challenge-spread',
    topic: 'javascript',
    type: 'fill',
    title: 'Shallow object copy',
    prompt: 'Which operator creates a shallow copy of original?',
    code: `const copy = { ___original, role: 'admin' };`,
    options: ['...', 'Object.assign', '&', '*'],
    answerIndex: 0,
    explanation:
      'Object spread copies own enumerable properties into a new object. The copy is shallow, so nested objects are shared.',
  },
  {
    id: 'js-challenge-const-reassign',
    topic: 'javascript',
    type: 'find-bug',
    title: 'Reassigning a const',
    prompt: 'Click the line that throws at runtime.',
    code: `const user = { name: 'Ada' };
user = { name: 'Grace' };
console.log(user.name);`,
    buggyLine: 1,
    explanation:
      'const prevents reassignment of the binding. Mutate the object instead, for example user.name = "Grace".',
  },
  {
    id: 'ts-challenge-pick',
    topic: 'typescript',
    type: 'fill',
    title: 'Pick a subset of properties',
    prompt: 'Which utility type builds a type with only name?',
    code: `type User = { name: string; age: number };
type UserPreview = ___<User, 'name'>;`,
    options: ['Pick', 'Omit', 'Partial', 'Record'],
    answerIndex: 0,
    explanation: "Pick<User, 'name'> produces { name: string }. Omit would remove the listed keys instead.",
  },
  {
    id: 'ts-challenge-excess-property',
    topic: 'typescript',
    type: 'find-bug',
    title: 'Excess property check',
    prompt: 'Click the line that triggers the TypeScript error.',
    code: `interface User {
  name: string;
}

const user: User = { name: 'Ada', age: 36 };`,
    buggyLine: 4,
    explanation:
      'Object literals assigned to a typed target are checked for excess properties. age is not in User, so TypeScript reports an error.',
  },
  {
    id: 'ts-challenge-satisfies',
    topic: 'typescript',
    type: 'predict',
    title: 'satisfies keeps literals',
    prompt: 'What is the type of palette.primary?',
    code: `const palette = {
  primary: '#f7df1e',
  secondary: '#4a9eff',
} satisfies Record<string, string>;`,
    options: ['string', "'#f7df1e'", 'any', 'unknown'],
    answerIndex: 1,
    explanation: 'satisfies checks the value without widening it, so palette.primary keeps the literal type "#f7df1e".',
  },
  {
    id: 'scss-challenge-math',
    topic: 'scss',
    type: 'predict',
    title: 'Divide with units',
    prompt: 'What padding is compiled?',
    code: `@use 'sass:math';

$gap: 8px;

.card {
  padding: math.div($gap, 2);
}`,
    options: ['8px', '4px', '16px', '0'],
    answerIndex: 1,
    explanation: 'math.div keeps units, so 8px divided by 2 is 4px.',
  },
  {
    id: 'scss-challenge-include',
    topic: 'scss',
    type: 'fill',
    title: 'Apply a mixin',
    prompt: 'Which directive applies flex-center?',
    code: `@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row {
  ___ flex-center;
}`,
    options: ['@include', '@extend', '@use', '@mixin'],
    answerIndex: 0,
    explanation: 'Mixins are applied with @include. @extend works with selectors, not mixins.',
  },
  {
    id: 'scss-challenge-namespace',
    topic: 'scss',
    type: 'find-bug',
    title: 'Module namespacing',
    prompt: 'Click the line that fails to compile.',
    code: `@use 'theme';

.card {
  color: $primary;
}`,
    buggyLine: 3,
    explanation:
      '@use namespaces module members. Use theme.$primary, or @use "theme" as * if you really want the members unqualified.',
  },
];
