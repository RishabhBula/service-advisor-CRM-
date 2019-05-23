const Orders = require("../../models/order");
const OrderStatus = require("../../models/orderStatus");
const { defaultOrderStatus } = require("./../../data");
const mongoose = require("mongoose");

/* get order number */
const countOrderNumber = async (req, res) => {
  try {
    const result = await Orders.countDocuments();
    return res.status(200).json({
      orderId: parseInt(result) + 1,
      success: true
    });
  } catch (error) {
    console.log("this is order count error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/* create new order */
const createNewOrder = async (req, res) => {
  const { body, currentUser } = req;
  try {
    const orderConst = {
      orderName: body.orderName,
      customerId: mongoose.Types.ObjectId(body.customerId),
      vehicleId: mongoose.Types.ObjectId(body.vehicleId),
      serviceId: body.serviceId,
      inspectionId: body.inspectionId,
      timeClockId: body.timeClockId
        ? mongoose.Types.ObjectId(body.timeClockId)
        : null,
      messageId: body.messageId
        ? mongoose.Types.ObjectId(body.messageId)
        : null,
      userId: currentUser.id,
      parentId: currentUser.parrentId ? currentUser.parrentId : currentUser.id,
      workflowStatus: body.workflowStatus,
      isDeleted: false
    };
    const orderData = new Orders(orderConst);
    await orderData.save();

    return res.status(200).json({
      message: "Order created successfully",
      success: true
    });
  } catch (error) {
    console.log("this is create order error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/**
 * Owner: Sonu
 * Created: 21-05-2019 16:53
 * @param req
 * @param res
 * @returns []
 */
const listOrders = async (req, res) => {
  try {
    const { currentUser } = req;
    const { id, parentId } = currentUser;
    const condition = {
      $or: [
        {
          isDeleted: false
        },
        {
          isDeleted: {
            $exists: false
          }
        }
      ],
      parentId: parentId ? parentId : id
    };
    const result = await Orders.find(condition).populate(
      "customerId vehicleId serviceId inspectionId"
    );
    let orderStatus = await OrderStatus.find(condition, {
      name: 1,
      isInvoice: 1
    });
    if (!orderStatus.length) {
      defaultOrderStatus.forEach(e => {
        e.parentId = condition.parentId;
      });
      await OrderStatus.insertMany(defaultOrderStatus);
      orderStatus = await OrderStatus.find(condition, {
        name: 1,
        isInvoice: 1
      });
    }
    let response = {};
    result.forEach(element => {
      const { workflowStatus: status } = element;
      if (!response[status]) {
        response[status] = [element];
      } else {
        response[status].push(element);
      }
    });
    return res.status(200).json({
      message: "Data fetched successfully",
      data: response,
      orderStatus
    });
  } catch (error) {
    console.log("Erroe while fetching list of orders", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

module.exports = {
  countOrderNumber,
  createNewOrder,
  listOrders
};
