import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const backendurl = import.meta.env.VITE_BACKEND_URL;

async function getBalance() {
  // console.log(localStorage.getItem("token"));
  try {
    const response = await axios.get(
      `${backendurl}/api/v1/account/transactions`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // console.log(response.data);
    return response.data.transactions || "";
  } catch (err) {
    console.error("Error making Axios request:", err);
    return "";
  }
}

function useTransactions() {
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: getBalance,
  });
  return { transactions, isLoadingTransactions };
}

export { useTransactions };
