import { Container } from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import UserRow from "../components/UserRow";
import Balance from "../components/Balance";
import Header from "../components/Header";
import Friends from "../components/Friends";
import Transactions from "../components/Transactions";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

// async function getUsers() {
//   const response = await axios.get("http://localhost:3000/api/v1/user/bulk");
//   // console.log(response.data);
//   return response.data.user;
// }

function Dashboard() {
  // const { data: users, isLoading } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: getUsers,
  // });

  const [showTransactions, setShowTrasactions] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search");
  // console.log("users", users);
  // // console.log(x);
  // // getUsers();
  // if (isLoading) {
  //   return <div>Loading</div>;
  // }

  function handleChange(value) {
    setSearchParams({ search: value });
  }

  return (
      <div className="">
        <Header />
        <Balance />
        <Container className="mt-4  flex flex-col gap-5 h-full ">
          <div className=" flex-col flex gap-2 px-3">
            <div className="font-bold text-2xl flex justify-evenly gap-2">
              <button
                onClick={() => setShowTrasactions(false)}
                className={`${
                  !showTransactions ? "bg-blue-400 " : "bg-gray-200"
                } w-full text-center rounded-lg`}
              >
                Friends
              </button>
              <button
                onClick={() => setShowTrasactions(true)}
                className={`${
                  showTransactions ? "bg-blue-200 " : "bg-gray-200"
                } w-full text-center rounded-lg`}
              >
                Transactions
              </button>
            </div>
            <div className="flex items-center border-2 w-full justify-center rounded-lg p-1">
              <input
                type="text"
                className=" font-semibold border-0 w-full px-2 py-1  focus:outline-none rounded-lg mt-1"
                placeholder="Search Users..."
                value={searchParams.get("search")}
                onChange={(e) => handleChange(e.target.value)}
              />
              {search && (
                <RxCross2
                  className="m-2 text-2xl"
                  onClick={() => handleChange("")}
                />
              )}
            </div>
          </div>
          {showTransactions ? <Transactions /> : <Friends />}
        </Container>
      </div>
  );
}

export { Dashboard };
