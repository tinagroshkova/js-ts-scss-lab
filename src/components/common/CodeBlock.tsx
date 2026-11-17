import styles from './CodeBlock.module.scss';

interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({ code }: CodeBlockProps) => (
  <pre className={styles.code}>
    <code>{code}</code>
  </pre>
);

export default CodeBlock;
