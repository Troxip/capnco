import { useRouteError } from "react-router-dom";
import Header from "./Header";

export default function Error() {
  const error = useRouteError();
  let title = "Ship does not exist!";

  if (error.status === 500) {
    title = error.data.message;
  }

  return (
    <>
      <Header />
      <main className="text-5xl text-center text-white">
        <h1>{title}</h1>
      </main>
    </>
  );
}
