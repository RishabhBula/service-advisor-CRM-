const userModel = require("../../models/user");
const {
  validationMessage,
  otherMessage,
} = require("../../common/validationMessage");
const commonSmtp = require("../../common/index");
const commonCrypto = require("../../common/crypto");
const { Email, AvailiableTemplates } = require("../../common/Email");

const listGet = async (req, res) => {
  try {
    let inserList = {
      firstName: "General",
      fleet: "5ca5e3b88b27f17bc0dfaab5",
      permission: [
        {
          shouldReceiveDiscount: {
            status: false,
            percentageDiscount: 0,
          },
          shouldLaborRateOverride: {
            status: false,
            laborRate: "5ca5e2f1a7d08f79f78c8e41",
          },
          shouldPricingMatrixOverride: {
            status: false,
            pricingMatrix: null,
          },
        },
      ],
      parentId: "5ca5d6f69c6c9f6cb63d919a",
    };
    // let data = await new user.()
    let result = await customerModel(inserList).save();
    // let roleUpdate = await roleModel.updateOne(
    //   {
    //     userType: "user"
    //   },
    //   {
    //     $set: {
    //       permissionObject: [
    //         {
    //           isAllowedDashboard: false,
    //           isAllowedWorkflow: true,
    //           isAllowedCalendar: true,
    //           isAllowedInventory: true,
    //           isAllowedTimesheets: true,
    //           isAllowedReportCenter: false,
    //           isAllowedCompanySettings: false,
    //           isIncludedToCalendar: true,
    //           isAllowedViewEveryonesCalendar: false,
    //           isAllowedTimeclock: true,
    //           isAllowedManualTimesheets: false,
    //           isAllowedInspections: false,
    //           isAllowedCannedJobs: false,
    //           isAllowedPricingMatrices: false,
    //           isAllowedMessagingCustomers: true,
    //           isPreventEditingUponAuthorize: false,
    //           isPreventEditingUponInvoice: false,
    //           isFilteredWorkflowByTechnician: false,
    //           isAllowedProfitability: false,
    //           isNotifyJobAssigned: true,
    //           isNotifyOrderAuthorized: false,
    //           isNotifyCustomerSendsMessage: false,
    //           isNotifyCustomerMakesPayment: false,
    //           isNotifyChangeAppointmentStatus: false
    //         }
    //       ]
    //     }
    //   }
    // );

    return res.status(200).json({
      result: result,
    });

    // return res.status(200).json({
    //   result: roleUpdate
    // });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: error });
  }
};

/* ----------------Grt All User List------------ */
const getAllUserList = async (req, res) => {
  const { query } = req
  try {
    if (!query.parentId) {
      return res.status(400).json({
        responsecode: 400,
        message: "Parrent id not provided",
        success: false
      })
    }
    const getAllUser = await userModel.find({ parentId: query.parentId })
    if (getAllUser) {
      return res.status(200).json({
        responsecode: 200,
        data: getAllUser,
        success: true
      })
    } else {
      return res.status(400).json({
        responsecode: 400,
        message: "User not found",
        success: false
      })
    }
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
}
/* ----------------Grt All User List End------------ */
module.exports = {
  listGet,
  getAllUserList
};
