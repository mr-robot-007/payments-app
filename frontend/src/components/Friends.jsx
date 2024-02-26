import axios from "axios";
import UserRow from "../components/UserRow";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";
import { useSearchParams } from "react-router-dom";

async function getUsers() {
  const response = await axios.get("http://localhost:3000/api/v1/user/bulk");
  // console.log(response.data);
  return response.data.user;
}

function Friends() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUsers,
  });
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  if (isLoading) return <Spinner />;

  const searchUser = search.toLowerCase();
  const filteredUsers = users?.filter((item) => {
    return (
      item.username?.toLowerCase().includes(searchUser) ||
      item.firstname.toLowerCase().includes(searchUser) ||
      item.lastname.toLowerCase().includes(searchUser)
    );
  });
  return (
    <div className="flex flex-col gap-5">
      {filteredUsers.map((user) => (
        <UserRow data={user} key={user._id} />
      ))}
    </div>
  );
}

export default Friends;
