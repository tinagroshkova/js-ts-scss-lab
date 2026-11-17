import type { Topic } from '../../types/content';
import type { TopicProgress } from '../../utils/progressStats';
import ProgressBar from '../common/ProgressBar';
import styles from './TopicCard.module.scss';

interface TopicCardProps {
  topic: Topic;
  stats: TopicProgress;
  onPractise: () => void;
}

const TopicCard = ({ topic, stats, onPractise }: TopicCardProps) => (
  <article className={`${styles.card} topic-${topic.id}`}>
    <div className={styles.top}>
      <span className={styles.mark}>{topic.shortName}</span>
      <div>
        <h3 className={styles.name}>{topic.name}</h3>
        <p className={styles.tagline}>{topic.tagline}</p>
      </div>
    </div>
    <p className={styles.description}>{topic.description}</p>
    <ProgressBar
      value={stats.quizAnswered}
      max={stats.quizTotal}
      label={`Quiz ${stats.quizAnswered}/${stats.quizTotal}`}
      tone="topic"
    />
    <div className={styles.metaRow}>
      <span>
        {stats.cardsKnown}/{stats.cardsTotal} cards known
      </span>
      <span>
        {stats.challengesSolved}/{stats.challengesTotal} challenges solved
      </span>
    </div>
    <button type="button" className={styles.action} onClick={onPractise}>
      Practise {topic.name}
    </button>
  </article>
);

export default TopicCard;
