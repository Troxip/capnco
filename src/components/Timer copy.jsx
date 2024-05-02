import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Timer() {
  const params = useParams();
  const shipNumber = +params.shipId?.split("=")[1] + 1;
  const localStorageKey = `ship_${params.shipId}`;
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const param = params.shipId;
        if (!param) return;
        const id = param.split("=")[0];
        const response = await fetch(
          `https://odyn-backend.fly.dev/games/capncouserprofiles/?user=${id}`
        );

        if (!response.ok) {
          throw new Error(`Could not find ship with ID ${id}`);
        }

        const { results } = await response.json();
        const shipData = results[0];
        setData(shipData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();

    const interval = setInterval(fetchData, 15000); // Fetch data every 15 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [params.shipId]);

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
        realTimeDoubloons: data ? data.doubloons_balance : 0,
        realTimemBlast: data ? data.mblast_balance : 0,
      };
    } else {
      return {
        startedTime: 0,
        stoppedTime: 0,
        isTimerRunning: false,
        elapsedTime: 0,
        doubloonsEarned: 0,
        doubloonsBalance: data ? data.doubloons_balance : 0,
        mBlastBalance: data ? data.mblast_balance : 0,
        realTimeDoubloons: data ? data.doubloons_balance : 0,
        realTimemBlast: data ? data.mblast_balance : 0,
        initialDoubloonsBalance: 0,
        initialmBlastBalance: 0,
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
        doubloonsBalance: data ? data.doubloons_balance : 0,
        mBlastBalance: data ? data.mblast_balance : 0,
        realTimeDoubloons: data ? data.doubloons_balance : 0,
        realTimemBlast: data ? data.mblast_balance : 0,
      }));
      setInitialDoubloonsBalance(data ? data.doubloons_balance : 0);
    }
  }, [localStorageKey, data]);

  useEffect(() => {
    let interval;
    if (timerData.isTimerRunning) {
      interval = setInterval(() => {
        setTimerData((prevData) => ({
          ...prevData,
          elapsedTime: prevData.elapsedTime + 1,
          realTimeDoubloons: data ? data.doubloons_balance : 0,
          realTimemBlast: data ? data.mblast_balance : 0,
        }));
      }, 1000); // Update every second
    }

    return () => clearInterval(interval);
  }, [timerData.isTimerRunning, data]);

  function startTime() {
    const currentDate = new Date();
    const currentTime = currentDate.getTime(); // Store timestamp for accurate calculation

    if (timerData.isTimerRunning) {
      // Stop Timer
      const stoppedTime = currentDate.toUTCString();
      const elapsedDoubloons = data
        ? data.doubloons_balance - timerData.doubloonsBalance
        : 0;
      const elapsedmBlast = data
        ? data.mblast_balance - timerData.mBlastBalance
        : 0;

      // Calculate elapsed time
      const elapsedTime = Math.floor(
        (currentTime - timerData.startedTime) / 1000 - timerData.elapsedTime
      );

      // Save stoppedTime, doubloonsEarned, elapsed time, and current doubloons_balance in localStorage
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          ...timerData,
          stoppedTime,
          isTimerRunning: false,
          doubloonsEarned: timerData.doubloonsEarned + elapsedDoubloons,
          mBlastEarned: timerData.mBlastEarned + elapsedmBlast,
          elapsedTime: timerData.elapsedTime + elapsedTime, // Update elapsed time
        })
      );

      setTimerData((prevData) => ({
        ...prevData,
        stoppedTime,
        isTimerRunning: false,
        doubloonsEarned: prevData.doubloonsEarned + elapsedDoubloons,
        mBlastEarned: prevData.mBlastEarned + elapsedmBlast,
        elapsedTime: prevData.elapsedTime + elapsedTime, // Update elapsed time
      }));
    } else {
      // Start Timer
      const realTimeDoubloons = data ? data.doubloons_balance : 0; // Get the current real-time doubloons
      const realTimemBlast = data ? data.mblast_balance : 0; // Get the current real-time mBlast
      setTimerData({
        ...timerData,
        startedTime: currentTime, // Update started time
        stoppedTime: 0,
        isTimerRunning: true,
        doubloonsEarned: 0, // Reset doubloonsEarned when starting the timer
        mBlastEarned: 0, // Reset mBlastEarned when starting the timer
        elapsedTime: 0, // Reset elapsedTime when starting the timer
        initialDoubloonsBalance: realTimeDoubloons, // Set initial doubloons balance to real-time doubloons
        initialmBlastBalance: realTimemBlast, // Set initial mBlast balance to real-time mBlast
        realTimeDoubloons,
        realTimemBlast,
      });
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          ...timerData,
          startedTime: currentTime, // Update started time
          stoppedTime: 0,
          isTimerRunning: true,
          doubloonsEarned: 0, // Reset doubloonsEarned when starting the timer
          mBlastEarned: 0, // Reset mBlastEarned when starting the timer
          elapsedTime: 0, // Reset elapsedTime when starting the timer
          initialDoubloonsBalance: realTimeDoubloons, // Set initial doubloons balance to real-time doubloons
          initialmBlastBalance: realTimemBlast, // Set initial mBlast balance to real-time mBlast
          realTimeDoubloons,
          realTimemBlast,
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
        Ship {shipNumber} | {data && data.user.username}
      </h1>
      <div>
        <p className="text-[1.3rem]">
          Multiplier:{" "}
          {data &&
            +data.pirate_tier_multiplier +
              +data.staking_rewards_multiplier +
              (data.nft_rewards_multiplier > 0
                ? +data.nft_rewards_multiplier - 1
                : +data.nft_rewards_multiplier)}
          x
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
          {timerData.initialDoubloonsBalance?.toLocaleString()}
        </span>
      </p>
      <p>
        Real Time Doubloons:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {timerData.realTimeDoubloons?.toLocaleString()}
        </span>
      </p>
      <p>
        Doubloons Earned:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {(
            timerData.realTimeDoubloons - timerData.initialDoubloonsBalance
          ).toLocaleString()}
        </span>
      </p>
      <p className="text-green-600">________________________________________</p>
      <p>
        Start mBlast Balance:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {timerData.initialmBlastBalance?.toLocaleString()}
        </span>
      </p>
      <p>
        Real Time mBlast:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {timerData.realTimemBlast?.toLocaleString()}
        </span>
      </p>
      <p>
        mBlast Earned:{" "}
        <span className={!timerData.isTimerRunning && "text-yellow-300"}>
          {(
            timerData.realTimemBlast - timerData.initialmBlastBalance
          ).toLocaleString()}
        </span>
      </p>
      <p className="text-green-600">________________________________________</p>
    </div>
  );
}
