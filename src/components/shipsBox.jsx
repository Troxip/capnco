import { Link } from "react-router-dom";

export default function ShipsBox() {
  return (
    <>
      <div>
        <li>
          <Link to={"/Ship 1"}>Ship 1</Link>
          <Link to={"/Ship 2"}>Ship 2</Link>
          <Link to={"/Ship 3"}>Ship 3</Link>
          <Link to={"/Ship 4"}>Ship 4</Link>
        </li>
      </div>
    </>
  );
}
