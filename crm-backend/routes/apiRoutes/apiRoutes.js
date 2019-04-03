const express = require("express");
const router = express.Router();

const { user, auth } = require("./index");

router.use("/auth", auth);
router.use("/user", user);

module.exports = router;