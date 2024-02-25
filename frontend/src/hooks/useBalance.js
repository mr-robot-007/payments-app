import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function getBalance() {
  // console.log(localStorage.getItem("token"));
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/account/balance",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // console.log(response.data);
    return response.data.balance || "";
  } catch (err) {
    console.error("Error making Axios request:", err);
    return "";
  }
}

function useBalance() {
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["balance"],
    queryFn: getBalance,
  });
  return { balance, isLoadingBalance };
}

export { useBalance };
