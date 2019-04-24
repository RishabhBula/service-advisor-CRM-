const express = require("express");
const router = express.Router();
const { add, getList } = require("./../../controllers/frontend/parts");
router.get("/", getList);
router.post("/", add);
module.exports = router;
