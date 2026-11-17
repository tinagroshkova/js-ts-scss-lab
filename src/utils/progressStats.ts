import { CHALLENGES } from '../data/challenges';
import { FLASHCARDS } from '../data/flashcards';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { isFlashcardDue, type ProgressState } from '../hooks/useProgress';
import type { TopicId } from '../types/content';

export interface TopicProgress {
  quizAnswered: number;
  quizCorrect: number;
  quizTotal: number;
  cardsKnown: number;
  cardsDue: number;
  cardsTotal: number;
  challengesSolved: number;
  challengesTotal: number;
}

export interface OverallStats {
  quizAnswered: number;
  quizTotal: number;
  quizAccuracy: number;
  cardsKnown: number;
  cardsDue: number;
  cardsTotal: number;
  challengesSolved: number;
  challengesTotal: number;
}

export const getTopicProgress = (topic: TopicId, state: ProgressState): TopicProgress => {
  const quiz = QUIZ_QUESTIONS.filter((question) => question.topic === topic);
  const cards = FLASHCARDS.filter((card) => card.topic === topic);
  const challenges = CHALLENGES.filter((challenge) => challenge.topic === topic);
  const now = Date.now();

  return {
    quizAnswered: quiz.filter((question) => state.quiz[question.id]).length,
    quizCorrect: quiz.reduce((total, question) => total + (state.quiz[question.id]?.correct ?? 0), 0),
    quizTotal: quiz.length,
    cardsKnown: cards.filter((card) => state.flashcards[card.id]?.known).length,
    cardsDue: cards.filter((card) => isFlashcardDue(state.flashcards[card.id], now)).length,
    cardsTotal: cards.length,
    challengesSolved: challenges.filter((challenge) => state.challenges[challenge.id]).length,
    challengesTotal: challenges.length,
  };
};

export const getOverallStats = (state: ProgressState): OverallStats => {
  const attempts = Object.values(state.quiz).reduce((total, result) => total + result.attempts, 0);
  const correct = Object.values(state.quiz).reduce((total, result) => total + result.correct, 0);
  const now = Date.now();

  return {
    quizAnswered: Object.keys(state.quiz).length,
    quizTotal: QUIZ_QUESTIONS.length,
    quizAccuracy: attempts === 0 ? 0 : Math.round((correct / attempts) * 100),
    cardsKnown: Object.values(state.flashcards).filter((card) => card.known).length,
    cardsDue: FLASHCARDS.filter((card) => isFlashcardDue(state.flashcards[card.id], now)).length,
    cardsTotal: FLASHCARDS.length,
    challengesSolved: Object.values(state.challenges).filter(Boolean).length,
    challengesTotal: CHALLENGES.length,
  };
};
