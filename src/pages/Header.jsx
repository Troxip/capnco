import { Link, NavLink, Outlet } from "react-router-dom";

export default function Header() {
  return (
    <>
      <div className="flex justify-center p-8">
        <img
          src="https://capnco.gg/_app/immutable/assets/CapCompanyLogo.wEV2_GJJ.webp"
          alt=""
          width={300}
        />
      </div>
      <nav className="flex gap-3 text-white">
        <NavLink
          to="/ship1"
          className={({ isActive }) => (isActive ? "bg-slate-500" : "")}
        >
          Ship 1
        </NavLink>
        <NavLink
          to="/ship2"
          className={({ isActive }) => (isActive ? "bg-slate-500" : "")}
        >
          Ship 2
        </NavLink>
      </nav>
      <Outlet />
    </>
  );
}
