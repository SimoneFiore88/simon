import classes from "./Topbar.module.css";
import { Link } from "react-router-dom";

export default function Topbar() {
  return (
    <div
      className={
        "w-screen h-10 fixed flex items-center px-2 z-50  justify-end " +
        classes.navbar
      }
    >
      <div className={classes.leftBlock}></div>
      <div className={classes.rightBlock}></div>

      {/*       <Link to="/" className={classes.home}>
        <i className="fal fa-hexagon text-white "></i>
      </Link> */}
      <Link to="/" className={classes.btn + " mx-10"}>
        <i className="fal fa-hexagon text-white "></i>
      </Link>
      <Link to="/model" className={classes.btn + " mx-10"}>
        <i className="fal fa-space-station-moon-alt text-white"></i>
      </Link>
      <Link to="/surface" className={classes.btn + " mx-10"}>
        <i className="fal fa-location text-white"></i>
      </Link>
    </div>
  );
}
