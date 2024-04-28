import { Link, Outlet } from "react-router-dom";
import { fetchData } from "../fetch/fetchAll";
import { useEffect, useState } from "react";

export default function Header() {
  const [fetchedData, setFetchedData] = useState([]);
  const [threeXCount, setThreeXCount] = useState(0);
  const [TwoTwoFive, setTwoTwoFive] = useState(0);
  const [OneSevenFive, setOneSevenFive] = useState(0);
  const [OneFive, setOneFive] = useState(0);
  const [OneTwoFive, setTwoFive] = useState(0);

  const handleGetDataClick = async () => {
    const data = await fetchData();
    setFetchedData(data);
  };

  useEffect(() => {
    const threeX = fetchedData.filter(
      (ship) => ship.pirate_tier_multiplier === 3
    );
    const TwoTwoFive = fetchedData.filter(
      (ship) => ship.pirate_tier_multiplier === 2.25
    );
    const OneSevenFive = fetchedData.filter(
      (ship) => ship.pirate_tier_multiplier === 1.75
    );
    const OneFive = fetchedData.filter(
      (ship) => ship.pirate_tier_multiplier === 1.5
    );
    const OneTwoFive = fetchedData.filter(
      (ship) => ship.pirate_tier_multiplier === 1.25
    );
    setThreeXCount(threeX.length);
    setTwoTwoFive(TwoTwoFive.length);
    setOneSevenFive(OneSevenFive.length);
    setOneFive(OneFive.length);
    setTwoFive(OneTwoFive.length);
  }, [fetchedData]);

  return (
    <>
      <button
        onClick={handleGetDataClick}
        className="top-10 left-10 absolute border-2 hover:bg-gray-800 px-4 py-2 hover:border-red-500 rounded-md text-white transition-all"
      >
        Get Data
      </button>
      <div className="top-10 left-40 absolute text-white">
        <p>3x = {threeXCount}</p>
        <p>2.25x = {TwoTwoFive}</p>
        <p>1.75x = {OneSevenFive}</p>
        <p>1.5x = {OneFive}</p>
        <p>1.25x = {OneTwoFive}</p>
      </div>
      <div className="flex flex-col justify-center items-center p-8">
        <Link to="/">
          <img
            src="https://capnco.gg/_app/immutable/assets/CapCompanyLogo.wEV2_GJJ.webp"
            alt=""
            width={300}
          />
        </Link>
        {/* <h1 className="font-bold text-3xl text-white"></h1> */}
      </div>
      <Outlet />
    </>
  );
}
