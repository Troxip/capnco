import { Link, Outlet } from "react-router-dom";
import { fetchData } from "../fetch/fetchAll";
import { useEffect, useState } from "react";

export default function Header() {
  const [fetchedData, setFetchedData] = useState([]);
  const [multiplierCounts, setMultiplierCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const handleGetDataClick = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      setFetchedData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const counts = fetchedData.reduce((acc, data) => {
      // Calculate the total multiplier according to the specified rules
      let multiplier =
        (+data.nft_rewards_multiplier > 1 ? +data.nft_rewards_multiplier : 0) +
        (+data.staking_rewards_multiplier > 1
          ? +data.staking_rewards_multiplier
          : 0);

      // Adjust the multiplier if necessary
      if (multiplier === 0) {
        multiplier = 1;
      } else if (multiplier === 2) {
        multiplier = 2;
      } else if (multiplier === 10) {
        if (
          +data.nft_rewards_multiplier === 5 &&
          +data.staking_rewards_multiplier === 5
        ) {
          multiplier = 10; // Handle the special case for 1 5 5
        } else {
          multiplier = 5; // Adjust for other cases of 10x
        }
      }

      // Update the counts accordingly
      if (multiplier >= 1 && multiplier <= 11) {
        acc[multiplier] = (acc[multiplier] || 0) + 1;
      }
      return acc;
    }, {});
    setMultiplierCounts(counts);
  }, [fetchedData]);

  return (
    <>
      <button
        onClick={handleGetDataClick}
        disabled={loading} // Disable button when loading
        className={`top-10 left-10 absolute border-2 hover:bg-gray-800 px-4 py-2 hover:border-red-500 rounded-md text-white transition-all ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Loading..." : "Get Multipliers"}
      </button>
      <div className="top-5 left-56 absolute text-white">
        {Object.entries(multiplierCounts).map(([multiplier, count]) => (
          <p key={multiplier}>{`${multiplier}x = ${count}`}</p>
        ))}
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
