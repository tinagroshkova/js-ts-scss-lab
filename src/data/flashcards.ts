import type { Flashcard } from '../types/content';

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'js-let-const-var',
    topic: 'javascript',
    front: 'let vs const vs var',
    back: 'let and const are block-scoped. const prevents reassignment but not mutation. var is function-scoped and hoisted with an initial value of undefined.',
    example: `const user = { name: 'Ada' };
user.name = 'Grace'; // ok: mutation
// user = {};        // error: reassignment

for (var i = 0; i < 2; i++) {}
console.log(i); // 2, var leaked out`,
  },
  {
    id: 'js-equality',
    topic: 'javascript',
    front: '== vs ===',
    back: '== coerces types before comparing. === compares type and value without coercion, so prefer it unless you intentionally need coercion.',
    example: `1 == '1';           // true  (coerced)
1 === '1';          // false
null == undefined;  // true
null === undefined; // false`,
  },
  {
    id: 'js-map-foreach',
    topic: 'javascript',
    front: 'map vs forEach',
    back: 'map returns a new array with the callback result. forEach returns undefined and is used for side effects.',
    example: `const nums = [1, 2, 3];
nums.map((n) => n * 2); // [2, 4, 6]
nums.forEach((n) => console.log(n)); // undefined`,
  },
  {
    id: 'js-null-undefined',
    topic: 'javascript',
    front: 'null vs undefined',
    back: 'undefined means a value was not assigned or is missing. null is an intentional absence. typeof null is "object".',
    example: `let a;            // undefined
const b = null;   // intentional absence
typeof null;      // 'object'
typeof undefined; // 'undefined'`,
  },
  {
    id: 'js-event-loop',
    topic: 'javascript',
    front: 'Microtasks vs macrotasks',
    back: 'Promise callbacks and queueMicrotask run as microtasks after the current task. setTimeout and I/O are macrotasks. Microtasks drain first.',
    example: `console.log('1');
setTimeout(() => console.log('2'));
Promise.resolve().then(() => console.log('3'));
console.log('4');
// logs: 1, 4, 3, 2`,
  },
  {
    id: 'js-closure',
    topic: 'javascript',
    front: 'Closure',
    back: 'A closure is a function that remembers variables from the scope where it was created, even after that scope has finished.',
    example: `const counter = () => {
  let count = 0;
  return () => ++count;
};

const next = counter();
next(); // 1
next(); // 2`,
  },
  {
    id: 'ts-any-unknown',
    topic: 'typescript',
    front: 'any vs unknown',
    back: 'any disables type checking. unknown is safe: you must narrow it before using it.',
    example: `let a: any = 'hi';
a.toFixed(); // compiles, crashes at runtime

let u: unknown = 'hi';
// u.toUpperCase(); // error: must narrow first
if (typeof u === 'string') u.toUpperCase();`,
  },
  {
    id: 'ts-interface-type',
    topic: 'typescript',
    front: 'interface vs type',
    back: 'Interfaces support declaration merging and describe object shapes. Type aliases can represent unions, tuples, primitives and intersections.',
    example: `interface User { id: number }
interface User { name: string } // merges

type Id = string | number;      // union
type Pair = [number, number];   // tuple`,
  },
  {
    id: 'ts-generics',
    topic: 'typescript',
    front: 'Generics',
    back: 'Type parameters let a function or type work with many types while preserving relationships, for example identity<T>(value: T): T.',
    example: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

first([1, 2]);     // number | undefined
first(['a', 'b']); // string | undefined`,
  },
  {
    id: 'ts-satisfies',
    topic: 'typescript',
    front: 'satisfies operator',
    back: 'Checks a value against a type without widening the inferred type, so literal types and autocomplete are preserved.',
    example: `const routes = {
  home: '/',
  user: '/user',
} satisfies Record<string, \`/\${string}\`>;

routes.home; // type is '/', not string`,
  },
  {
    id: 'ts-utility-types',
    topic: 'typescript',
    front: 'Utility types',
    back: 'Partial, Required, Readonly, Pick, Omit and Record transform existing types without rewriting them.',
    example: `interface Todo { id: number; title: string; done: boolean }

type Draft = Partial<Todo>;
type Preview = Pick<Todo, 'id' | 'title'>;
type Rest = Omit<Todo, 'id'>;
type ById = Record<number, Todo>;`,
  },
  {
    id: 'ts-discriminated-unions',
    topic: 'typescript',
    front: 'Discriminated union',
    back: 'A union of object types that share a literal tag such as kind. Switch on the tag to get exhaustive, narrowed handling.',
    example: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number };

function area(s: Shape): number {
  return s.kind === 'circle' ? Math.PI * s.radius ** 2 : s.size ** 2;
}`,
  },
  {
    id: 'scss-use-import',
    topic: 'scss',
    front: '@use vs @import',
    back: '@use loads a module once, namespaced and scoped. @import is deprecated and pollutes the global scope.',
    example: `// _colors.scss
$primary: #4a9eff;

// main.scss
@use 'colors';

.button { color: colors.$primary; }`,
  },
  {
    id: 'scss-mixin-function',
    topic: 'scss',
    front: 'Mixins vs functions',
    back: 'Mixins emit CSS and can accept @content. Functions return a value and emit no CSS.',
    example: `@use 'sass:math';

@mixin center {
  display: grid;
  place-items: center;
}

@function rem($px) {
  @return math.div($px, 16) * 1rem;
}

.card { @include center; padding: rem(24); }`,
  },
  {
    id: 'scss-parent',
    topic: 'scss',
    front: '& parent selector',
    back: '& refers to the current selector. .btn { &:hover {} } compiles to .btn:hover, and &__icon builds BEM suffixes.',
    example: `.btn {
  &:hover { opacity: 0.8; }
  &__icon { margin-right: 6px; }
  .dark & { color: #fff; }
}

// .btn:hover, .btn__icon, .dark .btn`,
  },
  {
    id: 'scss-maps',
    topic: 'scss',
    front: 'Maps',
    back: 'Maps store key/value pairs, for example $theme: (primary: #f00). Read them with map.get($theme, primary) after @use "sass:map".',
    example: `@use 'sass:map';

$theme: (primary: #4a9eff, danger: #ff5c7a);

.button {
  color: map.get($theme, primary);
}`,
  },
  {
    id: 'scss-extend',
    topic: 'scss',
    front: '@extend vs mixins',
    back: '@extend shares a selector and can bloat or leak styles. Mixins copy declarations and accept arguments, which is usually safer.',
    example: `%button {
  padding: 10px 16px;
  border-radius: 8px;
}

.primary { @extend %button; background: #4a9eff; }
.ghost   { @extend %button; background: transparent; }`,
  },
  {
    id: 'scss-default-forward',
    topic: 'scss',
    front: '!default and @forward',
    back: "!default assigns only if a variable is unset, which enables theme overrides. @forward re-exports a module's members.",
    example: `// _theme.scss
$radius: 8px !default;

// app.scss
@use 'theme' with ($radius: 12px);

// _index.scss
@forward 'theme';`,
  },
];
