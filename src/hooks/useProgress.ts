import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface QuizResult {
  attempts: number;
  correct: number;
}

export interface FlashcardProgress {
  known: boolean;
  intervalDays: number;
  lastReviewed: number;
  dueAt: number;
}

export interface ProgressState {
  quiz: Record<string, QuizResult>;
  flashcards: Record<string, FlashcardProgress>;
  challenges: Record<string, boolean>;
}

export interface ProgressApi {
  state: ProgressState;
  recordQuizAnswer: (questionId: string, correct: boolean) => void;
  setFlashcardKnown: (cardId: string, known: boolean) => void;
  markChallengeSolved: (challengeId: string) => void;
  resetProgress: () => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60];

const EMPTY_STATE: ProgressState = {
  quiz: {},
  flashcards: {},
  challenges: {},
};

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const migrateProgress = (raw: unknown): ProgressState => {
  if (!raw || typeof raw !== 'object') return EMPTY_STATE;

  const value = raw as { quiz?: unknown; flashcards?: unknown; challenges?: unknown };
  const flashcards: Record<string, FlashcardProgress> = {};

  if (value.flashcards && typeof value.flashcards === 'object') {
    for (const [id, entry] of Object.entries(value.flashcards as Record<string, unknown>)) {
      if (typeof entry === 'boolean') {
        flashcards[id] = { known: entry, intervalDays: 0, lastReviewed: 0, dueAt: 0 };
        continue;
      }

      if (entry && typeof entry === 'object') {
        const candidate = entry as Partial<FlashcardProgress>;
        flashcards[id] = {
          known: candidate.known === true,
          intervalDays: Math.max(0, asNumber(candidate.intervalDays, 0)),
          lastReviewed: Math.max(0, asNumber(candidate.lastReviewed, 0)),
          dueAt: Math.max(0, asNumber(candidate.dueAt, 0)),
        };
      }
    }
  }

  return {
    quiz: value.quiz && typeof value.quiz === 'object' ? (value.quiz as Record<string, QuizResult>) : {},
    flashcards,
    challenges:
      value.challenges && typeof value.challenges === 'object'
        ? (value.challenges as Record<string, boolean>)
        : {},
  };
};

export const isFlashcardDue = (entry: FlashcardProgress | undefined, now = Date.now()): boolean =>
  !entry || !entry.known || entry.dueAt <= now;

const scheduleFlashcard = (current: FlashcardProgress | undefined, known: boolean): FlashcardProgress => {
  const now = Date.now();

  if (!known) {
    return { known: false, intervalDays: 0, lastReviewed: now, dueAt: now };
  }

  const previousInterval = current?.intervalDays ?? 0;
  const intervalDays =
    REVIEW_INTERVALS.find((days) => days > previousInterval) ?? REVIEW_INTERVALS[REVIEW_INTERVALS.length - 1];

  return { known: true, intervalDays, lastReviewed: now, dueAt: now + intervalDays * DAY_MS };
};

export const useProgress = (): ProgressApi => {
  const [state, setState] = useLocalStorage<ProgressState>(STORAGE_KEYS.progress, EMPTY_STATE, migrateProgress);

  const recordQuizAnswer = (questionId: string, correct: boolean): void => {
    setState((current) => {
      const previous = current.quiz[questionId] ?? { attempts: 0, correct: 0 };
      return {
        ...current,
        quiz: {
          ...current.quiz,
          [questionId]: {
            attempts: previous.attempts + 1,
            correct: previous.correct + (correct ? 1 : 0),
          },
        },
      };
    });
  };

  const setFlashcardKnown = (cardId: string, known: boolean): void => {
    setState((current) => ({
      ...current,
      flashcards: {
        ...current.flashcards,
        [cardId]: scheduleFlashcard(current.flashcards[cardId], known),
      },
    }));
  };

  const markChallengeSolved = (challengeId: string): void => {
    setState((current) => ({
      ...current,
      challenges: { ...current.challenges, [challengeId]: true },
    }));
  };

  const resetProgress = (): void => {
    setState(EMPTY_STATE);
  };

  return { state, recordQuizAnswer, setFlashcardKnown, markChallengeSolved, resetProgress };
};
