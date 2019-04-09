const matrixModel = require("../../models/priceMatrix");
const userModel = require("../../models/user");
/* -------------Get All Roles------------ */
const getAllMatrix = async (req, res) => {
  try {
    let $data = req.body;    
    const getAllMatrix = await matrixModel.find({parentId: $data.parentId});
    if (getAllMatrix) {
      if (getAllMatrix.length) {
        return res.status(200).json({
          responsecode: 200,
          success: true,
          data: getAllMatrix
        });
      }
    } else {
      return res.status(400).json({
        responsecode: 200,
        success: false,
      });
    }
  } catch (error) {
      res.status(500).json({
        responsecode: 500,
        message: error.message ? error.message : "Unexpected error occure.",
        success: false,
    });
  }
};
/* -------------Get All Roles End------------ */

module.exports = {
  getAllMatrix
};
