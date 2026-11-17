import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  tone?: 'default' | 'topic';
}

const ProgressBar = ({ value, max, label, tone = 'default' }: ProgressBarProps) => {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={styles.wrapper}>
      {label && (
        <div className={styles.meta}>
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div className={styles.track} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div
          className={`${styles.fill} ${tone === 'topic' ? styles.topicFill : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
