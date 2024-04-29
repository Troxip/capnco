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
      : {
          startedTime: 0,
          stoppedTime: 0,
          isTimerRunning: false,
          doubloonsEarned: 0,
        };
  });

  // Function to format time
  function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  // Function to format timestamp to readable date format
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = formatTime(date.getMonth() + 1);
    const day = formatTime(date.getDate());
    const hours = formatTime(date.getHours());
    const minutes = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());
    return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
  }

  // Function to calculate elapsed time
  function calculateElapsedTime() {
    if (!timerData.isTimerRunning) {
      const elapsedTime = timerData.elapsedTime;
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;
      return `${formatTime(hours)} hours, ${formatTime(
        minutes
      )} minutes, ${formatTime(seconds)} seconds`;
    } else {
      const currentTime = new Date().getTime();
      const elapsedTime = Math.floor(
        (currentTime - timerData.startedTime) / 1000
      );
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;
      return `${formatTime(hours)} hours, ${formatTime(
        minutes
      )} minutes, ${formatTime(seconds)} seconds`;
    }
  }

  useEffect(() => {
    const storedData = localStorage.getItem(localStorageKey);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const elapsedTime = Math.floor(
        (currentTime - parsedData.startedTime) / 1000
      );
      setTimerData({
        ...parsedData,
        elapsedTime: parsedData.isTimerRunning
          ? elapsedTime
          : parsedData.elapsedTime,
      });
    } else {
      setTimerData({
        startedTime: 0,
        stoppedTime: 0,
        isTimerRunning: false,
        elapsedTime: 0,
        doubloonsEarned: 0,
      });
    }

    const interval = setInterval(() => {
      setTimerData((prevData) => {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor(
          (currentTime - prevData.startedTime) / 1000
        );
        return {
          ...prevData,
          elapsedTime: prevData.isTimerRunning
            ? elapsedTime
            : prevData.elapsedTime,
        };
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [localStorageKey]);

  function startTime() {
    const currentDate = new Date();
    const startedTime = currentDate.getTime(); // Store timestamp for accurate calculation
    const currentDoubloonsBalance = shipDetails.doubloons_balance;

    if (timerData.isTimerRunning) {
      // Stop Timer
      const stoppedTime = currentDate.toUTCString();
      const elapsedDoubloons =
        currentDoubloonsBalance - timerData.doubloonsBalance;
      setTimerData((prevData) => ({
        ...prevData,
        stoppedTime,
        isTimerRunning: false,
        doubloonsEarned: prevData.doubloonsEarned + elapsedDoubloons,
      }));
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          ...timerData,
          stoppedTime,
          isTimerRunning: false,
          doubloonsEarned: timerData.doubloonsEarned + elapsedDoubloons,
        })
      );
    } else {
      // Start Timer
      setTimerData({
        startedTime,
        stoppedTime: 0,
        isTimerRunning: true,
        doubloonsBalance: currentDoubloonsBalance,
        doubloonsEarned: timerData.doubloonsEarned,
      });
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          startedTime,
          stoppedTime: 0,
          isTimerRunning: true,
          doubloonsBalance: currentDoubloonsBalance, // Save current doubloons balance
          doubloonsEarned: timerData.doubloonsEarned,
        })
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

      <p
        className={
          !timerData.isTimerRunning
            ? "text-green-400 mt-5 text-xl"
            : "text-white mt-5 text-xl"
        }
      >
        {calculateElapsedTime()}
      </p>
      <p className="text-green-600">________________________________________</p>
      <p>
        Started Time (UTC):{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {formatTimestamp(timerData.startedTime)}
        </span>
      </p>
      {!timerData.isTimerRunning && (
        <p>
          Stopped Time (UTC):{" "}
          <span className={!timerData.isTimerRunning && "text-yellow-300"}>
            {formatTimestamp(timerData.stoppedTime)}
          </span>
        </p>
      )}
      <p className="text-green-600">________________________________________</p>
      <p>
        Start Doubloons Balance:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {timerData.doubloonsBalance?.toLocaleString() ||
            shipDetails.doubloons_balance.toLocaleString()}
        </span>
      </p>
      <p>
        Real Time Doubloons:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {shipDetails.doubloons_balance.toLocaleString()}
        </span>
      </p>
      <p>
        Doubloons Earned:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {timerData.doubloonsEarned.toLocaleString()}
        </span>
      </p>
    </div>
  );
}
