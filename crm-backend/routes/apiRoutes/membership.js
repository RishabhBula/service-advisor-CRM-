const express = require("express");
const router = express.Router();
const { authorisedUser } = require("./../../common/token");
const {
  SubscribeMembershipValidations
} = require("./../../common/apiValidation");
const { subscribe } = require("./../../controllers/frontend/membership");

router.post(
  "/subscribe",
  SubscribeMembershipValidations,
  authorisedUser,
  subscribe
);

module.exports = router;
