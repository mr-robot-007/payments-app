import { Container } from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";

import UserRow from "../components/UserRow";

const Dashboard = function () {
  return (
    <div className="px-3">
      <header className="flex justify-between px-3 py-4 ">
        <h1 className="font-bold text-3xl">Payments App</h1>
        <div className="flex gap-4 text-xl font-bold items-center px-2">
          <div>Hello,User</div>
          <div className="bg-gray-200 p-3 rounded-full">{<FaUserAlt />}</div>
        </div>
      </header>
      <hr />
      <Container className="mt-4 px-3 flex flex-col gap-5">
        <div className="font-bold text-2xl">Your Balance : $5000</div>
        <div className=" flex-col flex gap-2">
          <div className="font-bold text-2xl">Users</div>
          <input
            type="text"
            className=" font-semibold border-2 w-full p-2 rounded-lg focus:outline-1"
            placeholder="Search Users..."
          />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
            <UserRow key={num} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export { Dashboard };
