import styles from './FindBugCode.module.scss';

interface FindBugCodeProps {
  code: string;
  selectedLine: number | null;
  buggyLine: number;
  revealed: boolean;
  onSelect: (lineIndex: number) => void;
}

const FindBugCode = ({ code, selectedLine, buggyLine, revealed, onSelect }: FindBugCodeProps) => {
  const lines = code.split('\n');

  return (
    <div className={styles.code} role="group" aria-label="Code lines">
      {lines.map((line, lineIndex) => {
        const isSelected = selectedLine === lineIndex;
        const isBuggy = buggyLine === lineIndex;
        const stateClass = revealed
          ? isBuggy
            ? styles.correct
            : isSelected
              ? styles.wrong
              : ''
          : isSelected
            ? styles.selected
            : '';

        return (
          <button
            key={`${lineIndex}-${line}`}
            type="button"
            className={`${styles.line} ${stateClass}`}
            onClick={() => onSelect(lineIndex)}
            disabled={revealed}
          >
            <span className={styles.lineNumber}>{lineIndex + 1}</span>
            <span className={styles.lineCode}>{line || ' '}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FindBugCode;
