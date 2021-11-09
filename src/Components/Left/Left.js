import classes from "./Left.module.css";
import Tilt from "react-parallax-tilt";

export default function Left() {
  return (
    <div className="absolute bottom-2 left-4 w-36 h-1/4 flex-col justify-between z-30 hidden md:flex">
      <Tilt>
        <div className={classes.btn}>Link</div>
      </Tilt>
      <Tilt>
        <div className={classes.btn}>Link</div>
      </Tilt>
      <Tilt>
        <div className={classes.btn}>Link</div>
      </Tilt>
      <Tilt>
        <div className={classes.btn}>Link</div>
      </Tilt>
    </div>
  );
}
