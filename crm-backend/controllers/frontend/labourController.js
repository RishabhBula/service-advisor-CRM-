const rateStandardModel = require("../../models/rateStandard");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator/check");
const commonValidation = require("../../common/index");
/* -------------Get All Standard Rate------------ */
const getAllStandardRate = async (req, res) => {
  try {
     let $data = req.query;
      let condition = {};
   
    const getAllStdRate = await rateStandardModel.find({parentId: mongoose.Types.ObjectId($data.parentId)});
    if (getAllStdRate) {     
        return res.status(200).json({
          responsecode: 200,
          success: true,
          data: getAllStdRate,
        });
      
    } else {
      return res.status(400).json({
        responsecode: 200,
        success: false,
      });
    }  
  } catch (error) {
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/* -------------Get All Roles End------------ */

/* -------------Add Rate Standard ------------ */
const addNewrateStandard = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false,
    });
  }
  try {
    const newRateData = {
      name: body.name,
      hourlyRate: body.hourlyRate,
      parentId: body.parentId,
      userId: body.userId,
      status: true,
    };
    const addNewRateData = new rateStandardModel(newRateData);
    const result = await addNewRateData.save();
    if (!result) {
      return res.status(400).json({
        message: "Error adding rate standard",
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "Rate standard added successfully!.",
        success: false,
      });
    }
  } catch (error) {
    console.log("*************This is add rate standard error", error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/* -------------Add Rate Standard End------------ */

module.exports = {
  getAllStandardRate,
  addNewrateStandard,
};
