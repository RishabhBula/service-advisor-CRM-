module.exports = {
  user: require("./user"),
  auth: require("./authRoute"),
  role: require("./rolesRoutes"),
  vehicle: require("./vehicleRoutes"),
  fleet: require("./fleetRoutes"),
  matrix: require("./matrixRoutes"),
  labour: require("./labourRoutes"),
  customer: require("./customerRoutes"),
  vendor: require("./vendorRoutes"),
  tier: require("./tierRoutes"),
  inventory: require("./inventory"),
  inventoryStat: require("./inventoryStats"),
  order: require("./orderRoutes"),
  service: require("./serviceRoutes")
};
