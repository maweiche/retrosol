import styles from "./styles/GridContainer.module.css";

export default function GridContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.grid_container}>{children}</div>;
}
