const express = require("express");
const router = express.Router();
const { authorisedUser } = require("./../../common/token");
const { subscribe } = require("./../../controllers/frontend/membership");

router.post("/subscribe", authorisedUser, subscribe);

module.exports = router;
