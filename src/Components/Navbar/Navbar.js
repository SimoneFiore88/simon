import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-screen  h-16 fixed flex bg-black justify-around items-center">
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
