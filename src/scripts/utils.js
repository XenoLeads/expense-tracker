function capitalize(string, dash_replacement_character = " ") {
  return string
    .split("-")
    .map(
      segment =>
        segment[0].toUpperCase() +
        segment
          .slice(1)
          .split("")
          .map(char => char.toLowerCase())
          .join("")
    )
    .join(dash_replacement_character);
}

function format_transaction_time(iso_format) {
  if (isWithin12Hours(iso_format)) {
    const [hour, minute] = iso_format.split("T")[1].split(":");
    if (parseInt(hour) > 12) return `${parseInt(hour) - 12}:${minute} PM`;
    else return `${parseInt(hour)}:${minute} AM`;
  } else {
    const [year, month, day] = iso_format.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  }

  function isWithin12Hours(targetTime) {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    const targetDate = new Date(targetTime);

    return targetDate >= twelveHoursAgo && targetDate <= now;
  }
}

export default {
  capitalize,
  format_transaction_time,
};
