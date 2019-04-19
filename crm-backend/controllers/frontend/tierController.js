const tierModel = require('../../models/tier')
const commonValidation = require("../../common");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator/check");

/* -------------Create new Tier------------ */
const createNewTier = async (req, res) => {
    const { body, currentUser } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: commonValidation.formatValidationErr(errors.mapped(), true),
            success: false
        });
    }
    try {

        if (currentUser.parentId === null || currentUser.parentId === "undefined") {
            currentUser.parentId = currentUser.id
        }
        const addNewTier = {
            brandName: body.brandName,
            modalName: body.modalName,
            vendor: body.vendor ? body.vendor : null,
            seasonality: body.seasonality,
            tierSize: body.tierSize,
            tierPermission: body.tierDefaultPermissions,
            userId: currentUser.id,
            parentId: currentUser.parentId
        }
        const tierData = new tierModel(addNewTier)
        const result = tierData.save();

        return res.status(200).json({
            responsecode: 200,
            message: "Tier added successfully!",
            success: true,
        });

    } catch (error) {
        console.log("**************This is add new tier error =>", error);
        return res.status(500).json({
            responsecode: 500,
            message: error.message ? error.message : "Unexpected error occure.",
            success: false,
        });
    }
}
/* -------------Create new Tier End------------ */

/* ------------Update Tier Details---------- */
const updateTierdetails = async (req, res) => {
    const { body } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: commonValidation.formatValidationErr(errors.mapped(), true),
            success: false
        });
    }
    try {

        const updateTierDetails = await tierModel.findByIdAndUpdate(
            mongoose.Types.ObjectId(body.tierId),
            {
                $set: body,
            }
        );
        return res.status(200).json({
            responsecode: 200,
            message: "Tier details updated successfully!",
            success: true,
        });

    } catch (error) {
        console.log("This is update tier error", error);
        return res.status(500).json({
            responsecode: 500,
            message: error.message ? error.message : "Unexpected error occure.",
            success: false,
        });
    }
};
/* ------------Update Tier Details End---------- */

/* ------------Get Tier list---------- */
const getAllTierList = async (req, res) => {
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
                    brandName: 1,
                };
                break;
            case "ndesc":
                sortBy = {
                    brandName: -1,
                };
                break;
            default:
                sortBy = {
                    createdAt: -1,
                };
                break;
        }
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
        ];
        if (searchValue) {
            condition["$and"].push({
                $or: [
                    {
                        brandName: {
                            $regex: new RegExp(searchValue.trim(), "i"),
                        },
                    },
                    {
                        modalName: {
                            $regex: new RegExp(searchValue.trim(), "i"),
                        },
                    },
                ],
            });
        }
        if (status) {
            condition["$and"].push({ status: status });
        }
        const getAllTier = await tierModel
            .find({
                ...condition,
            })
            .sort(sortBy)
            .skip(offset)
            .limit(limit);
        const getAllTierCount = await tierModel.countDocuments({
            ...condition,
        });
        return res.status(200).json({
            responsecode: 200,
            data: getAllTier,
            totalTier: getAllTierCount,
            success: true,
        });
    } catch (error) {
        console.log("This is tier list error", error);
        res.status(500).json({
            responsecode: 500,
            message: error.message ? error.message : "Unexpected error occure.",
            success: false,
        });
    }
};
/* ------------Get Tier list End---------- */

/*----------------Delete Tier-------------*/
const deleteTier = async ({ body }, res) => {
    try {
        const data = await tierModel.updateMany(
            {
                _id: { $in: body.tierId }
            },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        return res.status(200).json({
            message: "Tier deleted successfully!",
            data
        });
    } catch (error) {
        console.log("this is delete tier error", error);
        return res.status(500).json({
            message: error.message ? error.message : "Unexpected error occure.",
            success: false
        });
    }
};
/*----------------Delete tier End-------------*/

module.exports = {
    createNewTier,
    updateTierdetails,
    getAllTierList,
    deleteTier
};
