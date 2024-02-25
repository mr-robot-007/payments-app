import { useQuery } from "@tanstack/react-query";
import Balance from "./Balance";
import axios from "axios";
import UserRow from "./UserRow";

async function getUsers() {
  const response = await axios.get("http://localhost:3000/api/v1/user/bulk");
  // console.log(response.data);
  return response.data.user;
}
function Container() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUsers,
  });
//   if (isLoading) {
//     return null;
//   }

  return (
    <>
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
          {/* {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
            <UserRow key={num} />
          ))} */}
          {users.map((user) => (
            <UserRow data={user} key={user._id} />
          ))}
        </div>
      </Container>
    </>
  );
}

export default Container;
