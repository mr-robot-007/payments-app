import { Button } from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";

function UserRow() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4  items-center font-bold text-xl">
        <div className="bg-gray-200 p-3 rounded-full ">{<FaUserAlt />}</div>
        <h2>User 1</h2>
      </div>
      <Button className="bg-black text-white p-3 rounded-xl">Send Money</Button>

    </div>
  );
}

export default UserRow;
