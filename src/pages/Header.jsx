import { Link, Outlet } from "react-router-dom";

export default function Header() {
  return (
    <>
      <div className="flex justify-center p-8">
        <Link to="/">
          <img
            src="https://capnco.gg/_app/immutable/assets/CapCompanyLogo.wEV2_GJJ.webp"
            alt=""
            width={300}
          />
        </Link>
      </div>
      <Outlet />
    </>
  );
}
