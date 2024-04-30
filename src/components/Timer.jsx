import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";

export default function Timer() {
  const params = useParams();
  const shipNumber = +params.shipId.split("=")[1] + 1;
  const localStorageKey = `ship_${params.shipId}`;
  const data = useLoaderData();

  const [initialDoubloonsBalance, setInitialDoubloonsBalance] = useState(0);

  const [timerData, setTimerData] = useState(() => {
    const storedData = localStorage.getItem(localStorageKey);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const initialStartTime = parsedData.startedTime;
      const currentTime = new Date().getTime();
      const elapsedTime = Math.floor((currentTime - initialStartTime) / 1000);
      return {
        ...parsedData,
        elapsedTime,
        realTimeDoubloons: data.doubloons_balance,
      };
    } else {
      return {
        startedTime: 0,
        stoppedTime: 0,
        isTimerRunning: false,
        elapsedTime: 0,
        doubloonsEarned: 0,
        doubloonsBalance: data.doubloons_balance,
        realTimeDoubloons: data.doubloons_balance,
      };
    }
  });

  useEffect(() => {
    const storedData = localStorage.getItem(localStorageKey);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setTimerData(parsedData);
      setInitialDoubloonsBalance(parsedData.initialDoubloonsBalance);
    } else {
      setTimerData((prevData) => ({
        ...prevData,
        doubloonsBalance: data.doubloons_balance,
        realTimeDoubloons: data.doubloons_balance,
      }));
      setInitialDoubloonsBalance(data.doubloons_balance);
    }
  }, [localStorageKey, data.doubloons_balance]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerData.isTimerRunning) {
        setTimerData((prevData) => ({
          ...prevData,
          elapsedTime: prevData.elapsedTime + 1,
        }));
      }
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [timerData.isTimerRunning]);

  useEffect(() => {
    let interval;
    if (timerData.isTimerRunning) {
      interval = setInterval(() => {
        setTimerData((prevData) => ({
          ...prevData,
          realTimeDoubloons: data.doubloons_balance, // Update real-time doubloons every 15 seconds
        }));
      }, 15000); // Update every 15 seconds
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [timerData.isTimerRunning, data.doubloons_balance]);

  function startTime() {
    const currentDate = new Date();
    const currentTime = currentDate.getTime(); // Store timestamp for accurate calculation

    if (timerData.isTimerRunning) {
      // Stop Timer
      const stoppedTime = currentDate.toUTCString();
      const elapsedDoubloons =
        data.doubloons_balance - timerData.doubloonsBalance;

      // Calculate elapsed time
      const elapsedTime = Math.floor(
        (currentTime - timerData.startedTime) / 1000
      );

      // Save stoppedTime, doubloonsEarned, elapsed time, and current doubloons_balance in localStorage
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          ...timerData,
          stoppedTime,
          isTimerRunning: false,
          doubloonsEarned: timerData.doubloonsEarned + elapsedDoubloons,
          elapsedTime: timerData.elapsedTime + elapsedTime, // Update elapsed time
        })
      );

      setTimerData((prevData) => ({
        ...prevData,
        stoppedTime,
        isTimerRunning: false,
        doubloonsEarned: prevData.doubloonsEarned + elapsedDoubloons,
        elapsedTime: prevData.elapsedTime + elapsedTime, // Update elapsed time
      }));
    } else {
      // Start Timer
      const realTimeDoubloons = data.doubloons_balance; // Get the current real-time doubloons
      setTimerData({
        ...timerData,
        startedTime: currentTime, // Update started time
        stoppedTime: 0,
        isTimerRunning: true,
        doubloonsEarned: 0, // Reset doubloonsEarned when starting the timer
        elapsedTime: 0, // Reset elapsedTime when starting the timer
        initialDoubloonsBalance: realTimeDoubloons, // Set initial doubloons balance to real-time doubloons
        realTimeDoubloons,
      });
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          ...timerData,
          startedTime: currentTime, // Update started time
          stoppedTime: 0,
          isTimerRunning: true,
          doubloonsEarned: 0, // Reset doubloonsEarned when starting the timer
          elapsedTime: 0, // Reset elapsedTime when starting the timer
          initialDoubloonsBalance: realTimeDoubloons, // Set initial doubloons balance to real-time doubloons
          realTimeDoubloons,
        })
      );
    }
  }

  function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

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

  return (
    <div className="flex flex-col justify-center items-center gap-2 text-white">
      <h1 className="font-bold text-5xl">
        Ship {shipNumber} | {data.user.username}
      </h1>
      <div>
        <p className="text-[1.3rem]">
          Multiplier: {data.pirate_tier_multiplier}x
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
          {initialDoubloonsBalance.toLocaleString()}
        </span>
      </p>
      <p>
        Real Time Doubloons:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {timerData.realTimeDoubloons.toLocaleString()}
        </span>
      </p>
      <p>
        Doubloons Earned:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {(
            timerData.realTimeDoubloons - initialDoubloonsBalance
          ).toLocaleString()}
        </span>
      </p>
    </div>
  );
}
