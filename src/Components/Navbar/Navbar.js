import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";
export default function Navbar() {
  return (
    <div className="w-screen h-16 fixed flex items-center px-2 z-50 justify-between navbar">
      <Link to="/" className={classes.btn + " font-electrolize "}>
        <span className="text-yellow-300">SimoneFiore</span>
      </Link>
      <div className="flex flex-col h-32 w-20 justify-between self-start pt-4">
        <Link to="/" className={classes.btn}>
          <i className="fal fa-signal-stream text-yellow-300"></i>
        </Link>
        <Link to="/" className={classes.btn}>
          <i className="fal fa-user text-yellow-300"></i>
        </Link>
        <Link to="/surface" className={classes.btn}>
          <i className="fal fa-cube text-yellow-300"></i>
        </Link>
      </div>

      {/* <Link to="/shape/d4" className={classes.btn}>
          <i className="fal fa-dice-d4 text-yellow-300"></i>
        </Link>
        <Link to="/shape/d6" className={classes.btn}>
          <i className="fal fa-dice-d6 text-yellow-300"></i>
        </Link>
        <Link to="/shape/d8" className={classes.btn}>
          <i className="fal fa-dice-d8 text-yellow-300"></i>
        </Link>
        <Link to="/shape/d10" className={classes.btn}>
          <i className="fal fa-dice-d10 text-yellow-300"></i>
        </Link> */}
    </div>
  );
}
