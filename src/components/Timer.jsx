import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Timer({ shipDetails }) {
  const params = useParams();
  const shipNumber = +params.shipId.split("=")[1] + 1;
  const localStorageKey = `ship_${params.shipId}`;

  const [timerData, setTimerData] = useState(() => {
    const storedData = localStorage.getItem(localStorageKey);
    return storedData
      ? JSON.parse(storedData)
      : { startedTime: 0, stoppedTime: 0, isTimerRunning: false };
  });

  useEffect(() => {
    const storedData = localStorage.getItem(localStorageKey);
    if (storedData) {
      setTimerData(JSON.parse(storedData));
    }
  }, [localStorageKey]);

  function startTime() {
    if (timerData.isTimerRunning) {
      // Stop Timer
      const currentDate = new Date();
      const stoppedTime = currentDate.toUTCString();
      setTimerData((prevData) => ({
        ...prevData,
        stoppedTime,
        isTimerRunning: false,
      }));
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ ...timerData, stoppedTime, isTimerRunning: false })
      );
    } else {
      // Start Timer
      const currentDate = new Date();
      const startedTime = currentDate.toUTCString();
      setTimerData({ startedTime, stoppedTime: 0, isTimerRunning: true });
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ startedTime, stoppedTime: 0, isTimerRunning: true })
      );
    }
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
      <button
        onClick={startTime}
        className={
          timerData.isTimerRunning
            ? "bg-[#854343] font-medium border-[1px] border-gray-600 hover:border-[1px]  px-4 py-2 hover:border-green-400 hover:border-solid rounded-xl text-white transition-all"
            : "border-[1px] font-medium border-gray-600 hover:border-[1px]  bg-[#1a1a1a] px-4 py-2 hover:border-blue-500 hover:border-solid rounded-xl text-white transition-all"
        }
      >
        {timerData.isTimerRunning ? "Stop Timer" : "Start Timer"}
      </button>
      <p className="text-green-600">________________________________________</p>
      <p></p>
      <p>Time</p>
      <p className="text-green-600">________________________________________</p>
      <p>
        Started Time:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {timerData.startedTime}
        </span>
      </p>
      {!timerData.isTimerRunning && (
        <p>
          Stopped Time:{" "}
          <span className={!timerData.isTimerRunning && "text-yellow-300"}>
            {timerData.stoppedTime}
          </span>
        </p>
      )}
      <p className="text-green-600">________________________________________</p>
    </div>
  );
}
