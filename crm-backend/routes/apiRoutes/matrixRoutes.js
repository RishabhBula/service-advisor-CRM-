const express = require("express");
const router = express.Router();
const matrixController = require("../../controllers/frontend/matrixController");
const token = require("../../common/token");

/* ----------Add New Fleet------------ */
router.post("/getAllMatrix", token.authorisedUser, matrixController.getAllMatrix);

module.exports = router;
