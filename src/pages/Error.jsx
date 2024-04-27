import Header from "./Header";

export default function Error() {
  return (
    <>
      <Header />
      <main className="text-5xl text-center text-white">
        <h1>Ship does not exist!</h1>
      </main>
    </>
  );
}
