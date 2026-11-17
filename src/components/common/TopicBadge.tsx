import { TOPIC_MAP } from '../../data/topics';
import type { TopicId } from '../../types/content';
import styles from './TopicBadge.module.scss';

interface TopicBadgeProps {
  topic: TopicId;
}

const TopicBadge = ({ topic }: TopicBadgeProps) => {
  const meta = TOPIC_MAP[topic];

  return (
    <span className={`${styles.badge} topic-${topic}`}>
      <span className={styles.dot} />
      {meta.name}
    </span>
  );
};

export default TopicBadge;
