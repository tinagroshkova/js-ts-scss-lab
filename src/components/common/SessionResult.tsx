import styles from './SessionResult.module.scss';

interface SessionResultStat {
  label: string;
  value: string;
}

interface SessionResultProps {
  eyebrow: string;
  title: string;
  message: string;
  stats: SessionResultStat[];
  onRestart: () => void;
  onExit: () => void;
  restartLabel?: string;
  exitLabel?: string;
}

const SessionResult = ({
  eyebrow,
  title,
  message,
  stats,
  onRestart,
  onExit,
  restartLabel = 'Try again',
  exitLabel = 'Back home',
}: SessionResultProps) => (
  <div className={styles.result}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.message}>{message}</p>
    <dl className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
    <div className={styles.actions}>
      <button type="button" className={styles.primary} onClick={onRestart}>
        {restartLabel}
      </button>
      <button type="button" className={styles.secondary} onClick={onExit}>
        {exitLabel}
      </button>
    </div>
  </div>
);

export default SessionResult;
