export type TopicId = 'javascript' | 'typescript' | 'scss';

export type ViewKey = 'home' | 'quiz' | 'flashcards' | 'challenges';

export type TopicFilter = 'all' | TopicId;

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
  id: TopicId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  accent: string;
}

export interface QuizQuestion {
  id: string;
  topic: TopicId;
  difficulty: Difficulty;
  prompt: string;
  code?: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  topic: TopicId;
  front: string;
  back: string;
}

interface ChallengeBase {
  id: string;
  topic: TopicId;
  title: string;
  prompt: string;
  code: string;
  explanation: string;
}

export interface ChoiceChallenge extends ChallengeBase {
  type: 'predict' | 'fill';
  options: string[];
  answerIndex: number;
}

export interface FindBugChallenge extends ChallengeBase {
  type: 'find-bug';
  buggyLine: number;
}

export type Challenge = ChoiceChallenge | FindBugChallenge;
