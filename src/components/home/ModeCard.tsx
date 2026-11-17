import type { CSSProperties } from 'react';
import styles from './ModeCard.module.scss';

interface ModeCardProps {
  title: string;
  description: string;
  action: string;
  accent: string;
  onClick: () => void;
}

const ModeCard = ({ title, description, action, accent, onClick }: ModeCardProps) => (
  <article className={styles.card} style={{ '--accent': accent } as CSSProperties}>
    <h3 className={styles.title}>{title}</h3>
    <p className={styles.description}>{description}</p>
    <button type="button" className={styles.action} onClick={onClick}>
      {action}
    </button>
  </article>
);

export default ModeCard;
