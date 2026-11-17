import { useEffect, useState } from 'react';
import CodeBlock from '../common/CodeBlock';
import FilterPills from '../common/FilterPills';
import ProgressBar from '../common/ProgressBar';
import SessionResult from '../common/SessionResult';
import TopicBadge from '../common/TopicBadge';
import { QUIZ_QUESTIONS } from '../../data/quiz';
import { TOPIC_MAP } from '../../data/topics';
import type { ProgressApi } from '../../hooks/useProgress';
import type { QuizQuestion, TopicFilter } from '../../types/content';
import { shuffle } from '../../utils/shuffle';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import styles from './QuizView.module.scss';

interface QuizViewProps {
  progress: ProgressApi;
  initialTopic: TopicFilter;
  onExit: () => void;
}

interface QuizSession {
  topic: TopicFilter;
  questions: QuizQuestion[];
  index: number;
  selected: number | null;
  correct: number;
  streak: number;
  bestStreak: number;
  finished: boolean;
}

interface StoredQuizSession {
  topic: TopicFilter;
  questionIds: string[];
  index: number;
  selected: number | null;
  correct: number;
  streak: number;
  bestStreak: number;
  finished: boolean;
}

const createSession = (topic: TopicFilter): QuizSession => {
  const pool = topic === 'all' ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter((question) => question.topic === topic);

  return {
    topic,
    questions: shuffle(pool),
    index: 0,
    selected: null,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    finished: false,
  };
};

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asTopic = (value: unknown): TopicFilter =>
  value === 'javascript' || value === 'typescript' || value === 'scss' ? value : 'all';

const readStoredSession = (): StoredQuizSession | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.quizSession);
    return raw ? (JSON.parse(raw) as StoredQuizSession) : null;
  } catch {
    return null;
  }
};

const saveSession = (session: QuizSession): void => {
  const stored: StoredQuizSession = {
    topic: session.topic,
    questionIds: session.questions.map((question) => question.id),
    index: session.index,
    selected: session.selected,
    correct: session.correct,
    streak: session.streak,
    bestStreak: session.bestStreak,
    finished: session.finished,
  };

  try {
    window.localStorage.setItem(STORAGE_KEYS.quizSession, JSON.stringify(stored));
  } catch {
    // Storage can be unavailable (private mode); the session still works in memory.
  }
};

const restoreSession = (stored: StoredQuizSession, initialTopic: TopicFilter): QuizSession | null => {
  if (!Array.isArray(stored.questionIds) || stored.questionIds.length === 0) return null;
  if (initialTopic !== 'all' && stored.topic !== initialTopic) return null;

  const byId = new Map(QUIZ_QUESTIONS.map((question) => [question.id, question]));
  const questions = stored.questionIds
    .map((id) => byId.get(id))
    .filter((question): question is QuizQuestion => question !== undefined);

  if (questions.length === 0) return null;

  const index = Math.min(Math.max(asNumber(stored.index, 0), 0), questions.length - 1);
  const current = questions[index];
  const selected =
    typeof stored.selected === 'number' && stored.selected >= 0 && stored.selected < current.options.length
      ? stored.selected
      : null;

  return {
    topic: asTopic(stored.topic),
    questions,
    index,
    selected,
    correct: Math.max(0, asNumber(stored.correct, 0)),
    streak: Math.max(0, asNumber(stored.streak, 0)),
    bestStreak: Math.max(0, asNumber(stored.bestStreak, 0)),
    finished: stored.finished === true,
  };
};

const createInitialSession = (initialTopic: TopicFilter): QuizSession => {
  const stored = readStoredSession();
  const restored = stored ? restoreSession(stored, initialTopic) : null;

  return restored ?? createSession(initialTopic);
};

const selectOption = (session: QuizSession, question: QuizQuestion, optionIndex: number): QuizSession => {
  const isCorrect = optionIndex === question.answerIndex;
  const nextStreak = isCorrect ? session.streak + 1 : 0;

  return {
    ...session,
    selected: optionIndex,
    correct: session.correct + (isCorrect ? 1 : 0),
    streak: nextStreak,
    bestStreak: Math.max(session.bestStreak, nextStreak),
  };
};

const advanceSession = (session: QuizSession): QuizSession => {
  const nextIndex = session.index + 1;

  return nextIndex >= session.questions.length
    ? { ...session, finished: true }
    : { ...session, index: nextIndex, selected: null };
};

