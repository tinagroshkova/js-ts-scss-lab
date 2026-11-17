import { useState } from 'react';
import AppHeader from './components/layout/AppHeader';
import HomeView from './components/home/HomeView';
import QuizView from './components/quiz/QuizView';
import FlashcardsView from './components/flashcards/FlashcardsView';
import ChallengesView from './components/challenges/ChallengesView';
import { useProgress } from './hooks/useProgress';
import type { TopicFilter, TopicId, ViewKey } from './types/content';
import styles from './App.module.scss';

const App = () => {
  const [view, setView] = useState<ViewKey>('home');
  const [quizTopic, setQuizTopic] = useState<TopicFilter>('all');
  const progress = useProgress();

  const handleNavigate = (nextView: ViewKey): void => {
    if (nextView === 'quiz') {
      setQuizTopic('all');
    }
    setView(nextView);
  };

  const handlePractiseTopic = (topic: TopicId): void => {
    setQuizTopic(topic);
    setView('quiz');
  };

  const handleExit = (): void => setView('home');

  return (
    <div className={styles.app}>
      <AppHeader view={view} onChangeView={handleNavigate} />
      <main className={styles.main}>
        {view === 'home' && (
          <HomeView
            progress={progress.state}
            onNavigate={handleNavigate}
            onPractiseTopic={handlePractiseTopic}
            onReset={progress.resetProgress}
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
