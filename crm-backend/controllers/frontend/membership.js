// const { StripeAPIKey } = require("./../../config/app");
// const stripe = require("stripe")(StripeAPIKey);

const subscribe = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Subscribed Successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
module.exports = { subscribe };
