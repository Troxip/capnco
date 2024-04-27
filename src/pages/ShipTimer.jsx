import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

export default function ShipTimer() {
  const { shipId } = useParams();
  console.log(shipId);

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
