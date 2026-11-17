import { useEffect, useState } from 'react';
import FilterPills from '../common/FilterPills';
import ProgressBar from '../common/ProgressBar';
import SessionResult from '../common/SessionResult';
import TopicBadge from '../common/TopicBadge';
import { FLASHCARDS } from '../../data/flashcards';
import { TOPIC_MAP } from '../../data/topics';
import { isFlashcardDue, type ProgressApi, type ProgressState } from '../../hooks/useProgress';
import type { Flashcard, TopicFilter } from '../../types/content';
import { shuffle } from '../../utils/shuffle';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import styles from './FlashcardsView.module.scss';

interface FlashcardsViewProps {
  progress: ProgressApi;
  onExit: () => void;
}

type DeckMode = 'due' | 'all';

interface DeckSession {
  topic: TopicFilter;
  mode: DeckMode;
  cards: Flashcard[];
  index: number;
  flipped: boolean;
  finished: boolean;
}

interface StoredDeckSession {
  topic: TopicFilter;
  mode: DeckMode;
  cardIds: string[];
  index: number;
  flipped: boolean;
  finished: boolean;
}

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asTopic = (value: unknown): TopicFilter =>
  value === 'javascript' || value === 'typescript' || value === 'scss' ? value : 'all';

const createDeck = (topic: TopicFilter, mode: DeckMode, state: ProgressState): DeckSession => {
  const topicPool = topic === 'all' ? FLASHCARDS : FLASHCARDS.filter((card) => card.topic === topic);
  const pool = mode === 'all' ? topicPool : topicPool.filter((card) => isFlashcardDue(state.flashcards[card.id]));

  return { topic, mode, cards: shuffle(pool), index: 0, flipped: false, finished: false };
};

const readStoredSession = (): StoredDeckSession | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.flashcardSession);
    return raw ? (JSON.parse(raw) as StoredDeckSession) : null;
  } catch {
    return null;
  }
};

const saveSession = (session: DeckSession): void => {
  const stored: StoredDeckSession = {
    topic: session.topic,
    mode: session.mode,
    cardIds: session.cards.map((card) => card.id),
    index: session.index,
    flipped: session.flipped,
    finished: session.finished,
  };

  try {
    window.localStorage.setItem(STORAGE_KEYS.flashcardSession, JSON.stringify(stored));
  } catch {
    // Storage can be unavailable (private mode); the session still works in memory.
  }
};

const restoreSession = (stored: StoredDeckSession): DeckSession | null => {
  if (!Array.isArray(stored.cardIds) || stored.cardIds.length === 0) return null;

  const byId = new Map(FLASHCARDS.map((card) => [card.id, card]));
  const cards = stored.cardIds
    .map((id) => byId.get(id))
    .filter((card): card is Flashcard => card !== undefined);

  if (cards.length === 0) return null;

  return {
    topic: asTopic(stored.topic),
    mode: stored.mode === 'all' ? 'all' : 'due',
    cards,
    index: Math.min(Math.max(asNumber(stored.index, 0), 0), cards.length - 1),
    flipped: stored.flipped === true,
    finished: stored.finished === true,
  };
};

const createInitialSession = (state: ProgressState): DeckSession => {
  const stored = readStoredSession();
  const restored = stored ? restoreSession(stored) : null;

  return restored ?? createDeck('all', 'due', state);
};

const FlashcardsView = ({ progress, onExit }: FlashcardsViewProps) => {
  const [session, setSession] = useState<DeckSession>(() => createInitialSession(progress.state));
  const currentCard = session.cards[session.index];

  const topicPool = session.topic === 'all' ? FLASHCARDS : FLASHCARDS.filter((card) => card.topic === session.topic);
  const dueCount = topicPool.filter((card) => isFlashcardDue(progress.state.flashcards[card.id])).length;
  const knownInDeck = session.cards.filter((card) => progress.state.flashcards[card.id]?.known).length;

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const handleFilter = (topic: TopicFilter): void => setSession(createDeck(topic, session.mode, progress.state));

  const handleMode = (mode: DeckMode): void => setSession(createDeck(session.topic, mode, progress.state));

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
    if (!currentCard) return;

    progress.setFlashcardKnown(currentCard.id, known);
    handleNext();
  };

  const handleRestart = (): void => setSession(createDeck(session.topic, session.mode, progress.state));

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
            { label: 'Due today', value: `${dueCount}` },
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
            Say the answer out loud before you flip. Cards you know come back after 1, 3, 7, 14, 30 or 60 days.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.exit} onClick={handleRestart}>
            Restart deck
          </button>
          <button type="button" className={styles.exit} onClick={onExit}>
            Back home
          </button>
        </div>
      </div>

      <FilterPills value={session.topic} onChange={handleFilter} />

      <div className={styles.modeRow} role="group" aria-label="Deck scope">
        <button
          type="button"
          className={`${styles.modeButton} ${session.mode === 'due' ? styles.modeActive : ''}`}
          aria-pressed={session.mode === 'due'}
          onClick={() => handleMode('due')}
        >
          Due today <span className={styles.modeCount}>{dueCount}</span>
        </button>
        <button
          type="button"
          className={`${styles.modeButton} ${session.mode === 'all' ? styles.modeActive : ''}`}
          aria-pressed={session.mode === 'all'}
          onClick={() => handleMode('all')}
        >
          All cards <span className={styles.modeCount}>{topicPool.length}</span>
        </button>
      </div>

      {session.cards.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.faceLabel}>All caught up</span>
          <p className={styles.emptyTitle}>No cards are due right now.</p>
          <p className={styles.emptyText}>
            Come back when the next review is due, or review the full deck to keep the material fresh.
          </p>
          <button type="button" className={styles.flipButton} onClick={() => handleMode('all')}>
            Review all cards
          </button>
        </div>
      ) : (
        <>
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
                {currentCard.example && (
                  <span className={styles.exampleWrap}>
                    <span className={styles.faceLabel}>Example</span>
                    <span className={styles.example}>{currentCard.example}</span>
                  </span>
                )}
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
        </>
      )}
    </div>
  );
};

export default FlashcardsView;
