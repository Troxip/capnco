import { NavLink, useLoaderData } from "react-router-dom";

export default function Ships() {
  const ships = useLoaderData();

  return (
    <div className="flex flex-col justify-center items-center gap-8 p-8 text-white">
      <h1 className="font-bold text-4xl">Ships</h1>
      <nav className="gap-8 grid grid-cols-5 grid-rows-3 bg-inherit">
        {ships.map((ship, i) => (
          <NavLink
            key={ship.id}
            to={`/${ship.user.username}`} // Assuming username is used in the route path
            className="border-2 border-slate-400bg-slate-400 p-8 hover:border-red-300 border-solid rounded-xl w-full h-full font-bold text-3xl text-center text-white hover:scale-110 transition-all"
          >
            <div>
              {`Ship ${i + 1}`}{" "}
              <p className="text-green-400 text-sm">{ship.user.username}</p>
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export async function loader() {
  const response = await fetch(
    "https://odyn-backend.fly.dev/games/capncouserprofiles/?limit=25&offset=0&ordering=-mblast_balance"
  );

  if (!response.ok) {
    //...
  } else {
    const resData = await response.json();
    return resData.results;
  }
}
