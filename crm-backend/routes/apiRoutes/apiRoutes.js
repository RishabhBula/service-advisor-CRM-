const express = require("express");
const router = express.Router();

const { user, auth, role } = require("./index");

router.use("/auth", auth);
router.use("/user", user);
router.use("/role", role);

module.exports = router;