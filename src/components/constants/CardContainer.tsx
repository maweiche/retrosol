import styles from "./styles/CardContainer.module.css";

export default function CardContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.card_container}>{children}</div>;
}
