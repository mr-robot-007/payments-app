import { useBalance } from "../hooks/useBalance";

function Balance() {
  const { balance, isLoadingBalance } = useBalance();
  return (
    <div className="font-bold text-2xl px-3 mt-4">
      Your Balance : ₹ {isLoadingBalance ? "Loading..." : Math.floor(balance)}
    </div>
  );
}

export default Balance;
