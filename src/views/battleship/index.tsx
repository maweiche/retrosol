import { FC } from "react";
import Game from "../../components/battleship/components/game";
// import styles from '../page.module.css'
import { notify } from "../../utils/notifications";

export const BattleshipView: FC = ({}) => {
  return (
    <div
      // use tailwind classes here, style the background color to white
      className="flex flex-col justify-center items-center space-y-2"
    >
      <h1
      // className={styles.title}
      >
        Welcome to Battleship!
      </h1>
      <div
      // className={styles.grid}
      >
        <Game />
      </div>
    </div>
  );
};
