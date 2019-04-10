const rateStandardModel = require("../../models/rateStandard");
/* -------------Get All Standard Rate------------ */
const getAllStandardRate = async (req, res) => {
  try {
    let $data = req.body;
    const getAllStdRate = await rateStandardModel.find({ parentId: $data.parentId });
    if (getAllStdRate) {
      if (getAllStdRate.length) {
        return res.status(200).json({
          responsecode: 200,
          success: true,
          data: getAllStdRate
        });
      }
    } else {
      return res.status(400).json({
        responsecode: 200,
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -------------Get All Roles End------------ */

module.exports = {
  getAllStandardRate
};
