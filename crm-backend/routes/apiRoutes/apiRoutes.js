const express = require("express");
const router = express.Router();

const { user, auth, role, vehicle, fleet, matrix, labour } = require("./index");

router.use("/auth", auth);
router.use("/user", user);
router.use("/role", role);
router.use('/vehicle', vehicle);
router.use("/fleet", fleet);
router.use("/matrix", matrix);
router.use("/labour", labour);

module.exports = router;