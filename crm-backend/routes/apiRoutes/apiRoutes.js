const express = require("express");
const router = express.Router();

const { user, auth, role, vehicle } = require("./index");

router.use("/auth", auth);
router.use("/user", user);
router.use("/role", role);
router.use('/vehicle', vehicle);

module.exports = router;