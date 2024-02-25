import { Button } from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";
import Modal from "../ui/Modal";
import { SendMoney } from "../pages/SendMoney";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../hooks/useUser";

const colors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-orange-500",
  "bg-yellow-500",
];

function UserRow({ data: { firstname, lastname, username, _id: id } }) {
  const { userInfo, isLoading } = useUser();
  // console.log(data);

  const color_index = Math.floor(Math.random() * 5);
  const bg = colors[color_index];
  if (isLoading) return <div>Loading...</div>;
  if (id === userInfo._id) return null;

  return (
    <div className="flex justify-between items-center ${bg} p-4 rounded-lg hover:shadow-md">
      <div className="flex gap-4  items-center font-bold text-xl">
        <div className={`${bg} p-3 rounded-full `}>{<FaUserAlt />}</div>
        <div>
          <h2>
            {firstname} {lastname}
          </h2>
          <p className="text-blue-400 text-xs sm:text-sm">{username}</p>
        </div>
      </div>
      <Modal>
        <Modal.Open opens="sendmoney">
          <Button
            opens="sendmoney"
            className="bg-black text-white p-3 rounded-xl hover:bg-gray-500 transition-all hover:p-4"
          >
            Send Money
          </Button>
        </Modal.Open>
        <Modal.Window name="sendmoney">
          <SendMoney
            id={id}
            name={`${firstname} ${lastname}`}
            username={username}
          />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default UserRow;
