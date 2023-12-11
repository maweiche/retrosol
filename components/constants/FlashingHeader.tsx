import styles from './styles/FlashingHeader.module.css'

export default function FlashingHeader(
    { children
    }: {
        children: React.ReactNode
    }
) {
    return (
        <div className={styles.header}>
            {children}
        </div>
    )
}