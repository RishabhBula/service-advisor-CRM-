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
  inventoryStat
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
router.use("/inventoryStat", inventoryStat);

module.exports = router;
