const matrixModel = require("../../models/priceMatrix");
const commonValidation = require("../../common");
const { validationResult } = require("express-validator/check");

/*Add New Price Matrix*/
const createpriceMatrix = async (req, res) => {
  const { body, currentUser } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    if (currentUser.parentId === null || currentUser.parentId === "undefined") {
      currentUser.parentId = currentUser.id
    }
    const newPriceMatrixData = {
      martrixName: body.martrixName,
      matrixRange: body.matrixRange,
      parentId: currentUser.parentId,
      userId: currentUser.id,
      status: true,
      isDeleted: false
    };
    const matrixData = new matrixModel(newPriceMatrixData)
    const result = matrixData.save();
    return res.status(200).json({
      responsecode: 200,
      message: "Price matrix added successfully!",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/*Add New Price Matrix End*/

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
  createpriceMatrix,
  getAllMatrix,
};
