const matrixModel = require("../../models/priceMatrix");
/* -------------Get All Price Metrices------------ */
const getAllMatrix = async (req, res) => {
  try {
    let $data = req.body;
    const matrices = await matrixModel.find({ parentId: $data.parentId });
    return res.status(200).json({
      responsecode: 200,
      success: true,
      data: matrices
    });
  } catch (error) {
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -------------Get All Price Metrices End------------ */

module.exports = {
  getAllMatrix
};
