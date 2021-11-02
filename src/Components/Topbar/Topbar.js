import classes from "./Topbar.module.css";
import { Link } from "react-router-dom";

import { useState, useContext } from "react";

export default function Topbar() {
  return (
    <div
      className={
        "w-screen h-10 fixed flex items-center px-2 z-50 justify-between " +
        classes.navbar
      }
    >
      <div className={classes.leftBlock}></div>
      <div className={classes.rightBlock}></div>

      <Link to="/" className={classes.home}>
        {/* <span className="text-yellow-300">SimoneFiore</span> */}
        <i className="fal fa-hexagon text-white "></i>
      </Link>
      <div className="flex flex-col h-32 w-20 justify-between self-start pt-4 hidden ">
        <Link to="/home1" className={classes.btn}>
          <i className="fal fa-signal-stream text-yellow-300"></i>
        </Link>
        <Link to="/home2" className={classes.btn}>
          <i className="fal fa-user text-yellow-300"></i>
        </Link>
        <Link to="/home3" className={classes.btn}>
          <i className="fal fa-cube text-yellow-300"></i>
        </Link>
        <Link to="/mars2" className={classes.btn}>
          <i className="fal fa-cube text-yellow-300"></i>
        </Link>
      </div>
    </div>
    /*     <nav className={"h-40 w-screen bg-red-500 " + classes.navbar}>
      <div className="container-fluid">
        <div className={classes.navLogo}></div>
      </div>
    </nav> */
  );
}
