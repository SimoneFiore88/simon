import { useParams } from "react-router";
import classes from "./Box.module.css";

export default function Box(props) {
  let { id } = useParams();
  return <div className={classes.box}>{id}</div>;
}
