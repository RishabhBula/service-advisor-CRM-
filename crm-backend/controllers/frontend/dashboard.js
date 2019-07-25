const {
  OrderModel,
  CustomerModel,
  VehicleModel,
  UserModel
} = require("./../../models");

/**
 *
 */
const getOverview = async (req, res) => {
  try {
    const { currentUser } = req;
    const { id, parentId } = currentUser;
    const ordercondition = {
      userId: id,
      parentId: parentId || currentUser.id,
      isDeleted: false
    };
    const technicianCondition = {
      $and: [
        {
          $or: [
            {
              parentId: id
            },
            {
              parentId: parentId || currentUser.id
            }
          ]
        },
        {
          $or: [
            {
              isDeleted: {
                $exists: false
              }
            },
            {
              isDeleted: false
            }
          ]
        },
        {
          _id: { $ne: id }
        }
      ]
    };
    const orderCount = await OrderModel.count(ordercondition);
    const customerCount = await CustomerModel.count(ordercondition);
    const vehicleCount = await VehicleModel.count(ordercondition);
    const technicianCount = await UserModel.count(technicianCondition);

    return res.status(200).json({
      data: {
        orderCount,
        customerCount,
        vehicleCount,
        technicianCount
      },
      message: "Data feched successfully."
    });
  } catch (error) {
    console.log("Error while fetching issues", error);
    return res.status(500).json({
      message: "We are having an error."
    });
  }
};
/**
 *
 */
const customerSales = async (req, res) => {
  try {
    const { currentUser } = req;
    const { id, parentId } = currentUser;
    console.log(id, parentId);

    return res.status(200).json({
      data: {},
      message: "Data feched successfully."
    });
  } catch (error) {
    console.log("Error while fetching customer sales", error);
    return res.status(500).json({
      message: "We are having an error."
    });
  }
};
/**
 *
 */
module.exports = { getOverview, customerSales };
