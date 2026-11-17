import type { Flashcard } from '../types/content';

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'js-let-const-var',
    topic: 'javascript',
    front: 'let vs const vs var',
    back: 'let and const are block-scoped. const prevents reassignment but not mutation. var is function-scoped and hoisted with an initial value of undefined.',
  },
  {
    id: 'js-equality',
    topic: 'javascript',
    front: '== vs ===',
    back: '== coerces types before comparing. === compares type and value without coercion, so prefer it unless you intentionally need coercion.',
  },
  {
    id: 'js-map-foreach',
    topic: 'javascript',
    front: 'map vs forEach',
    back: 'map returns a new array with the callback result. forEach returns undefined and is used for side effects.',
  },
  {
    id: 'js-null-undefined',
    topic: 'javascript',
    front: 'null vs undefined',
    back: 'undefined means a value was not assigned or is missing. null is an intentional absence. typeof null is "object".',
  },
  {
    id: 'js-event-loop',
    topic: 'javascript',
    front: 'Microtasks vs macrotasks',
    back: 'Promise callbacks and queueMicrotask run as microtasks after the current task. setTimeout and I/O are macrotasks. Microtasks drain first.',
  },
  {
    id: 'js-closure',
    topic: 'javascript',
    front: 'Closure',
    back: 'A closure is a function that remembers variables from the scope where it was created, even after that scope has finished.',
  },
  {
    id: 'ts-any-unknown',
    topic: 'typescript',
    front: 'any vs unknown',
    back: 'any disables type checking. unknown is safe: you must narrow it before using it.',
  },
  {
    id: 'ts-interface-type',
    topic: 'typescript',
    front: 'interface vs type',
    back: 'Interfaces support declaration merging and describe object shapes. Type aliases can represent unions, tuples, primitives and intersections.',
  },
  {
    id: 'ts-generics',
    topic: 'typescript',
    front: 'Generics',
    back: 'Type parameters let a function or type work with many types while preserving relationships, for example identity<T>(value: T): T.',
  },
  {
    id: 'ts-satisfies',
    topic: 'typescript',
    front: 'satisfies operator',
    back: 'Checks a value against a type without widening the inferred type, so literal types and autocomplete are preserved.',
  },
  {
    id: 'ts-utility-types',
    topic: 'typescript',
    front: 'Utility types',
    back: 'Partial, Required, Readonly, Pick, Omit and Record transform existing types without rewriting them.',
  },
  {
    id: 'ts-discriminated-unions',
    topic: 'typescript',
    front: 'Discriminated union',
    back: 'A union of object types that share a literal tag such as kind. Switch on the tag to get exhaustive, narrowed handling.',
  },
  {
    id: 'scss-use-import',
    topic: 'scss',
    front: '@use vs @import',
    back: '@use loads a module once, namespaced and scoped. @import is deprecated and pollutes the global scope.',
  },
  {
    id: 'scss-mixin-function',
    topic: 'scss',
    front: 'Mixins vs functions',
    back: 'Mixins emit CSS and can accept @content. Functions return a value and emit no CSS.',
  },
  {
    id: 'scss-parent',
    topic: 'scss',
    front: '& parent selector',
    back: '& refers to the current selector. .btn { &:hover {} } compiles to .btn:hover, and &__icon builds BEM suffixes.',
  },
  {
    id: 'scss-maps',
    topic: 'scss',
    front: 'Maps',
    back: 'Maps store key/value pairs, for example $theme: (primary: #f00). Read them with map.get($theme, primary) after @use "sass:map".',
  },
  {
    id: 'scss-extend',
    topic: 'scss',
    front: '@extend vs mixins',
    back: '@extend shares a selector and can bloat or leak styles. Mixins copy declarations and accept arguments, which is usually safer.',
  },
  {
    id: 'scss-default-forward',
    topic: 'scss',
    front: '!default and @forward',
    back: "!default assigns only if a variable is unset, which enables theme overrides. @forward re-exports a module's members.",
  },
];
