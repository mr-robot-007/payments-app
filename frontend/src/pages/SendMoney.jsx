import { Button } from "react-bootstrap";
import Modal, { ModalContext } from "../ui/Modal";
import Heading from "../ui/Heading";
import axios from "axios";
import { FaSubscript, FaUserAlt } from "react-icons/fa";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useBalance } from "../hooks/useBalance";

const backendurl = import.meta.env.VITE_BACKEND_URL;

const SendMoney = function ({ id, name, username }) {
  const { balance, isLoadingBalance } = useBalance();
  const [amount, setAmount] = useState(null);
  const queryClient = useQueryClient();
  const { close } = useContext(ModalContext);

  async function handleClick(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendurl}/api/v1/account/transfer`,
        {
          to: id,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Transfer Successfull.");
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      close();
    } catch (err) {
      console.log(err);
      toast.error(`Oops! Transfer failed \n ${err.response.data.message}`);
      // console.log("response data", response.data.message);
    }
  }

  return (
    <>
      <div className="  sm:p-10 w-full sm:w-[30rem]  flex flex-col gap-3 sm:h-full">
        <h1 className="text-4xl font-extrabold mb-10 text-center">
          Send Money
        </h1>
        <div className="flex gap-2 items-center text-2xl font-bold">
          <div className="bg-green-400  rounded-full  p-3">
            <FaUserAlt className="" />
          </div>
          <div className="flex flex-col gap-0 items-center">
            <h3 className="sm:text-3xl text-lg">{name}</h3>
            <span className="font-light sm:text-sm text-xs text-blue-600 px-1">
              {username}
            </span>
          </div>
        </div>
        <h4 className="font-bold">Amount (in Rs.) </h4>
        <input
          type="text"
          placeholder="Enter amount"
          className="border-2 p-2 rounded-lg"
          onChange={(e) => setAmount(e.target.value)}
        />
        <p className={` ${amount > balance ? "block" : "hidden"} text-red-500`}>
          Insufficient Balance
        </p>
        <button
          className={`w-full bg-green-500 p-2 text-xl text-white rounded-lg disabled:bg-gray-400`}
          onClick={(e) => handleClick(e)}
          disabled={Number(amount) > balance}
        >
          Initiate transfer
        </button>
      </div>
    </>
  );
};

export { SendMoney };
