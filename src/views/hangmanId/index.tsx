import { FC } from "react";
import Game from "../../components/hangman/components/gameWithId";
// import styles from '../page.module.css'
import { notify } from "../../utils/notifications";

export const HangmanSpecificView: FC = ({}) => {
  return (
    <div
      // use tailwind classes here, style the background color to white
      className="flex flex-col justify-center items-center space-y-2"
    >
      <h1
      // className={styles.title}
      >
        Welcome to Hangman!
      </h1>
      <div
      // className={styles.grid}
      >
        <Game />
      </div>
    </div>
  );
};
