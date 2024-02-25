import { Container } from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import UserRow from "../components/UserRow";
import Balance from "../components/Balance";
import Header from "../components/Header";
import { useState } from "react";

async function getUsers() {
  const response = await axios.get("http://localhost:3000/api/v1/user/bulk");
  // console.log(response.data);
  return response.data.user;
}

const Dashboard = function ({ children }) {
  const { data: users, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUsers,
  });

  console.log("users", users);
  // console.log(x);
  // getUsers();
  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="">
      <Header />
      <Balance />
      <Container className="mt-4 px-3 flex flex-col gap-5 ">
        <div className=" flex-col flex gap-2">
          <div className="font-bold text-2xl">Users</div>
          <input
            type="text"
            className=" font-semibold border-2 w-full p-2 rounded-lg focus:outline-1"
            placeholder="Search Users..."
          />
        </div>
        <div className="flex flex-col gap-5">
          {users.map((user) => (
            <UserRow data={user} key={user._id} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export { Dashboard };
