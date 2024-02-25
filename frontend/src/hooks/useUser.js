import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function getUser() {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.user_info;
  } catch (err) {
    console.log("error occured while fetching user info");
  }
}

export function useUser() {
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["user_info"],
    queryFn: getUser,
  });
  return { userInfo, isLoading };
}
