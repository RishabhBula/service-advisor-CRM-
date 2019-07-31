const AppointmentModal = require("../../models/appointment");
const Mongoose = require("mongoose");
const { Email, AvailiableTemplates } = require("../../common/Email");
const { sendSMS } = require("./../../common/SMS");
const moment = require("moment");
/**
 *
 */
const appointmentList = async (req, res) => {
  try {
    const { currentUser, query } = req;
    const { id, parentId } = currentUser;
    const vehicleId = query.vehicleId
    const customerId = query.customerId
    let condition = {};
    condition["$and"] = [
      {
        $or: [
          {
            userId: Mongoose.Types.ObjectId(id)
          },
          {
            parentId: Mongoose.Types.ObjectId(parentId)
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
      }
    ];
    if (vehicleId) {
      condition["$and"].push({
        vehicleId: Mongoose.Types.ObjectId(vehicleId)
      })
    }
    if (customerId) {
      condition = {
        $and: {
          customerId: Mongoose.Types.ObjectId(customerId)
        }
      }
    }
    const result = await AppointmentModal.find(condition);
    res.status(200).json({
      message: "Appointment list successful.",
      data: result
    });
  } catch (error) {
    console.log("this is appointmentList error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const addAppointment = async (req, res) => {
  try {
    const { body, currentUser } = req;
    const { id, parentId } = currentUser;
    const {
      appointmentTitle,
      selectedColor: appointmentColor,
      appointmentDate,
      selectedCustomer: customerId,
      startTime,
      endTime,
      note,
      selectedVehicle: vehicleId,
      selectedOrder: orderId,
      phone,
      email,
      techinicians,
      isEmail,
      isSms
    } = body;
    const actualStartTime = new Date().setHours(parseInt(startTime.split()[0]));
    const actualEndTime = new Date().setHours(parseInt(endTime.split()[0]));
    let dataToSave = {
      appointmentTitle,
      appointmentColor,
      appointmentDate,
      customerId,
      startTime: actualStartTime,
      endTime: actualEndTime,
      note,
      phone,
      email,
      sendEmail: isEmail,
      sendMessage: isSms,
      parentId: parentId || id,
      userId: id,
      techinicians
    };
    if (vehicleId) {
      dataToSave.vehicleId = Mongoose.Types.ObjectId(vehicleId);
    }
    if (orderId) {
      dataToSave.orderId = Mongoose.Types.ObjectId(orderId);
    }
    const result = await AppointmentModal.create(dataToSave);
    /* notify via sms */
    if (isSms) {
      await sendSMS(phone, "Hello", id);
    }
    if (isEmail) {
      const emailVar = new Email(body);
      const scheduledDate = moment(appointmentDate).format("lll")
      await emailVar.setSubject("[Service Advisor]" + `Appointment scheduled on ${scheduledDate}`);
      const message = `Your appointment has been scheduled for ${appointmentTitle}`
      await emailVar.setTemplate(AvailiableTemplates.INSPECTION_TEMPLATE, {
        body: message,
        orderTitle: "Payment Info",
        createdAt: scheduledDate,
        companyName: "Fix It All",
        titleMessage: "Your appointment has been scheduled for",
        displayStyle: `style="text-align:center; display: none";`
      });
      await emailVar.sendEmail(email);
    }
    /* notify via sms */
    res.status(200).json({
      message: "Appointment added successfully.",
      data: result
    });
  } catch (error) {
    console.log("this is appointmentList error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const getAppointmentDetails = async (req, res) => {
  try {
    const { params, currentUser } = req;
    const { id, parentId } = currentUser;
    const { eventId } = params;
    const details = await AppointmentModal.findOne({
      _id: Mongoose.Types.ObjectId(eventId),
      $and: [
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
          $or: [
            {
              userId: Mongoose.Types.ObjectId(id)
            },
            {
              parentId: Mongoose.Types.ObjectId(parentId)
            }
          ]
        }
      ]
    }).populate("customerId vehicleId orderId techinicians");
    res.status(200).json({
      message: "Appointment details successfully.",
      data: details
    });
  } catch (error) {
    console.log("this is appointmentList error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const updateAppointment = async (req, res) => {
  try {
    const { body, currentUser, params } = req;
    const { eventId: appointmentId } = params;
    const { id, parentId } = currentUser;
    const {
      appointmentTitle,
      selectedColor: appointmentColor,
      appointmentDate,
      selectedCustomer: customerId,
      startTime,
      endTime,
      note,
      selectedVehicle: vehicleId,
      selectedOrder: orderId,
      phone,
      email,
      sendEmail,
      sendMessage,
      techinicians
    } = body;
    const actualStartTime = new Date().setHours(parseInt(startTime.split()[0]));
    const actualEndTime = new Date().setHours(parseInt(endTime.split()[0]));
    let dataToSave = {
      appointmentTitle,
      appointmentColor,
      appointmentDate,
      customerId,
      startTime: actualStartTime,
      endTime: actualEndTime,
      note,
      phone,
      email,
      sendEmail,
      sendMessage,
      parentId: parentId || id,
      userId: id,
      techinicians
    };
    if (vehicleId) {
      dataToSave.vehicleId = Mongoose.Types.ObjectId(vehicleId);
    }
    if (orderId) {
      dataToSave.orderId = Mongoose.Types.ObjectId(orderId);
    }
    const result = await AppointmentModal.updateOne(
      { _id: Mongoose.Types.ObjectId(appointmentId) },
      {
        $set: dataToSave
      }
    );

    res.status(200).json({
      message: "Appointment updated successfully.",
      data: result
    });
  } catch (error) {
    console.log("this is appointmentList error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
module.exports = {
  appointmentList,
  addAppointment,
  getAppointmentDetails,
  updateAppointment
};
