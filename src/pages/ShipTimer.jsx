import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, json } from "react-router-dom";
import Timer from "../components/Timer";

export default function ShipTimer() {
  return (
    <>
      <div className="px-4">
        <Link to=".." relative="path" className="absolute">
          <div className="flex items-center gap-2 font-bold text-2xl text-white">
            <FaLongArrowAltLeft /> All Ships
          </div>
        </Link>
        <Timer />
      </div>
    </>
  );
}

export async function loader({ req, params }) {
  const param = params.shipId;
  const id = param.split("=");

  const response = await fetch(
    `https://odyn-backend.fly.dev/games/capncouserprofiles/?user=${id[0]}`
  );
  if (!response.ok) {
    throw json(
      { message: `Could not find ${id}'s ship` },
      {
        status: 500,
      }
    );
  } else {
    const { results } = await response.json();
    const ship = results[0];

    return ship;
  }
}
