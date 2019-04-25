const express = require("express");
const router = express.Router();
const { add } = require("./../../controllers/frontend/parts");
router.get("/", (req, res) => {
  return res.json({
    test: "fadsf"
  });
});
router.post("/", add);
module.exports = router;
