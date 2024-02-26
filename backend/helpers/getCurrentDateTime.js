function getCurrentDateTime() {
  const currentDate = new Date();

  // Format the date as {DD-Mon-YYYY}
  const optionsDate = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", optionsDate);

  // Format the time as {HH:MM}
  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedTime = currentDate.toLocaleTimeString("en-US", optionsTime);

  return {
    formattedDate,
    formattedTime,
  };
}

module.exports = { getCurrentDateTime };
