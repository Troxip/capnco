import { Suspense } from "react";
import { Await, Link, defer, useLoaderData } from "react-router-dom";

export default function Ships() {
  const { ships } = useLoaderData();

  if (ships.isError) {
    return <p className="font-bold text-3xl text-white">{ships.message}</p>;
  }

  return (
    <Suspense
      fallback={
        <h1 className="flex flex-col font-bold text-4xl text-center text-white">
          Loading...{" "}
          <span className="text-red-300 text-sm">
            (Reload the page if you are stuck)
          </span>
        </h1>
      }
    >
      <div className="flex flex-col justify-center items-center gap-8 p-8 text-white">
        <h1 className="font-bold text-4xl">Ship List</h1>
        <Await resolve={ships}>
          {(ships) => (
            <nav className="gap-8 grid grid-cols-5 grid-rows-3 bg-inherit">
              {ships.map((ship, i) => (
                <Link
                  key={ship.id}
                  to={`/${ship.user.id}=${i}`} // Assuming username is used in the route path
                  className="border-2 border-slate-400bg-slate-400 p-8 hover:border-red-300 border-solid rounded-xl w-full h-full font-bold text-3xl text-center text-white hover:scale-110 transition-all"
                >
                  <div>
                    {`Ship ${i + 1}`}{" "}
                    <p className="text-green-400 text-sm">
                      {ship.user.username}
                    </p>
                  </div>
                </Link>
              ))}
            </nav>
          )}
        </Await>
      </div>
    </Suspense>
  );
}

async function loadShips() {
  const usernames = [
    "37530",
    "36897",
    "45104",
    "45894",
    "46351",
    "47499",
    "47664",
    "48137",
    "48676",
    "49032",
    "49052",
    "49606",
    "50323",
    "50378",
    "50384",
  ];
  const promises = usernames.map(async (username) => {
    const response = await fetch(
      `https://odyn-backend.fly.dev/games/capncouserprofiles/?user=${username}`
    );
    const data = await response.json();
    return data.results[0];
  });
  const results = await Promise.all(promises);
  console.log(results);
  return results;
}

export function loader() {
  return defer({
    ships: loadShips(),
  });
}
