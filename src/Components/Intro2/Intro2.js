import classes from "./Intro2.module.css";

export default function Intro2({ loaded, progress, visible, setVisible }) {
  return (
    <div
      className={
        "absolute top-0 left-0 z-50 w-screen h-full bg-black flex flex-col justify-center items-center " +
        (visible ? "" : "hidden")
      }
    >
      <div className={classes.circle}>
        <div className={classes.progress}>{progress}</div>
        <div
          className={
            "cursor-pointer " + classes.label + " " + (loaded && classes.pulse)
          }
          onClick={() => setVisible(false)}
        >
          {!loaded ? "Loading" : "Start"}
        </div>
      </div>
    </div>
  );
}
