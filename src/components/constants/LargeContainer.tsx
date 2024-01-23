import styles from "./styles/LargeContainer.module.css";

export default function LargeContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.large_container}>{children}</div>;
}
