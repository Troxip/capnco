import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Timer({ shipDetails }) {
  const params = useParams();
  const shipNumber = +params.shipId.split("=")[1] + 1;
  const localStorageKey = `startedTime_${params.shipId}`;

  const [startedTime, setStartedTime] = useState(
    localStorage.getItem(localStorageKey) || 0
  );

  useEffect(() => {
    const storedTime = localStorage.getItem(localStorageKey);
    if (storedTime) {
      setStartedTime(storedTime);
    }
  }, [localStorageKey]);

  function startTime() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString("default", { month: "short" });
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const startedTime =
      day + " " + month + ", " + hours + ":" + minutes + ":" + seconds;

    setStartedTime(startedTime);
    localStorage.setItem(localStorageKey, startedTime);
  }

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
      <button
        onClick={startTime}
        className="border-[1px] border-gray-600 hover:border-[1px] bg-gray-600 px-4 py-2 hover:border-blue-500 hover:border-solid rounded-xl text-white"
      >
        Start Timer
      </button>
      <p>Started Time: {startedTime}</p>
    </div>
  );
}
