const userModel = require("../../models/user");

/* ----------------Grt All User List------------ */
const getAllUserList = async (req, res) => {
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
    let condition = {
      parentId: currentUser.id,
    };
    if (status) {
      condition.status = status;
    }
    if (searchValue) {
      condition["$and"] = [
        {
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
    } else {
      condition["$or"] = [
        {
          isDeleted: {
            $exists: false,
          },
        },
        {
          isDeleted: false,
        },
      ];
    }
    const getAllUser = await userModel
      .find({
        ...condition,
      })
      .populate("roleType")
      .sort(sortBy)
      .skip(offset)
      .limit(limit);
    const getAllUserCount = await userModel.countDocuments({
      ...condition,
    });
    return res.status(200).json({
      responsecode: 200,
      data: getAllUser,
      totalUsers: getAllUserCount,
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
/* ----------------Grt All User List End------------ */

/* Delete User */
const deleteUser = async ({ params }, res) => {
  try {
    const { userId } = params;
    const data = await userModel.findByIdAndUpdate(userId, {
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
/* Delete User */
module.exports = {
  getAllUserList,
  deleteUser,
};
