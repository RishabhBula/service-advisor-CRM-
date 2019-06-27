const express = require("express");

const router = express.Router();

const {
  user,
  auth,
  role,
  vehicle,
  fleet,
  matrix,
  labour,
  customer,
  vendor,
  tier,
  inventory,
  inventoryStat,
  order,
  service,
  inspection,
  label,
  googleCaptcha,
  messageChat,
  timeClock
} = require("./index");

router.use("/auth", auth);
router.use("/user", user);
router.use("/role", role);
router.use("/vehicle", vehicle);
router.use("/fleet", fleet);
router.use("/matrix", matrix);
router.use("/labour", labour);
router.use("/customer", customer);
router.use("/vendor", vendor);
router.use("/tier", tier);
router.use("/inventory", inventory);
router.use("/inventoryStat", inventoryStat);
router.use("/order", order);
router.use("/service", service);
router.use("/inspection", inspection);
router.use("/label", label);
router.use("", googleCaptcha);
router.use("/message", messageChat);
router.use("/timeClock", timeClock);

module.exports = router;
