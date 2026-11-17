import { useState } from 'react';
import CodeBlock from '../common/CodeBlock';
import FilterPills from '../common/FilterPills';
import ProgressBar from '../common/ProgressBar';
import SessionResult from '../common/SessionResult';
import TopicBadge from '../common/TopicBadge';
import FindBugCode from './FindBugCode';
import { CHALLENGES } from '../../data/challenges';
import { TOPIC_MAP } from '../../data/topics';
import type { ProgressApi } from '../../hooks/useProgress';
import type { Challenge, TopicFilter } from '../../types/content';
import styles from './ChallengesView.module.scss';

interface ChallengesViewProps {
  progress: ProgressApi;
  onExit: () => void;
}

interface ChallengeSession {
  topic: TopicFilter;
  challenges: Challenge[];
  index: number;
  selected: number | null;
  solved: number;
  finished: boolean;
}

const TYPE_LABELS: Record<Challenge['type'], string> = {
  predict: 'Predict output',
  fill: 'Fill the blank',
  'find-bug': 'Find the bug',
};

const createChallengeSession = (topic: TopicFilter): ChallengeSession => {
  const pool = topic === 'all' ? CHALLENGES : CHALLENGES.filter((challenge) => challenge.topic === topic);

  return { topic, challenges: pool, index: 0, selected: null, solved: 0, finished: false };
};

const ChallengesView = ({ progress, onExit }: ChallengesViewProps) => {
  const [session, setSession] = useState<ChallengeSession>(() => createChallengeSession('all'));
  const currentChallenge = session.challenges[session.index];

  const handleFilter = (topic: TopicFilter): void => setSession(createChallengeSession(topic));

  const handleAnswer = (answerIndex: number): void => {
    if (session.selected !== null) return;

    const isCorrect =
      currentChallenge.type === 'find-bug'
        ? answerIndex === currentChallenge.buggyLine
        : answerIndex === currentChallenge.answerIndex;

    if (isCorrect) {
      progress.markChallengeSolved(currentChallenge.id);
    }

    setSession({
      ...session,
      selected: answerIndex,
      solved: session.solved + (isCorrect ? 1 : 0),
    });
  };

  const handleNext = (): void => {
    if (session.selected === null) return;

    const nextIndex = session.index + 1;
    if (nextIndex >= session.challenges.length) {
      setSession({ ...session, finished: true });
      return;
    }

    setSession({ ...session, index: nextIndex, selected: null });
  };

  const handleRestart = (): void => setSession(createChallengeSession(session.topic));

  if (session.finished) {
    const topicLabel = session.topic === 'all' ? 'All topics' : TOPIC_MAP[session.topic].name;

    return (
      <div className={styles.view}>
        <SessionResult
          eyebrow="Challenges complete"
          title={session.solved === session.challenges.length ? 'Flawless run' : 'Run complete'}
          message="Challenges are about noticing details. Replay them until the patterns feel obvious."
          stats={[
            { label: 'Solved', value: `${session.solved}/${session.challenges.length}` },
            { label: 'Missed', value: `${session.challenges.length - session.solved}` },
            { label: 'Topic', value: topicLabel },
          ]}
          onRestart={handleRestart}
          onExit={onExit}
          restartLabel="Replay challenges"
        />
      </div>
    );
  }

  const isCorrect =
    session.selected !== null &&
    (currentChallenge.type === 'find-bug'
      ? session.selected === currentChallenge.buggyLine
      : session.selected === currentChallenge.answerIndex);

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Challenges</p>
          <h1 className={styles.title}>Spot the detail</h1>
          <p className={styles.subtitle}>
            Predict output, fill the missing token, or click the line that breaks. Every challenge has a short
            explanation.
          </p>
        </div>
        <button type="button" className={styles.exit} onClick={onExit}>
          Back home
        </button>
      </div>

      <FilterPills value={session.topic} onChange={handleFilter} />

      <div className={styles.progressRow}>
        <span>
          Challenge {session.index + 1} of {session.challenges.length}
        </span>
        <span>Solved {session.solved}</span>
      </div>
      <ProgressBar
        value={session.selected !== null ? session.index + 1 : session.index}
        max={session.challenges.length}
      />

      <article className={styles.card}>
        <div className={styles.meta}>
          <span className={styles.type}>{TYPE_LABELS[currentChallenge.type]}</span>
          <TopicBadge topic={currentChallenge.topic} />
        </div>
        <h2 className={styles.cardTitle}>{currentChallenge.title}</h2>
        <p className={styles.prompt}>{currentChallenge.prompt}</p>

        {currentChallenge.type === 'find-bug' ? (
          <FindBugCode
            code={currentChallenge.code}
            selectedLine={session.selected}
            buggyLine={currentChallenge.buggyLine}
            revealed={session.selected !== null}
            onSelect={handleAnswer}
          />
        ) : (
          <>
            <CodeBlock code={currentChallenge.code} />
            <div className={styles.options}>
              {currentChallenge.options.map((option, optionIndex) => {
                const isSelected = session.selected === optionIndex;
                const showCorrect = session.selected !== null && optionIndex === currentChallenge.answerIndex;
                const showWrong =
                  session.selected !== null && isSelected && optionIndex !== currentChallenge.answerIndex;

                return (
                  <button
                    key={`${currentChallenge.id}-${optionIndex}`}
                    type="button"
                    className={`${styles.option} ${showCorrect ? styles.correct : ''} ${showWrong ? styles.wrong : ''}`}
                    onClick={() => handleAnswer(optionIndex)}
                    disabled={session.selected !== null}
                  >
                    <span className={styles.optionKey}>{String.fromCharCode(65 + optionIndex)}</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {session.selected !== null && (
          <div className={styles.feedback}>
            <p className={styles.feedbackTitle}>{isCorrect ? 'Correct' : 'Not quite'}</p>
            <p className={styles.feedbackText}>{currentChallenge.explanation}</p>
            <button type="button" className={styles.next} onClick={handleNext}>
              {session.index + 1 >= session.challenges.length ? 'See results' : 'Next challenge'}
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default ChallengesView;
