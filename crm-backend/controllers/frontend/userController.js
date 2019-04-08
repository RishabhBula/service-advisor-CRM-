const userModel = require("../../models/user");

/* ----------------Grt All User List------------ */
const getAllUserList = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = parseInt(query.page);
    const offset = (page - 1) * limit;
    const searchValue = query.search;
    let condition = {
      parentId: currentUser.id,
    };
    if (searchValue) {
      condition = {
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
      };
    }
    const getAllUser = await userModel
      .find({
        ...condition,
      })
      .populate({
        path: "roleType",
        match: { userType: query.userType },
      })
      .skip(offset)
      .limit(limit);
    const getAllUserCount = await userModel.countDocuments({
      ...condition,
    });
    if (getAllUser) {
      return res.status(200).json({
        responsecode: 200,
        data: getAllUser,
        totalUsers: getAllUserCount,
        success: true,
      });
    } else {
      return res.status(400).json({
        responsecode: 400,
        message: "User not found",
        success: false,
      });
    }
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/* ----------------Grt All User List End------------ */
module.exports = {
  getAllUserList,
};
