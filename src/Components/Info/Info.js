import classes from "./Info.module.css";

export default function Info(props) {
  return (
    <div className={"absolute bottom-4 right-4 w-96 h-32 " + classes.bg}>
      {props.data} <br />
    </div>
  );
}
