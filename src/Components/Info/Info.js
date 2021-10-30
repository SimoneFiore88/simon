import classes from "./Info.module.css";

const data = [
  {
    title: "Bio",
    description:
      "I don't think we've met. \nMy name is Simone Fiore, but everyone calls me Fiore.",
  },
  {
    title: "Stack",
    description: "Frontend developer and teacher.",
  },
  {
    title: "Formation",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    title: "Hobbies",
    description: "CS, Space&Science and many other things.",
  },
];

export default function Info({ id, setInfo }) {
  return (
    <div className="absolute bottom-4 md:right-4 w-screen px-4 md:w-96 h-32">
      <div className={"h-32 flex flex-col justify-center  " + classes.bg}>
        <button className="absolute top-2 right-8" onClick={() => setInfo(-2)}>
          <i className="fal fa-times-hexagon"></i>
        </button>
        <h2 className="self-start">{data[id].title}</h2>
        <div className={"h-28 " + classes.scroll}>
          <p>{data[id].description}</p>
        </div>
      </div>
    </div>
  );
}
