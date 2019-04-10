const customerModel = require("../../models/customer");

const { otherMessage } = require("../../common/validationMessage");

/*----------------Customer create by admin/staff------------------ */
const createCustomer = async (req, res) => {
  try {
    const { body } = req;
    const fleetData = {
      firstName: body.firstName,
      lastName: body.lastName,
      phoneDetail: body.phoneDetail,
      email: body.email,
      notes: body.notes,
      companyName: body.companyName,
      referralSource: body.referralSource,
      fleet: body.fleetId,
      address1: body.address1,
      address2: body.address2,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      permission: body.permission,
      parentId: body.parentId,
      userId: body.userId,
      status: true,
    };

    let result = await customerModel(fleetData).save();
    if (result) {
      return res.status(200).json({
        message: otherMessage.newCustomer,
        success: true,
      });
    } else {
      return res.status(400).json({
        result: result,
        message: "Error in inserting Customer.",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

module.exports = {
  createCustomer,
};
