import { useParams } from "react-router-dom";
export default function Timer({ shipDetails }) {
  const params = useParams();
  const shipNumber = +params.shipId.split("=")[1] + 1;

  console.log(shipDetails);
  return (
    <div className="flex flex-col justify-center items-center text-white">
      <h1 className="font-bold text-5xl">
        Ship {shipNumber} | {shipDetails.user.username}
      </h1>
    </div>
  );
}
