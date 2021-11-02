import classes from "./Intro.module.css";

export default function Intro({ loaded, progress, visible, setVisible }) {
  return (
    <div
      className={
        "absolute top-0 left-0 z-50 w-screen h-full bg-black flex flex-col justify-center items-center " +
        (visible ? "" : "hidden")
      }
    >
      <div className={classes.psoload + ""}>
        <div className={classes.straight}></div>
        <div className={classes.curve}></div>
        <div className={classes.center}></div>
        <div className={classes.inner}></div>
      </div>

      <p
        className="text-white absolute text-sm cursor-pointer "
        onClick={() => setVisible(!visible)}
      >
        {loaded ? "START" : `${progress} %`}
      </p>
      <p
        className="text-white absolute mt-40 "
        onClick={() => setVisible(!visible)}
      >
        {loaded ? "" : `STARTING ENGINE`}
      </p>
    </div>
  );
}
