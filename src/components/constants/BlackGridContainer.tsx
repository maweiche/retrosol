import styles from "./styles/BlackGridContainer.module.css";

export default function GridContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.black_grid_container}>{children}</div>;
}
