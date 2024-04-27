import ShipsBox from "./../components/shipsBox";

export default function Home() {
  return (
    <>
      <div className="flex justify-center p-4">
        <img
          src="https://capnco.gg/_app/immutable/assets/CapCompanyLogo.wEV2_GJJ.webp"
          alt=""
        />
      </div>
      <ShipsBox />
    </>
  );
}
