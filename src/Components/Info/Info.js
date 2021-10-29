import classes from "./Info.module.css";
import { useParams } from "react-router";

export default function Info(props) {
  let { id } = useParams();
  return (
    <div className={"absolute bottom-4 right-4 w-96 h-32 " + classes.bg}>
      {id} <br /> Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Voluptate nemo iure corrupti, animi rem soluta deserunt. Atque ad omnis
      deserunt voluptatibus enim, aliquid dolor, harum repellendus sit autem
      ipsum voluptatem. Lorem ipsum dolor sit, amet consectetur adipisicing
      elit. Reprehenderit, nobis natus itaque libero eaque laborum, nemo fugit
      voluptatem fugiat dolore vitae optio suscipit temporibus delectus
      aspernatur facere nesciunt exercitationem velit. Lorem ipsum dolor sit
      amet consectetur adipisicing elit. Natus eaque sapiente sit officia
      possimus ipsam, consequuntur iusto necessitatibus, non blanditiis,
      excepturi dolore sunt quia minus fugit debitis nihil vero nesciunt.
    </div>
  );
}
