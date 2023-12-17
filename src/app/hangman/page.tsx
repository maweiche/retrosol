import Game from '../../../components/hangman/components/game';
import styles from '../page.module.css'

export default function Hangman() {
    return (
      <div className={styles.container}>
          <h1 className={styles.title}>
            Welcome to Hangman!
          </h1>
          <p className={styles.description}>
            Get started by pressing play
          </p>
          <div className={styles.grid}>
            <Game />
          </div>
      </div>
    )
  }