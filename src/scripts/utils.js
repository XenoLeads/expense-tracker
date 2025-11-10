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

export default {
  capitalize,
};
