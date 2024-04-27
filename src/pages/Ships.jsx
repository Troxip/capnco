import { Link, json, useLoaderData } from "react-router-dom";

export default function Ships() {
  const ships = useLoaderData();

  if (ships.isError) {
    return <p className="font-bold text-3xl text-white">{ships.message}</p>;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8 p-8 text-white">
      <h1 className="font-bold text-4xl">Ships</h1>
      <nav className="gap-8 grid grid-cols-5 grid-rows-3 bg-inherit">
        {ships.map((ship, i) => (
          <Link
            key={ship.id}
            to={`/${ship.user.username}`} // Assuming username is used in the route path
            className="border-2 border-slate-400bg-slate-400 p-8 hover:border-red-300 border-solid rounded-xl w-full h-full font-bold text-3xl text-center text-white hover:scale-110 transition-all"
          >
            <div>
              {`Ship ${i + 1}`}{" "}
              <p className="text-green-400 text-sm">{ship.user.username}</p>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export async function loader() {
  const usernames = [
    "GR33DY",
    "lucky_carrot",
    "BAB3",
    "MAG4",
    "5HIP",
    "6PAC",
    "7UP",
    "8BALL",
    "K9",
    "10PIN",
    "HE11O",
    "D12",
    "THIR13EN",
    "SONATA14",
    "PEN15",
  ];

  const limit = 25;
  const offsets = Array.from({ length: 7 }, (_, index) => index * limit); // Generate offsets from 0 to 16500 (660 * 25)

  let allShips = [];

  // Fetch data for each offset
  await Promise.all(
    offsets.map(async (offset) => {
      const response = await fetch(
        `https://odyn-backend.fly.dev/games/capncouserprofiles/?limit=${limit}&offset=${offset}&ordering=-mblast_balance`
      );

      if (response.ok) {
        const resData = await response.json();
        allShips.push(...resData.results);
      }
    })
  );

  // Filter ships by usernames
  const filteredShips = usernames
    .map((username) => allShips.find((ship) => ship.user.username === username))
    .filter(Boolean);

  if (filteredShips.length === 0) {
    return json(
      { message: "No ships found for the specified usernames" },
      { status: 404 }
    );
  }

  return filteredShips;
}
