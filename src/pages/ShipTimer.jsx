import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, json, useLoaderData } from "react-router-dom";

export default function ShipTimer() {
  const data = useLoaderData();

  return (
    <>
      <div className="px-4">
        <Link to=".." relative="path">
          <div className="flex items-center gap-2 font-bold text-2xl text-white">
            <FaLongArrowAltLeft /> All Ships
          </div>
        </Link>
      </div>
    </>
  );
}

export async function loader({ req, params }) {
  const id = params.shipId;

  const response = await fetch(
    "https://odyn-backend.fly.dev/games/capncouserprofiles/?limit=25&offset=0&ordering=-mblast_balance"
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
    const foundShip = results.find((ship) => ship.user.username === id);

    return foundShip;
  }
}
