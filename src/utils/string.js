export const capitalize = (str) => {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const getFirstTwoLetters = (fullName) => {
  if (!fullName) return "-";
  let shortName = fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  if (shortName.length !== 2) {
    fullName[0].slice(0, 2);
  }

  return shortName;
};
