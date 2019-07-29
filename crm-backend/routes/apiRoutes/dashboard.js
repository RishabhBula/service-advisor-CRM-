const express = require("express");
const router = express.Router();
const { authorisedUser } = require("./../../common/token");
const {
  getOverview,
  customerSales
} = require("./../../controllers/frontend/dashboard");

//
router.get("/overview", authorisedUser, getOverview);
router.get("/customers-sales", authorisedUser, customerSales);

//
module.exports = router;
