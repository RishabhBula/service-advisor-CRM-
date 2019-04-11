const rateStandardModel = require("../../models/rateStandard");
const mongoose = require("mongoose");
/* -------------Get All Standard Rate------------ */
const getAllStandardRate = async (req, res) => {
  console.log('====================================');
  console.log("sdfsdf");
  console.log('====================================');
  try {
     let $data = req.query;
      let condition = {};
   
    const getAllStdRate = await rateStandardModel.find({parentId: mongoose.Types.ObjectId($data.parentId)});
    console.log('=========d===========================');
    console.log(getAllStdRate, $data.parentId);
    console.log('====================================');
    if (getAllStdRate) {     
        return res.status(200).json({
          responsecode: 200,
          success: true,
          data: getAllStdRate
        });
      
    } else {
      return res.status(400).json({
        responsecode: 200,
        success: false
      });
    }  
  } catch (error) {
    return res.status(500).json({
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
