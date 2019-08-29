const TimeClock = require("../../models/timeClock");
const UserModel = require("../../models/user");
const OrderModal = require("../../models/order");
const mongoose = require("mongoose");

const commonValidation = require("../../common");
const { validationResult } = require("express-validator/check");
const cron = require("node-cron");
const moment = require("moment");
const timeClocks = {};
/**
 *
 */
const addTimeLogs = async (req, res) => {
  const { body, currentUser } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    let startTime = body.startDateTime.split(":");
    let dateDuration;
    dateDuration = new Date(body.date);
    dateDuration.setUTCHours(parseInt(startTime[0]));
    dateDuration.setUTCMinutes(parseInt(startTime[1]));
    const startDate = dateDuration.toISOString();

    let endTime = body.endDateTime.split(":");
    let dateDurationEnd;
    dateDurationEnd = new Date(body.date);
    dateDurationEnd.setUTCHours(parseInt(endTime[0]));
    dateDurationEnd.setUTCMinutes(parseInt(endTime[1]));
    const endDate = dateDurationEnd.toISOString();

    const duration = moment(body.duration, "HH:mm:ss: A").diff(
      moment().startOf("day"),
      "seconds"
    );
    const timeLogsData = {
      type: body.type,
      technicianId: mongoose.Types.ObjectId(body.technicianId),
      startDateTime: startDate,
      endDateTime: endDate,
      activity: body.activity,
      duration: duration,
      date: body.date,
      total: body.total || 0,
      orderId: mongoose.Types.ObjectId(body.orderId),
      userId: mongoose.Types.ObjectId(currentUser.id),
      parentId: currentUser.parentId
        ? mongoose.Types.ObjectId(currentUser.parentId)
        : mongoose.Types.ObjectId(currentUser.id),
      isDeleted: false,
      notes: body.notes
    };
    const timeLogElements = new TimeClock(timeLogsData);
    await timeLogElements.save();
    const payload = [timeLogElements._id];

    await OrderModal.update(
      { _id: body.orderId },
      {
        $push: {
          timeClockId: payload
        }
      }
    );
    return res.status(200).json({
      message: "Time log added successfully!",
      success: true
    });
  } catch (error) {
    console.log("this is add Time Clock error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/**
 *
 */
const startTimer = async (req, res) => {
  const { body, currentUser } = req;
  const { technicianId, serviceId, orderId } = body;
  console.log("Time Clock Restriction", timeClocks[`${technicianId}`]);

  // if (timeClocks[`${technicianId}`]) {
  //   return res.status(400).json({
  //     message: "This technician is already working on something else."
  //   });
  // }
  const timeClock = await TimeClock.create({
    type: "timeclock",
    technicianId,
    serviceId,
    orderId,
    userId: mongoose.Types.ObjectId(currentUser.id),
    parentId: currentUser.parentId
      ? mongoose.Types.ObjectId(currentUser.parentId)
      : mongoose.Types.ObjectId(currentUser.id),
    isDeleted: false,
    startDateTime: new Date()
  });
  await UserModel.updateOne(
    {
      _id: technicianId
    },
    {
      $set: {
        currentlyWorking: {
          serviceId,
          orderId: mongoose.Types.ObjectId(orderId),
          generalService: (!serviceId && !orderId) ? true : false
        }
      }
    }
  );
  timeClocks[`${technicianId}`] = cron.schedule("* * * * * *", async () => {
    console.log("running a task every seond");
    await TimeClock.updateOne(
      {
        technicianId,
        serviceId: serviceId ? serviceId : null,
        orderId: orderId ? orderId : null,
        _id: timeClock.id
      },
      {
        $inc: {
          duration: 1
        }
      }
    );
  });
  return res.status(200).json({
    message: "Timer log started successfully!"
  });
};

/**
 *
 */
const stopTimer = async (req, res) => {
  const { body, currentUser } = req;
  const { technicianId, serviceId } = body;
  if (timeClocks[`${technicianId}`]) {
    // return res.status(400).json({
    //   message: "This technician is not working on any task."
    // });
    timeClocks[`${technicianId}`].destroy();
  }
  let result
  if (serviceId) {
    result = await TimeClock.findOne({
      technicianId: technicianId,
      serviceId: serviceId,
      userId: mongoose.Types.ObjectId(currentUser.id),
      parentId: currentUser.parentId
        ? mongoose.Types.ObjectId(currentUser.parentId)
        : mongoose.Types.ObjectId(currentUser.id),
      isDeleted: false,
      isCompleted: false
    }).populate("technicianId orderId");
  } else {
    result = await TimeClock.findOne({
      technicianId: technicianId,
      isCompleted: false
    }).populate("technicianId orderId");
  }

  /*  if (!result) {
     return res.status(400).json({
       message: "Time data not found",
       success: false
     })
   } */
  const convertedDuration = result.duration / 3600;

  await TimeClock.findByIdAndUpdate(result._id, {
    $set: {
      endDateTime: new Date(),
      total:
        parseFloat(convertedDuration) * parseFloat(result.technicianId.rate) ||
        0,
      activity: result.orderId ? `Order (#${result.orderId.orderId}) ${result.orderId
        .orderName || "N/A"}` : "General",
      isCompleted: true
    }
  });
  await UserModel.updateOne(
    {
      _id: technicianId
    },
    {
      $set: {
        currentlyWorking: {}
      }
    }
  );
  if (result.orderId) {
    await OrderModal.update(
      {
        _id: mongoose.Types.ObjectId(result.orderId._id)
      },
      {
        $push: {
          timeClockId: result._id
        }
      }
    );
  }
  return res.status(200).json({
    message: "Timer log stopped successfully!"
  });
};

/**
 *
 */
const getTimeLogByTechnician = async (req, res) => {
  try {
    const { query } = req;
    const { technicianId, serviceId, orderId } = query;
    const result = await TimeClock.findOne({
      technicianId,
      serviceId,
      orderId
    });
    return res.status(200).json({
      message: "Timer get success!",
      data: result || {}
    });
  } catch (error) {
    console.log("this is add", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const getTimeLogOfTechnician = async (req, res) => {
  try {
    const { query } = req;
    const { technicianId } = query;
    const result = await TimeClock.find({
      technicianId: technicianId
    }).populate("technicianId orderId");
    return res.status(200).json({
      message: "Timer get success!",
      data: result || []
    });
  } catch (error) {
    console.log("this is add", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const switchService = async (req, res) => {
  try {
    const { body, currentUser } = req;
    const { technicianId, serviceId, orderId, oldService } = body;
    if (timeClocks[`${technicianId}`]) {
      timeClocks[`${technicianId}`].destroy();
    }
    const result = await TimeClock.findOneAndUpdate(
      {
        technicianId,
        oldService
      },
      {
        $set: {
          endDateTime: Date.now()
        }
      }
    );
    await TimeClock.create({
      type: "timeclock",
      technicianId,
      serviceId,
      orderId,
      userId: mongoose.Types.ObjectId(currentUser.id),
      parentId: currentUser.parentId
        ? mongoose.Types.ObjectId(currentUser.parentId)
        : mongoose.Types.ObjectId(currentUser.id),
      startDateTime: Date.now()
    });
    await UserModel.updateOne(
      {
        _id: technicianId
      },
      {
        $set: {
          currentlyWorking: {
            serviceId,
            orderId
          }
        }
      }
    );
    if (result) {
      await OrderModal.updateOne(
        {
          _id: orderId
        },
        {
          $push: {
            timeClockId: result._id
          }
        }
      );
    }
    timeClocks[`${technicianId}`] = cron.schedule("* * * * * *", async () => {
      console.log("running a task every seond");
      await TimeClock.updateOne(
        {
          technicianId,
          serviceId,
          orderId
        },
        {
          $inc: {
            duration: 1
          }
        }
      );
    });
    return res.status(200).json({
      message: "Techinician Service Changed success!"
    });
  } catch (error) {
    console.log("this is add", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

const updateTimeLogOfTechnician = async (req, res) => {
  const { body, currentUser } = req;
  try {
    let timeLogsData;
    if (body.startDateTime) {
      let startTime = body.startDateTime.split(":");
      let dateDuration;
      dateDuration = new Date(body.date);
      dateDuration.setUTCHours(parseInt(startTime[0]));
      dateDuration.setUTCMinutes(parseInt(startTime[1]));
      const startDate = dateDuration.toISOString();

      let endTime = body.endDateTime.split(":");
      let dateDurationEnd;
      dateDurationEnd = new Date(body.date);
      dateDurationEnd.setUTCHours(parseInt(endTime[0]));
      dateDurationEnd.setUTCMinutes(parseInt(endTime[1]));
      const endDate = dateDurationEnd.toISOString();

      const duration = moment(body.duration, "HH:mm:ss: A").diff(
        moment().startOf("day"),
        "seconds"
      );
      timeLogsData = {
        type: body.type,
        technicianId: mongoose.Types.ObjectId(body.technicianId),
        startDateTime: startDate,
        endDateTime: endDate,
        activity: body.activity,
        duration: duration,
        date: body.date,
        total: body.total,
        orderId: mongoose.Types.ObjectId(body.orderId),
        userId: mongoose.Types.ObjectId(currentUser.id),
        parentId: currentUser.parentId
          ? mongoose.Types.ObjectId(currentUser.parentId)
          : mongoose.Types.ObjectId(currentUser.id),
        isDeleted: false,
        notes: body.notes
      };
    } else {
      timeLogsData = {
        isDeleted: body.isDeleted
      };
    }
    await TimeClock.findByIdAndUpdate(body._id, {
      $set: timeLogsData
    });
    return res.status(200).json({
      message: "Time log updated successfully",
      success: true
    });
  } catch (error) {
    console.log("this is update timelog error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const getAllTimeLogs = async (req, res) => {
  const { currentUser, query } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = parseInt(query.page || 1);
    const offset = page < 1 ? 0 : (page - 1) * limit;
    const searchValue = query.search;
    const id = currentUser.id;
    const parentId = currentUser.parentId || currentUser.id;
    let condition = {};
    condition["$and"] = [
      {
        $or: [
          {
            parentId: mongoose.Types.ObjectId(id)
          },
          {
            parentId: mongoose.Types.ObjectId(parentId)
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
        _id: { $ne: mongoose.Types.ObjectId(id) }
      }
    ];
    if (searchValue) {
      condition["$and"].push({
        $or: [
          {
            "technicianId.firstName": {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            "technicianId.LastName": {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            activity: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          }
        ]
      });
    }
    const data = await TimeClock.aggregate([
      {
        $lookup:
        {
          from: "users",
          localField: "technicianId",
          foreignField: "_id",
          as: "technicianId"
        }
      },
      {
        $lookup:
        {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "orderId"
        }
      },
      {
        $lookup:
        {
          from: "vehicles",
          localField: "orderId.vehicleId",
          foreignField: "_id",
          as: "vehicleId"
        }
      },
      {
        $lookup:
        {
          from: "customers",
          localField: "orderId.customerId",
          foreignField: "_id",
          as: "customerId"
        }
      },
      { $unwind: "$technicianId" },
      {
        $match: { ...condition }
      }
    ])
    // const result = await TimeClock.find(condition).populate({
    //   path: "technicianId orderId", match: {
    //     isDeleted: false
    //   }
    // }).skip(offset)
    //   .limit(limit);
    const getAllTimeLogCount = await TimeClock.aggregate([
      {
        $match: { ...condition }
      },
      {
        $count: "count"
      }
    ]);
    const getSumOfDuration = await TimeClock.aggregate([
      {
        $match: { ...condition }
      },
      {
        $group: {
          _id: null,
          duration: {
            $sum: "$duration"
          },
          total: {
            $sum: "$total"
          }
        }
      }
    ])

    return res.status(200).json({
      message: "Timer get success!",
      data: data || [],
      totalDuration: getSumOfDuration[0] ? getSumOfDuration[0].duration : 0,
      totalTimeLogs: getAllTimeLogCount[0] ? getAllTimeLogCount[0].count : 0,
      totalEarning: getSumOfDuration[0] ? getSumOfDuration[0].total : 0,
    });
  } catch (error) {
    console.log("this is update timelog error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
}
/**
 *
 */
module.exports = {
  addTimeLogs,
  startTimer,
  getTimeLogByTechnician,
  updateTimeLogOfTechnician,
  getTimeLogOfTechnician,
  stopTimer,
  switchService,
  getAllTimeLogs
};
