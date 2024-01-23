import styles from "./styles/HorizontalImageCard.module.css";

export default function HorizontalImageCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.horizontal_image_card}>
      <div className={styles.overlay}></div>
      {children}
    </div>
  );
}
