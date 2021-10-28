import { useParams } from "react-router";
import classes from "./Box.module.css";

export default function Box() {
  return (
    <div
      className={
        "flex justify-center items-center absolute bottom-0 left-0 w-screen h-20 z-50 " +
        classes.wrapper
      }
    >
      <i className={"fal fa-chevron-left text-white " + classes.pulse}></i>

      <i
        className={
          "fal fa-hand-pointer mx-10 text-white fa-sm " + classes.slide
        }
      ></i>

      <i className={"fal fa-chevron-right text-white " + classes.pulse}></i>
    </div>
  );
}
