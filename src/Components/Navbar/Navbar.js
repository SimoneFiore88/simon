import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-16 border-r-main border-r-2 h-screen fixed flex flex-col justify-around items-center">
      <Link>
        <i className="fal fa-home text-main"></i>
      </Link>
      <Link>
        <i className="fal fa-home text-main"></i>
      </Link>
      <Link>
        <i className="fal fa-home text-main"></i>
      </Link>
      <Link>
        <i className="fal fa-home text-main"></i>
      </Link>
    </div>
  );
}