const QuizView = ({ progress, initialTopic, onExit }: QuizViewProps) => {
  const [session, setSession] = useState<QuizSession>(() => createInitialSession(initialTopic));
  const currentQuestion = session.questions[session.index];

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const handleSelect = (optionIndex: number): void => {
    if (session.selected !== null || session.finished) return;

    progress.recordQuizAnswer(currentQuestion.id, optionIndex === currentQuestion.answerIndex);
    setSession(selectOption(session, currentQuestion, optionIndex));
  };

  const handleNext = (): void => {
    if (session.selected === null) return;

    setSession(advanceSession(session));
  };

  const handleFilter = (topic: TopicFilter): void => setSession(createSession(topic));

  const handleRestart = (): void => setSession(createSession(session.topic));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (session.finished) return;

      if (session.selected === null) {
        const optionIndex = Number(event.key) - 1;
        if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
          progress.recordQuizAnswer(currentQuestion.id, optionIndex === currentQuestion.answerIndex);
          setSession(selectOption(session, currentQuestion, optionIndex));
        }
        return;
      }

      if (event.key === 'Enter') {
        setSession(advanceSession(session));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [session, currentQuestion, progress]);

  if (session.finished) {
    const accuracy = Math.round((session.correct / session.questions.length) * 100);
    const topicLabel = session.topic === 'all' ? 'All topics' : TOPIC_MAP[session.topic].name;
    const title = accuracy >= 80 ? 'Sharp work' : accuracy >= 50 ? 'Solid pass' : 'Good warm-up';
    const message =
      accuracy >= 80
        ? 'You clearly know your way around the language. Keep the streak going with a harder mix.'
        : accuracy >= 50
          ? 'A few details to revisit, but the fundamentals are there. Read the explanations and go again.'
          : 'Every miss is a note to self. Review the explanations, then run the quiz again.';

    return (
      <div className={styles.view}>
        <SessionResult
          eyebrow="Quiz complete"
          title={title}
          message={message}
          stats={[
            { label: 'Correct', value: `${session.correct}/${session.questions.length}` },
            { label: 'Accuracy', value: `${accuracy}%` },
            { label: 'Best streak', value: `${session.bestStreak}` },
            { label: 'Topic', value: topicLabel },
          ]}
          onRestart={handleRestart}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Quiz</p>
          <h1 className={styles.title}>Test your instincts</h1>
          <p className={styles.subtitle}>
            Pick an answer, read the explanation, keep the streak alive. Keys 1-4 answer, Enter advances.
          </p>
        </div>
        <button type="button" className={styles.exit} onClick={onExit}>
          Back home
        </button>
      </div>

      <FilterPills value={session.topic} onChange={handleFilter} />

      <div className={styles.progressRow}>
        <span>
          Question {session.index + 1} of {session.questions.length}
        </span>
        <span className={styles.streak}>Streak {session.streak}</span>
      </div>
      <ProgressBar
        value={session.selected !== null ? session.index + 1 : session.index}
        max={session.questions.length}
      />

      <article className={styles.questionCard}>
        <div className={styles.questionMeta}>
          <TopicBadge topic={currentQuestion.topic} />
          <span className={styles.difficulty}>{currentQuestion.difficulty}</span>
        </div>
        <h2 className={styles.prompt}>{currentQuestion.prompt}</h2>
        {currentQuestion.code && <CodeBlock code={currentQuestion.code} />}
        <div className={styles.options}>
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = session.selected === optionIndex;
            const isCorrectOption = optionIndex === currentQuestion.answerIndex;
            const showCorrect = session.selected !== null && isCorrectOption;
            const showWrong = session.selected !== null && isSelected && !isCorrectOption;

            return (
              <button
                key={`${currentQuestion.id}-${optionIndex}`}
                type="button"
                className={`${styles.option} ${showCorrect ? styles.correct : ''} ${showWrong ? styles.wrong : ''}`}
                onClick={() => handleSelect(optionIndex)}
                disabled={session.selected !== null}
              >
                <span className={styles.optionKey}>{String.fromCharCode(65 + optionIndex)}</span>
                <span className={styles.optionText}>{option}</span>
              </button>
            );
          })}
        </div>
        {session.selected !== null && (
          <div className={styles.feedback}>
            <p className={styles.feedbackTitle}>
              {session.selected === currentQuestion.answerIndex ? 'Correct' : 'Not quite'}
            </p>
            <p className={styles.feedbackText}>{currentQuestion.explanation}</p>
            <button type="button" className={styles.next} onClick={handleNext}>
              {session.index + 1 >= session.questions.length ? 'See results' : 'Next question'}
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default QuizView;
