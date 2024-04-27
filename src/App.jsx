import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./pages/Header";
import Error from "./pages/Error";

const router = createBrowserRouter([
  { path: "/", element: <Header />, errorElement: <Error />, children: [] },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
