function capitalize(string) {
  return (
    string[0].toUpperCase() +
    string
      .slice(1)
      .split("")
      .map(char => char.toLowerCase())
      .join("")
  );
}

export default {
  capitalize,
};
