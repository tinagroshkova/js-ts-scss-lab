import { TOPICS } from '../../data/topics';
import { getOverallStats, getTopicProgress } from '../../utils/progressStats';
import type { ProgressState } from '../../hooks/useProgress';
import type { TopicId, ViewKey } from '../../types/content';
import TopicCard from './TopicCard';
import ModeCard from './ModeCard';
import styles from './HomeView.module.scss';

interface HomeViewProps {
  progress: ProgressState;
  onNavigate: (view: ViewKey) => void;
  onPractiseTopic: (topic: TopicId) => void;
  onReset: () => void;
}

const HomeView = ({ progress, onNavigate, onPractiseTopic, onReset }: HomeViewProps) => {
  const overall = getOverallStats(progress);

  return (
    <div className={styles.view}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Interactive refresher</p>
        <h1 className={styles.heading}>Learn the details that make you faster.</h1>
        <p className={styles.lead}>
          Quiz yourself on JavaScript, TypeScript and SCSS, flip through flashcards, then solve small challenges.
          Progress is saved locally, so you can come back any time.
        </p>
        <div className={styles.heroActions}>
          <button type="button" className={styles.primary} onClick={() => onNavigate('quiz')}>
            Start the quiz
          </button>
          <button type="button" className={styles.secondary} onClick={() => onNavigate('flashcards')}>
            Review flashcards
          </button>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <strong>{overall.quizTotal}</strong>
            <span>quiz questions</span>
          </div>
          <div className={styles.heroStat}>
            <strong>{overall.cardsTotal}</strong>
            <span>flashcards</span>
          </div>
          <div className={styles.heroStat}>
            <strong>{overall.challengesTotal}</strong>
            <span>challenges</span>
          </div>
          <div className={styles.heroStat}>
            <strong>{overall.quizAccuracy}%</strong>
            <span>quiz accuracy</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Choose a track</h2>
          <button type="button" className={styles.reset} onClick={onReset}>
            Reset progress
          </button>
        </div>
        <div className={styles.topicGrid}>
          {TOPICS.map((topic) => {
            const stats = getTopicProgress(topic.id, progress);

            return (
              <TopicCard key={topic.id} topic={topic} stats={stats} onPractise={() => onPractiseTopic(topic.id)} />
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Ways to practise</h2>
        <div className={styles.modeGrid}>
          <ModeCard
            title="Quiz"
            description="Multiple choice with instant explanations and streaks."
            action="Start quiz"
            accent="var(--ts)"
            onClick={() => onNavigate('quiz')}
          />
          <ModeCard
            title="Flashcards"
            description="Flip, review and mark the cards you already know."
            action="Open deck"
            accent="var(--js)"
            onClick={() => onNavigate('flashcards')}
          />
          <ModeCard
            title="Challenges"
            description="Predict output, fill blanks and hunt down bugs."
            action="Try one"
            accent="var(--scss)"
            onClick={() => onNavigate('challenges')}
          />
        </div>
      </section>
    </div>
  );
};

export default HomeView;
