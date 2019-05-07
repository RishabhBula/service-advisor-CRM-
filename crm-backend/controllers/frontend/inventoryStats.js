const Tires = require("../../models/tier");
const Parts = require("./../../models/parts");
const mongoose = require("mongoose");
const getStats = async (req, res) => {
  const { currentUser } = req;
  const id = mongoose.Types.ObjectId(currentUser.id);
  const parentId = mongoose.Types.ObjectId(
    currentUser.parentId || currentUser.id
  );
  const condition = {
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
            parentId: id
          },
          {
            parentId: parentId
          }
        ]
      }
    ]
  };
  try {
    return res.json({
      data: {
        quantity: {
          parts: await Parts.countDocuments(condition),
          tires: await Tires.countDocuments(condition)
        },
        cost: {
          parts: await Parts.aggregate([
            { $match: condition },
            { $project: { $sum: "cost" } }
          ]),
          tires: await Tires.countDocuments([
            { $match: condition },
            { $project: { $sum: "tierSize.cost" } }
          ])
        },
        value: {
          parts: await Parts.countDocuments(condition),
          tires: await Tires.countDocuments(condition)
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        quantity: {
          parts: 0,
          tires: 0
        },
        cost: {
          parts: 0,
          tires: 0
        },
        value: {
          parts: 0,
          tires: 0
        }
      }
    });
  }
};
module.exports = {
  getStats
};
