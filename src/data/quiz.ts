import type { QuizQuestion } from '../types/content';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'js-typeof-null',
    topic: 'javascript',
    difficulty: 'easy',
    prompt: 'What does typeof null return?',
    options: ['"null"', '"object"', '"undefined"', '"boolean"'],
    answerIndex: 1,
    explanation:
      'typeof null returns "object". This is a historic JavaScript bug kept for backwards compatibility. Use value === null to test for null.',
  },
  {
    id: 'js-array-plus-array',
    topic: 'javascript',
    difficulty: 'medium',
    prompt: 'What is the result of [] + []?',
    options: ['[]', '"" (empty string)', '0', 'NaN'],
    answerIndex: 1,
    explanation:
      'Both arrays convert to empty strings, and + performs string concatenation, so the result is an empty string.',
  },
  {
    id: 'js-float-equality',
    topic: 'javascript',
    difficulty: 'easy',
    prompt: 'What does 0.1 + 0.2 === 0.3 evaluate to?',
    options: ['true', 'false', 'TypeError', 'NaN'],
    answerIndex: 1,
    explanation:
      'Floating point numbers are stored in binary, so 0.1 + 0.2 is 0.30000000000000004. Compare with a tolerance such as Number.EPSILON.',
  },
  {
    id: 'js-string-minus',
    topic: 'javascript',
    difficulty: 'easy',
    prompt: "What is the result of '5' - 2?",
    options: ['3', "'52'", 'NaN', 'TypeError'],
    answerIndex: 0,
    explanation:
      'The - operator coerces operands to numbers, so the string "5" becomes 5. The + operator would concatenate and produce "52".',
  },
  {
    id: 'js-nan-equality',
    topic: 'javascript',
    difficulty: 'easy',
    prompt: 'What does NaN === NaN evaluate to?',
    options: ['true', 'false', 'TypeError', 'undefined'],
    answerIndex: 1,
    explanation: 'NaN is not equal to any value, including itself. Use Number.isNaN(value) to detect it reliably.',
  },
  {
    id: 'js-event-loop-order',
    topic: 'javascript',
    difficulty: 'medium',
    prompt: 'In what order are these messages logged?',
    code: `console.log('sync');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));`,
    options: ['sync, timeout, promise', 'sync, promise, timeout', 'promise, sync, timeout', 'timeout, promise, sync'],
    answerIndex: 1,
    explanation:
      'Synchronous code runs first. Microtasks (promise callbacks) drain before the next macrotask (the timeout), so the order is sync, promise, timeout.',
  },
  {
    id: 'js-nullish-zero',
    topic: 'javascript',
    difficulty: 'medium',
    prompt: 'What is the value of 0 ?? 5?',
    options: ['0', '5', 'null', 'undefined'],
    answerIndex: 0,
    explanation:
      'The nullish coalescing operator only falls back when the left side is null or undefined. Since 0 is neither, the result is 0. The || operator would return 5.',
  },
  {
    id: 'js-closure-counter',
    topic: 'javascript',
    difficulty: 'medium',
    prompt: 'What does the final console.log print?',
    code: `const makeCounter = () => {
  let count = 0;
  return () => ++count;
};

const a = makeCounter();
const b = makeCounter();
a();
a();
console.log(b());`,
    options: ['0', '1', '2', '3'],
    answerIndex: 1,
    explanation:
      'Each call to makeCounter creates a separate closure with its own count. b has never been called, so it returns 1.',
  },
  {
    id: 'js-spread-string',
    topic: 'javascript',
    difficulty: 'easy',
    prompt: "What is the result of [...'hi']?",
    options: ["['hi']", "['h', 'i']", "'hi'", 'TypeError'],
    answerIndex: 1,
    explanation: 'Strings are iterable, so the spread operator expands them into individual characters: ["h", "i"].',
  },
  {
    id: 'js-for-in-array',
    topic: 'javascript',
    difficulty: 'medium',
    prompt: "What does this loop log for ['a', 'b']?",
    code: `for (const key in ['a', 'b']) {
  console.log(key);
}`,
    options: ['"a", "b"', '"0", "1"', '"1", "2"', '"undefined"'],
    answerIndex: 1,
    explanation:
      'for...in iterates enumerable property keys. For arrays those keys are the indices as strings. Use for...of to iterate values.',
  },
  {
    id: 'ts-unknown-narrow',
    topic: 'typescript',
    difficulty: 'easy',
    prompt: 'Which type forces you to narrow before you can use the value?',
    options: ['any', 'unknown', 'object', 'void'],
    answerIndex: 1,
    explanation:
      'unknown is the type-safe counterpart of any. You must check or narrow it before accessing properties or calling it.',
  },
  {
    id: 'ts-declaration-merging',
    topic: 'typescript',
    difficulty: 'medium',
    prompt: 'Which construct supports declaration merging across multiple declarations?',
    options: ['type alias', 'interface', 'enum', 'class'],
    answerIndex: 1,
    explanation:
      'Interfaces with the same name merge their members. Type aliases cannot be reopened, so duplicate type aliases are an error.',
  },
  {
    id: 'ts-as-const',
    topic: 'typescript',
    difficulty: 'medium',
    prompt: 'What is the type of pair?',
    code: `const pair = ['a', 'b'] as const;`,
    options: ['string[]', "readonly ['a', 'b']", "['a', 'b']", 'readonly string[]'],
    answerIndex: 1,
    explanation:
      'as const makes the array readonly and preserves the literal element types, so the type is readonly ["a", "b"].',
  },
  {
    id: 'ts-partial',
    topic: 'typescript',
    difficulty: 'easy',
    prompt: 'What does Partial<User> do to the properties of User?',
    options: ['Makes them readonly', 'Makes them required', 'Makes them optional', 'Makes them private'],
    answerIndex: 2,
    explanation: 'Partial<T> adds ? to every property, producing a type where all members are optional.',
  },
  {
    id: 'ts-satisfies',
    topic: 'typescript',
    difficulty: 'medium',
    prompt: 'What does the satisfies operator do?',
    options: [
      'Casts the value and widens its type',
      'Checks the value against a type while keeping the inferred literal type',
      'Removes properties that do not match',
      'Makes every property optional',
    ],
    answerIndex: 1,
    explanation:
      'satisfies validates that a value matches a type without changing the inferred type, so literal types and autocomplete are preserved.',
  },
  {
    id: 'ts-never',
    topic: 'typescript',
    difficulty: 'easy',
    prompt: 'Which return type means a function never returns normally?',
    options: ['void', 'undefined', 'never', 'null'],
    answerIndex: 2,
    explanation: 'never represents an unreachable result, such as a function that always throws or loops forever.',
  },
  {
    id: 'ts-keyof',
    topic: 'typescript',
    difficulty: 'medium',
    prompt: 'What is the type of Keys?',
    code: `type Keys = keyof { a: string; b: number };`,
    options: ['string | number', "'a' | 'b'", "['a', 'b']", 'never'],
    answerIndex: 1,
    explanation: 'keyof produces a union of the object type\u2019s property names, so Keys is "a" | "b".',
  },
  {
    id: 'ts-optional-chain',
    topic: 'typescript',
    difficulty: 'medium',
    prompt: 'What does the type of city include?',
    code: `type City = { city: string };
type User = { address?: City };
declare const user: User;
const city = user?.address?.city;`,
    options: ['null only', 'undefined', 'never', 'void'],
    answerIndex: 1,
    explanation: 'Optional chaining short-circuits to undefined when a link is missing, so city is string | undefined.',
  },
  {
    id: 'ts-record',
    topic: 'typescript',
    difficulty: 'easy',
    prompt: 'What does Record<string, number> describe?',
    options: [
      'An array of numbers',
      'An object with string keys and number values',
      'A tuple of string and number',
      'A function returning a number',
    ],
    answerIndex: 1,
    explanation: 'Record<K, V> builds an object type whose keys come from K and whose values come from V.',
  },
  {
    id: 'ts-enum-vs-union',
    topic: 'typescript',
    difficulty: 'hard',
    prompt: 'Which statement about enums and union types is true?',
    options: [
      'Enums are erased at compile time; unions emit runtime code',
      'Union types are erased at compile time; enums emit runtime code',
      'Both are erased at compile time',
      'Both emit runtime code',
    ],
    answerIndex: 1,
    explanation:
      'Union types exist only in the type system and disappear after compilation. Enums generate a runtime object unless you use a const enum.',
  },
  {
    id: 'scss-use-import',
    topic: 'scss',
    difficulty: 'easy',
    prompt: 'Which directive is the modern Sass module system?',
    options: ['@import', '@use', '@require', '@include'],
    answerIndex: 1,
    explanation:
      '@use loads a module once, namespaces its members and keeps the global scope clean. @import is deprecated.',
  },
  {
    id: 'scss-mixin-include',
    topic: 'scss',
    difficulty: 'easy',
    prompt: 'How do you apply a mixin?',
    options: ['@mixin', '@include', '@extend', '@apply'],
    answerIndex: 1,
    explanation: 'Define reusable declarations with @mixin and apply them with @include.',
  },
  {
    id: 'scss-parent-selector',
    topic: 'scss',
    difficulty: 'easy',
    prompt: 'What does .btn { &:hover { color: red; } } compile to?',
    options: ['.btn .btn:hover', '.btn:hover', '.btn > :hover', ':hover'],
    answerIndex: 1,
    explanation: 'The & parent selector refers to .btn, so the nested rule compiles to .btn:hover.',
  },
  {
    id: 'scss-map-get',
    topic: 'scss',
    difficulty: 'medium',
    prompt: 'What is the modern way to read a value from a map?',
    options: ['map-get($map, key)', 'map.get($map, key)', '$map[key]', 'get($map, key)'],
    answerIndex: 1,
    explanation: 'With @use "sass:map", use map.get($map, key). The global map-get function is deprecated.',
  },
  {
    id: 'scss-interpolation',
    topic: 'scss',
    difficulty: 'easy',
    prompt: 'How do you interpolate a Sass variable into a selector or property name?',
    options: ['${name}', '#{$name}', '{{ name }}', '%{name}'],
    answerIndex: 1,
    explanation: 'Sass uses #{...} interpolation, for example .icon-#{$name} or content: "#{$label}".',
  },
  {
    id: 'scss-math-div',
    topic: 'scss',
    difficulty: 'medium',
    prompt: "With @use 'sass:math', what does math.div(10px, 2) return?",
    options: ['5px', '5', '10px / 2', 'error'],
    answerIndex: 0,
    explanation: 'math.div performs division and keeps units, so 10px divided by 2 is 5px.',
  },
  {
    id: 'scss-each',
    topic: 'scss',
    difficulty: 'easy',
    prompt: 'Which directive iterates over a list or map?',
    options: ['@for', '@while', '@each', '@loop'],
    answerIndex: 2,
    explanation: '@each walks lists and maps, for example @each $name, $color in $theme { ... }.',
  },
  {
    id: 'scss-default',
    topic: 'scss',
    difficulty: 'medium',
    prompt: 'What does !default do on a variable declaration?',
    options: [
      'Assigns only if the variable is undefined or null',
      'Forces the variable to be null',
      'Makes the variable private',
      'Marks the variable as a CSS custom property',
    ],
    answerIndex: 0,
    explanation:
      '!default provides a fallback value that can be overridden before the module is loaded, which is useful for theming.',
  },
  {
    id: 'scss-placeholder',
    topic: 'scss',
    difficulty: 'medium',
    prompt: 'What is %button in Sass?',
    options: [
      'A CSS custom property',
      'A placeholder selector that only outputs when extended',
      'A mixin alias',
      'A map key',
    ],
    answerIndex: 1,
    explanation: 'Placeholder selectors start with % and are not emitted unless another selector @extends them.',
  },
  {
    id: 'scss-content',
    topic: 'scss',
    difficulty: 'hard',
    prompt: 'What does @content do inside a mixin?',
    options: [
      'Injects the block passed to the mixin',
      'Returns a value from the mixin',
      'Extends the parent selector',
      'Imports another module',
    ],
    answerIndex: 0,
    explanation:
      '@content renders the block supplied by the caller, which lets mixins wrap custom declarations such as media queries.',
  },
];
