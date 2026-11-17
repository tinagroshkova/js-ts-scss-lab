import { useState } from 'react';
import FilterPills from '../common/FilterPills';
import ProgressBar from '../common/ProgressBar';
import SessionResult from '../common/SessionResult';
import TopicBadge from '../common/TopicBadge';
import { FLASHCARDS } from '../../data/flashcards';
import { TOPIC_MAP } from '../../data/topics';
import type { ProgressApi } from '../../hooks/useProgress';
import type { Flashcard, TopicFilter } from '../../types/content';
import { shuffle } from '../../utils/shuffle';
import styles from './FlashcardsView.module.scss';

interface FlashcardsViewProps {
  progress: ProgressApi;
  onExit: () => void;
}

interface DeckSession {
  topic: TopicFilter;
  cards: Flashcard[];
  index: number;
  flipped: boolean;
  finished: boolean;
}

const createDeck = (topic: TopicFilter): DeckSession => {
  const pool = topic === 'all' ? FLASHCARDS : FLASHCARDS.filter((card) => card.topic === topic);

  return { topic, cards: shuffle(pool), index: 0, flipped: false, finished: false };
};

const FlashcardsView = ({ progress, onExit }: FlashcardsViewProps) => {
  const [session, setSession] = useState<DeckSession>(() => createDeck('all'));
  const currentCard = session.cards[session.index];
  const knownInDeck = session.cards.filter((card) => progress.state.flashcards[card.id]).length;

  const handleFilter = (topic: TopicFilter): void => setSession(createDeck(topic));

  const handleFlip = (): void => setSession({ ...session, flipped: !session.flipped });

  const handlePrev = (): void => {
    if (session.index === 0) return;
    setSession({ ...session, index: session.index - 1, flipped: false });
  };

  const handleNext = (): void => {
    const nextIndex = session.index + 1;
    if (nextIndex >= session.cards.length) {
      setSession({ ...session, finished: true });
      return;
    }

    setSession({ ...session, index: nextIndex, flipped: false });
  };

  const handleMark = (known: boolean): void => {
    progress.setFlashcardKnown(currentCard.id, known);
    handleNext();
  };

  const handleRestart = (): void => setSession(createDeck(session.topic));

  if (session.finished) {
    const topicLabel = session.topic === 'all' ? 'All topics' : TOPIC_MAP[session.topic].name;

    return (
      <div className={styles.view}>
        <SessionResult
          eyebrow="Deck complete"
          title="Cards reviewed"
          message="Anything you marked for review stays in the deck next time. Run it again whenever you want a quick refresh."
          stats={[
            { label: 'Known', value: `${knownInDeck}/${session.cards.length}` },
            { label: 'To review', value: `${session.cards.length - knownInDeck}` },
            { label: 'Topic', value: topicLabel },
          ]}
          onRestart={handleRestart}
          onExit={onExit}
          restartLabel="Review deck"
        />
      </div>
    );
  }

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Flashcards</p>
          <h1 className={styles.title}>Flip, recall, repeat</h1>
          <p className={styles.subtitle}>
            Say the answer out loud before you flip. Mark what you know to track progress.
          </p>
        </div>
        <button type="button" className={styles.exit} onClick={onExit}>
          Back home
        </button>
      </div>

      <FilterPills value={session.topic} onChange={handleFilter} />

      <div className={styles.progressRow}>
        <span>
          Card {session.index + 1} of {session.cards.length}
        </span>
        <span>
          Known {knownInDeck}/{session.cards.length}
        </span>
      </div>
      <ProgressBar value={session.index} max={session.cards.length} />

      <button
        type="button"
        className={`${styles.card} ${session.flipped ? styles.flipped : ''}`}
        onClick={handleFlip}
        aria-pressed={session.flipped}
      >
        <span className={styles.cardInner}>
          <span className={`${styles.face} ${styles.front}`}>
            <TopicBadge topic={currentCard.topic} />
            <span className={styles.faceLabel}>Prompt</span>
            <span className={styles.faceText}>{currentCard.front}</span>
            <span className={styles.hint}>Click to flip</span>
          </span>
          <span className={`${styles.face} ${styles.back}`}>
            <TopicBadge topic={currentCard.topic} />
            <span className={styles.faceLabel}>Answer</span>
            <span className={styles.faceText}>{currentCard.back}</span>
            <span className={styles.hint}>Click to flip back</span>
          </span>
        </span>
      </button>

      <div className={styles.controls}>
        <button type="button" className={styles.ghost} onClick={handlePrev} disabled={session.index === 0}>
          Previous
        </button>
        <button type="button" className={styles.flipButton} onClick={handleFlip}>
          Flip card
        </button>
        <button type="button" className={styles.ghost} onClick={handleNext}>
          Next
        </button>
      </div>

      <div className={styles.markRow}>
        <button type="button" className={styles.review} onClick={() => handleMark(false)}>
          Review again
        </button>
        <button type="button" className={styles.known} onClick={() => handleMark(true)}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default FlashcardsView;
