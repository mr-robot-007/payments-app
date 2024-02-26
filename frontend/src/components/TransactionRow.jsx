import { FaUserAlt } from "react-icons/fa";

const colors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-orange-500",
  "bg-yellow-500",
];
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function TransactionRow({ data }) {
  const {
    counterpartyName: name,
    transactionType: type,
    date,
    time,
    amount,
  } = data;
  const color_index = Math.floor(Math.random() * 5);
  const bg = colors[color_index];
  return (
    <div className="flex justify-between items-center ${bg} p-4 rounded-lg hover:shadow-md  border-b-2">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-4  items-center font-bold text-md">
          <div className={`${bg} p-3 rounded-full `}>{<FaUserAlt />}</div>
          <div>
            <h2>{name || "Test User"}</h2>
            <p className="text-blue-500 font-normal text-xs sm:text-sm">
              {capitalizeFirstLetter(type)} {time} {date}
            </p>
          </div>
        </div>
        <div
          className={`text-md font-semibold flex items-center  ${
            type === "sent" ? "text-red-500" : "text-green-500"
          }`}
        >
          <span className="mb-1">{type === "sent" ? "-" : ""}</span>
          {type === "sent" ? amount : "+" + amount}
          {/* {amount} */}
        </div>
      </div>
    </div>
  );
}

export default TransactionRow;
