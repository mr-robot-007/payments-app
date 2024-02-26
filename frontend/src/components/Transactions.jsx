import { useTransactions } from "../hooks/useTransactions";
import TransactionRow from "./TransactionRow";
import Spinner from "../ui/Spinner";
import { useSearchParams } from "react-router-dom";
function Transactions() {
  const { transactions = [], isLoadingTransactions } = useTransactions();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  if (isLoadingTransactions) {
    return <Spinner />;
  }
  const searchUser = search.toLowerCase();
  const filterdTransactions = transactions?.filter((item) => {
    return item.counterpartyName?.toLowerCase().includes(searchUser);
  });

  // console.log(filterdTransactions);
  return (
    <div className="flex flex-col gap-5 sm:overflow-y-scroll">
      {filterdTransactions.toReversed().map((trans) => (
        <TransactionRow data={trans} key={trans._id} />
      ))}
    </div>
  );
}

export default Transactions;
