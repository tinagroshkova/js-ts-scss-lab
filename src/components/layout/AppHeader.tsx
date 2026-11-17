import type { ViewKey } from '../../types/content';
import styles from './AppHeader.module.scss';

interface AppHeaderProps {
  view: ViewKey;
  onChangeView: (view: ViewKey) => void;
}

const NAV_ITEMS: { key: ViewKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'flashcards', label: 'Flashcards' },
  { key: 'challenges', label: 'Challenges' },
];

const AppHeader = ({ view, onChangeView }: AppHeaderProps) => (
  <header className={styles.header}>
    <button type="button" className={styles.brand} onClick={() => onChangeView('home')} aria-label="Syntax Lab home">
      <span className={styles.mark}>JS</span>
      <span className={styles.brandText}>
        <span className={styles.brandName}>Syntax Lab</span>
        <span className={styles.brandTag}>JS / TS / SCSS refresher</span>
      </span>
    </button>
    <nav className={styles.nav} aria-label="Main">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`${styles.navButton} ${view === item.key ? styles.navButtonActive : ''}`}
          aria-current={view === item.key ? 'page' : undefined}
          onClick={() => onChangeView(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  </header>
);

export default AppHeader;
