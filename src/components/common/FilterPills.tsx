import type { TopicFilter } from '../../types/content';
import styles from './FilterPills.module.scss';

interface FilterPillsProps {
  value: TopicFilter;
  onChange: (value: TopicFilter) => void;
}

const FILTERS: { value: TopicFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'scss', label: 'SCSS' },
];

const FilterPills = ({ value, onChange }: FilterPillsProps) => (
  <div className={styles.filters} role="group" aria-label="Filter by topic">
    {FILTERS.map((filter) => {
      const isActive = filter.value === value;
      const topicClass = filter.value === 'all' ? '' : `topic-${filter.value}`;

      return (
        <button
          key={filter.value}
          type="button"
          className={`${styles.pill} ${topicClass} ${isActive ? styles.active : ''}`}
          aria-pressed={isActive}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      );
    })}
  </div>
);

export default FilterPills;
