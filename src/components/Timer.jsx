import { useParams } from "react-router-dom";
export default function Timer({ shipDetails }) {
  const params = useParams();
  const shipNumber = +params.shipId.split("=")[1] + 1;

  console.log(shipDetails);
  return (
    <div className="flex flex-col justify-center items-center gap-2 text-white">
      <h1 className="font-bold text-5xl">
        Ship {shipNumber} | {shipDetails.user.username}
      </h1>
      <div>
        <p className="text-[1.3rem]">
          Multiplier: {shipDetails.pirate_tier_multiplier}x
        </p>
      </div>
      <p>mBlast amount: {shipDetails.mblast_balance}</p>
    </div>
  );
}
