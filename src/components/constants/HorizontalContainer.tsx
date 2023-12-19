import styles from "./styles/HorizontalContainer.module.css";

export default function HorizontalContainer(
    { children
    }: {
        children: React.ReactNode
    }
) {
    return (
        <div className={styles.horizontal_container}>
            {children}
        </div>
    )
}