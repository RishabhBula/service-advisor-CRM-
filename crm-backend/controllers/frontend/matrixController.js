const matrixModel = require("../../models/priceMatrix");

/* -------------Get All Roles------------ */
const getAllMatrix = async (req, res) => {
    try {
        const getAllMatrix = await matrixModel.find();
        if (getAllMatrix) {
            return res.status(200).json({
                responsecode: 200,
                data: getAllMatrix,
                success: true
            })
        } else {
            return res.status(400).json({
                responsecode: 400,
                message: "No matrix found",
                success: false
            })
        }
    } catch (error) {
        console.log("this is get all roles error", error);
        return res.status(400).send({ msg: error });
    }
};
/* -------------Get All Roles End------------ */

module.exports = {
    getAllMatrix
};
