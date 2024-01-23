import styles from "./styles/VerticalImageCard.module.css";

export default function VerticalImageCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.vertical_image_card}>
      <div className={styles.overlay}></div>
      {children}
    </div>
  );
}
