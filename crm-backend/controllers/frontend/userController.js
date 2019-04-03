const userModel = require("../../models/user");
const roleModel = require("../../models/role");


const listGet = async (req,res) => {
    try {        
        let inserList = {
          email: "rahulk.chapter247@gmail.com",
          password: "123456",
          roleType: "5ca3473d70537232f13ff1f9"
        };
        // let data = await new user.()
        let result = await userModel(inserList).save();
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
          result: result
        });

        // return res.status(200).json({
        //   result: roleUpdate
        // });


    
    }
    catch (error) {
        console.log(error);
        
         return res.status(400).send({ msg: error });
    }
    

    
   
}

module.exports = {
    listGet
}