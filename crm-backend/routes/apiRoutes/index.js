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
  service: require("./serviceRoutes"),
  inspection: require("./inspectionRoutes"),
  label: require("./labelRoutes"),
  googleCaptcha: require("./googleCaptchaRoutes"),
  messageChat: require("./messageChatRoutes"),
  timeClock: require("./timeClockRoutes"),
  userActivity: require("./userActivityRoutes"),
  payment: require("./paymentRoutes"),
  memberShipRoutes: require("./membership"),
  webhookRoutes: require("./webhook"),
  appointmentRoutes: require("./appointments"),
  dashboardRoutes: require("./dashboard"),
  reportRoutes: require("./reports"),
  homePageRoutes: require("./homePage"),
  siteSettingRoutes: require("./siteSettingsRoutes")
};
