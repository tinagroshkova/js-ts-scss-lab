import { useEffect, useState } from 'react';
import AppHeader from './components/layout/AppHeader';
import HomeView from './components/home/HomeView';
import QuizView from './components/quiz/QuizView';
import FlashcardsView from './components/flashcards/FlashcardsView';
import ChallengesView from './components/challenges/ChallengesView';
import { useProgress } from './hooks/useProgress';
import type { TopicFilter, TopicId, ViewKey } from './types/content';
import { STORAGE_KEYS } from './utils/storageKeys';
import styles from './App.module.scss';

const readInitialView = (): ViewKey => {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEYS.view);
    if (stored === 'quiz' || stored === 'flashcards' || stored === 'challenges') return stored;
  } catch {
    // Session storage can be unavailable; fall back to the home screen.
  }

  return 'home';
};

const clearSession = (view: ViewKey): void => {
  try {
    if (view === 'quiz') window.localStorage.removeItem(STORAGE_KEYS.quizSession);
    if (view === 'flashcards') window.localStorage.removeItem(STORAGE_KEYS.flashcardSession);
  } catch {
    // Ignore storage failures.
  }
};

const App = () => {
  const [view, setView] = useState<ViewKey>(readInitialView);
  const [quizTopic, setQuizTopic] = useState<TopicFilter>('all');
  const progress = useProgress();

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEYS.view, view);
    } catch {
      // Ignore storage failures.
    }
  }, [view]);

  const handleNavigate = (nextView: ViewKey): void => {
    if (nextView !== view) clearSession(view);
    if (nextView === 'quiz') {
      setQuizTopic('all');
    }
    setView(nextView);
  };

  const handlePractiseTopic = (topic: TopicId): void => {
    clearSession('quiz');
    setQuizTopic(topic);
    setView('quiz');
  };

  const handleExit = (): void => {
    clearSession(view);
    setView('home');
  };

  const handleReset = (): void => {
    progress.resetProgress();
    clearSession('quiz');
    clearSession('flashcards');
  };

  return (
    <div className={styles.app}>
      <AppHeader view={view} onChangeView={handleNavigate} />
      <main className={styles.main}>
        {view === 'home' && (
          <HomeView
            progress={progress.state}
            onNavigate={handleNavigate}
            onPractiseTopic={handlePractiseTopic}
            onReset={handleReset}
          />
        )}
        {view === 'quiz' && <QuizView progress={progress} initialTopic={quizTopic} onExit={handleExit} />}
        {view === 'flashcards' && <FlashcardsView progress={progress} onExit={handleExit} />}
        {view === 'challenges' && <ChallengesView progress={progress} onExit={handleExit} />}
      </main>
      <footer className={styles.footer}>
        <span>Syntax Lab — quick, repeatable practice for JS, TS and SCSS. Progress stays in your browser.</span>
      </footer>
    </div>
  );
};

export default App;
