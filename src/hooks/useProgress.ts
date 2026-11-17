import { useLocalStorage } from './useLocalStorage';

export interface QuizResult {
  attempts: number;
  correct: number;
}

export interface ProgressState {
  quiz: Record<string, QuizResult>;
  flashcards: Record<string, boolean>;
  challenges: Record<string, boolean>;
}

export interface ProgressApi {
  state: ProgressState;
  recordQuizAnswer: (questionId: string, correct: boolean) => void;
  setFlashcardKnown: (cardId: string, known: boolean) => void;
  markChallengeSolved: (challengeId: string) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'syntax-lab-progress-v1';

const EMPTY_STATE: ProgressState = {
  quiz: {},
  flashcards: {},
  challenges: {},
};

export const useProgress = (): ProgressApi => {
  const [state, setState] = useLocalStorage<ProgressState>(STORAGE_KEY, EMPTY_STATE);

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
      flashcards: { ...current.flashcards, [cardId]: known },
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
