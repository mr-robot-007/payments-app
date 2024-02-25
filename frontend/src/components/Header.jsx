import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import { useUser } from "../hooks/useUser";
import { TbLogout } from "react-icons/tb";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useOutsideClick from "../hooks/useOutsideClick";

function Sidebar({ logout }) {
  return (
    <div className=" absolute  w-[55%] right-2 mt-2 z-20 text-center  p-6 bg-white rounded-lg border-2 flex flex-col gap-2">
      <button className="bg-gray-100 p-2 rounded-lg font-semibold hover:p-3 hover:bg-gray-200">
        My Account
      </button>
      <button
        className="bg-gray-100 p-2 rounded-lg font-semibold hover:p-3 hover:bg-gray-200"
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { userInfo, isLoading } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ref = useOutsideClick();

  function handleClick() {
    localStorage.removeItem("token");
    toast.success("User logged out.");
    queryClient.invalidateQueries([])
    navigate("/signin");
    
  }

  return (
    <>
      <header className="flex justify-between sm:px-3 sm:py-4 px-1 py-2  bg-gray-300">
        <h1 className="font-bold sm:text-3xl text-2xl">Payments App</h1>
        <div className="flex gap-4 text-xl font-bold items-center sm:px-2 px-1">
          <div>
            <div className="text-right text-lg sm:text-2xl">
              Hello, {isLoading ? "Loading..." : userInfo.firstname}
            </div>
            <p className="sm:text-sm text-xs text-blue-500">
              {isLoading ? "Loading..." : userInfo.username}
            </p>
          </div>
          <div className="bg-cyan-400 sm:p-3 p-2 rounded-full">
            {<FaUserAlt onClick={() => setOpen((x) => !x)} />}
          </div>
          <TbLogout
            className="text-3xl sm:block hidden"
            onClick={() => handleClick()}
            ref={ref}
          />
        </div>
      </header>
      {open && <Sidebar logout={handleClick} />}
    </>
  );
}

export default Header;
