import styles from './styles/FullWidthCard.module.css'

export default function FullWidthCard(
    {
        children
    }: {
        children: React.ReactNode
    }
) {
    return (
        <div className={styles.full_width_card}>
            {children}
        </div>
    );
}