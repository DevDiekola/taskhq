export const capitalize = (str: string) => {
  if (str === "") {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (str: string) => {
  if (str === "") {
    return "";
  }
  str = capitalize(str);
  if (str.includes(" ")) {
    return str.charAt(0) + str.split(" ")[1].charAt(0);
  }
  return str.charAt(0);
};

export const toTitleCase = (str: string) => {
  return str
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};
