const customerModel = require("../../models/customer");
const commonValidation = require("../../common/index");
const { otherMessage } = require("../../common/validationMessage");
const { validationResult } = require("express-validator/check");
/*----------------Customer create by admin/staff------------------ */
const createCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false,
      });
    }
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

/* get all the customer list  with search */

const getAllCustomerList = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = parseInt(query.page);
    const offset = (page - 1) * limit;
    const searchValue = query.search;
    const sort = query.sort;
    const status = query.status;
    let sortBy = {};
    switch (sort) {
      case "loginasc":
        sortBy = {
          updatedAt: -1,
        };
        break;
      case "nasc":
        sortBy = {
          firstName: 1,
          lastName: 1,
        };
        break;
      case "ndesc":
        sortBy = {
          firstName: -1,
          lastName: 1,
        };
        break;
      default:
        sortBy = {
          createdAt: -1,
        };
        break;
    }
    let condition = {};
    if (status) {
      condition.status = status;
    }
    condition["$and"] = [
      {
        $or: [
          {
            parentId: currentUser.id,
          },
          {
            parentId: currentUser.parentId,
          },
        ],
      },
      {
        $or: [
          {
            isDeleted: {
              $exists: false,
            },
          },
          {
            isDeleted: false,
          },
        ],
      },
    ];

    if (searchValue) {
      condition["$and"].push({
        $or: [
          {
            firstName: {
              $regex: new RegExp(searchValue, "i"),
            },
          },
          {
            lastName: {
              $regex: new RegExp(searchValue, "i"),
            },
          },
          {
            email: {
              $regex: new RegExp(searchValue, "i"),
            },
          },
        ],
      });
    }
    const getAllCustomer = await customerModel
      .find({
        ...condition,
      })
      .sort(sortBy)
      .skip(offset)
      .limit(limit);
    const getAllCustomerCount = await customerModel.countDocuments({
      ...condition,
    });
    return res.status(200).json({
      responsecode: 200,
      data: getAllCustomer,
      totalUsers: getAllCustomerCount,
      success: true,
    });
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

/* Delete Customer */
const deleteCustomer = async ({ params }, res) => {
  try {
    const { customerId } = params;
    const data = await customerModel.findByIdAndUpdate(customerId, {
      isDeleted: true,
    });
    return res.status(200).json({
      message: "User deleted successfully!",
      data,
    });
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/* Delete Customer */

module.exports = {
  createCustomer,
  getAllCustomerList,
  deleteCustomer,
};
