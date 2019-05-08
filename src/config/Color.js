export const ColorOptions = [
  { color: "#FFFFFF", label: "White", value: "white" },
  { color: "#EFEFEF", label: "Silver", value: "silver" },
  { color: "#7E7E7E", label: "Gray", value: "gray" },
  { color: "#000000", label: "Black", value: "black" },
  { color: "#006090", label: "Blue", value: "blue" },
  { color: "#EB0018", label: "Red", value: "red" },
  { color: "#513911", label: "Brown", value: "brown" },
  { color: "#840026", label: "Burgundy", value: "burgundy" },
  { color: "#FFF6E6", label: "Tan", value: "tan" },
  { color: "#FCF0BF", label: "Gold", value: "gold" },
  { color: "#007520", label: "Green", value: "green" },
  { color: "#FFC63B", label: "Yellow", value: "yellow" },
  { color: "#FFC63B", label: "Orange", value: "orange" },
  { color: "#FC629B", label: "Pink", value: "pink" },
  { color: "#3D1D8E", label: "Purpule", value: "purple" },
  { color: "#E2E9EB", label: "Other", value: "other" }
];

export const carsOptions = [
  {
    value: "convertible",
    label: "Convertible",
    color: "#00B8D9",
    isFixed: true,
    icons: "../assets/img/vehicles/convertible.svg"
  },
  {
    value: "coupe",
    label: "Coupe",
    color: "#0052CC",
    disabled: true,
    icons: "convertible.svg"
  },
  {
    value: "hatchback",
    label: "HatchBack",
    color: "#5243AA",
    icons: "hatchback.svg"
  },
  {
    value: "suv",
    label: "Suv",
    color: "#FF5630",
    isFixed: true,
    icons: "suv.svg"
  },
  { value: "sedan", label: "Sedan", color: "#FF8B00", icons: "sedan.svg" },
  { value: "truck", label: "Truck", color: "#FFC400", icons: "truck.svg" },
  { value: "van", label: "Van", color: "#36B37E", icons: "van.svg" },
  { value: "wagon", label: "Wagon", color: "#00875A", icons: "wagon.svg" }
];

export const groupedOptions = [
  {
    label: "Cars",
    options: carsOptions
  }
];
