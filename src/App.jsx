import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./pages/Header";
import Error from "./pages/Error";
import Ships, { loader as shipsLoader } from "./pages/Ships";
import ShipTimer, { loader as selectedShip } from "./pages/ShipTimer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Ships />,
        loader: shipsLoader,
      },
      {
        path: "/:shipId",
        element: <ShipTimer />,
        loader: selectedShip,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
