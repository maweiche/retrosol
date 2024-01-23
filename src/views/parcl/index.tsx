import { FC } from "react";
import Parcl from "../../components/parcl/components/parcl";
// import styles from '../page.module.css'
import { notify } from "../../utils/notifications";

export const ParclView: FC = ({}) => {
  return (
    <div
      // use tailwind classes here, style the background color to white
      className="flex flex-col justify-center items-center space-y-2"
    >
      <h1
      // className={styles.title}
      >
        Welcome to Parcl Data by Matt!
      </h1>
      <div
      // className={styles.grid}
      >
        <Parcl />
      </div>
    </div>
  );
};
