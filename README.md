# Syntax Lab

An interactive refresher for **JavaScript**, **TypeScript** and **SCSS**. Quiz yourself, flip through flashcards, and solve small code challenges. Progress is stored in `localStorage`, so there is no backend and no account.

## Modes

- **Quiz** — 30 multiple-choice questions with instant explanations, streaks and keyboard shortcuts (`1-4` to answer, `Enter` to advance).
- **Flashcards** — 18 flip cards. Mark each card as known or review again; the deck reports how many you know.
- **Challenges** — 9 exercises across three formats: predict the output, fill the missing token, and click the buggy line.

Filter any mode by topic (All / JavaScript / TypeScript / SCSS). The home screen shows per-topic progress and overall accuracy.

## Stack

- React 19 + TypeScript
- Vite
- SCSS modules with a shared theme and mixins
- ESLint + Prettier

## Getting started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev        # start the dev server
npm run build      # type-check and build for production
npm run preview    # preview the production build
npm run typecheck  # run TypeScript
npm run lint       # run ESLint
npm run format     # format with Prettier
```

## Project structure

```
src/
  components/
    common/       # shared UI: badges, progress, code blocks, filters, results
    layout/       # app header
    home/         # dashboard, topic cards, mode cards
    quiz/         # quiz flow
    flashcards/   # flashcard deck
    challenges/   # challenge flow and interactive code lines
  data/           # curated JS / TS / SCSS content
  hooks/          # localStorage + progress state
  styles/         # theme variables, mixins and global styles
  types/          # content and view types
  utils/          # shuffle + progress statistics
```
