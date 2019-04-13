const userModel = require("../../models/user");
const otherMessage = require("./../../common/validationMessage");
/* ----------------Grt All User List------------ */
const getAllUserList = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = parseInt(query.page);
    const offset = page < 1 ? 0 : (page - 1) * limit;
    const searchValue = query.search;
    const sort = query.sort;
    const status = query.status;
    const type = query.type;
    const invitaionStatus = query.invitaionStatus;
    let sortBy = {};
    switch (sort) {
      case "loginasc":
        sortBy = {
          updatedAt: -1
        };
        break;
      case "nasc":
        sortBy = {
          firstName: 1,
          lastName: 1
        };
        break;
      case "ndesc":
        sortBy = {
          firstName: -1,
          lastName: 1
        };
        break;
      default:
        sortBy = {
          createdAt: -1
        };
        break;
    }
    let condition = {};
    condition["$and"] = [
      {
        $or: [
          {
            parentId: currentUser.id
          },
          {
            parentId: currentUser.parentId || currentUser.id
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
        _id: { $ne: currentUser.id }
      }
    ];
    if (searchValue) {
      condition["$and"].push({
        $or: [
          {
            firstName: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            lastName: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            email: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          }
        ]
      });
    }

    if (typeof status !== "undefined") {
      condition["$and"].push({ status: status });
    }
    if (typeof invitaionStatus !== "undefined") {
      condition["$and"].push({ userSideActivation: invitaionStatus });
    }
    if (type) {
      condition["$and"].push({ roleType: type });
    }
    const getAllUser = await userModel
      .find({
        ...condition
      })
      .populate("roleType")
      .sort(sortBy)
      .skip(offset)
      .limit(limit);
    const getAllUserCount = await userModel.countDocuments({
      ...condition
    });
    return res.status(200).json({
      responsecode: 200,
      data: getAllUser,
      totalUsers: getAllUserCount,
      success: true
    });
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ----------------Grt All User List End------------ */

/* Delete User */
const deleteUser = async ({ body }, res) => {
  try {
    const data = await userModel.updateMany(
      {
        _id: { $in: body.userId }
      },
      {
        $set: {
          isDeleted: true
        }
      }
    );
    return res.status(200).json({
      message: "User deleted successfully!",
      data
    });
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* Delete User */

/* get single user info*/
const getProfile = async (req, res) => {
  const { currentUser } = req;
  try {
    let userFind = await userModel.findOne({
      _id: currentUser.id,
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }]
    });
    if (userFind) {
      return res.status(200).json({
        responseCode: 200,
        data: userFind,
        success: true
      });
    } else {
      return res.status(401).json({
        responseCode: 401,
        message: otherMessage.userNotExist,
        success: false
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* Update users status */
const updateStatus = async ({ body }, res) => {
  try {
    const data = await userModel.updateMany(
      {
        _id: { $in: body.users }
      },
      {
        $set: {
          status: body.status
        }
      }
    );
    return res.status(200).json({
      message: body.status
        ? "User inactivated successfully!"
        : "User activated successfully!",
      data
    });
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
module.exports = {
  deleteUser,
  getAllUserList,
  getProfile,
  updateStatus
};
