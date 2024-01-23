import styles from "./styles/CardContent.module.css";

export default function CardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.card_content}>{children}</div>;
}
