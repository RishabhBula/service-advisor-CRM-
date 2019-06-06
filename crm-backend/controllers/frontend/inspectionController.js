const Inspection = require("../../models/inspection");
const commonValidation = require("../../common");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator/check");
var pdf = require('html-pdf');

/* get order number */
const creteNewInspection = async (req, res) => {
  const { body, currentUser } = req
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    let result = []
    let inspectionContent
    for (let index = 0; index < body.inspection.length; index++) {
      const element = body.inspection[index];
      const inspectionDataModal = {
        inspectionName: element.inspectionName,
        items: element.items,
        isTemplate: element.isTemplate,
        userId: currentUser.id,
        parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
        status: true,
        isDeleted: false
      }
      inspectionContent = new Inspection(inspectionDataModal);
      const inspecResult = await inspectionContent.save()
      result.push(inspecResult)
    }
    if (result) {
      return res.status(200).json({
        message: `${body.inspection.length} Inspection added successfully!`,
        data: result,
        success: true
      })
    }
  } catch (error) {
    console.log("this is create inspection error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
}
/* get Inpection Data */
const getInspectionData = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = parseInt(query.page || 1);
    const offset = page < 1 ? 0 : (page - 1) * limit;
    const id = currentUser.id;
    const isTemplate = query.isTemplate
    const searchValue = query.search;
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
      }
    ];
    if (searchValue) {
      condition["$and"].push({
        $or: [
          {
            inspectionName: {
              $regex: new RegExp(searchValue.trim(), "i"),
            },
          }
        ],
      });
    }
    if (typeof isTemplate !== "undefined") {
      condition["$and"].push({ isTemplate: true });
    }
    const inspection = await Inspection.find(condition)
      .skip(offset)
      .limit(limit);
    const total = await Inspection.countDocuments(condition);
    return res.status(200).json({
      responsecode: 200,
      inspection,
      total,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
}
/* inpection as template */
const inspectionTemplate = async (req, res) => {
  const { body, currentUser } = req
  try {
    let result = []
    for (let index = 0; index < body.length; index++) {
      const element = body[index];
      const inspection = await Inspection.findById(element._id)
      if (inspection) {
        const inspectionUpdate = await Inspection.findByIdAndUpdate(mongoose.Types.ObjectId(inspection._id), {
          $set: {
            isDeleted: element.isDeleted
          }
        })
        return res.status(200).json({
          message: "Template deleted successfully!",
          success: true
        })
      } else {
        const inspectionDataModal = {
          inspectionName: element.inspectionName,
          items: element.items,
          isTemplate: element.isTemplate,
          userId: currentUser.id,
          parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
          status: true,
          isDeleted: false
        }
        inspectionContent = new Inspection(inspectionDataModal);
        const inspecResult = await inspectionContent.save()
        result.push(inspecResult)
      }
      if (result) {
        return res.status(200).json({
          message: `${body.length} Inspection added to template successfully!`,
          data: result,
          success: true
        })
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
}
/* generate PDF document */
const generatePdfDoc = async (req, res) => {
  const { body } = req;
  try {
    pdf.create(html).toFile([filepath], function (err, res) {
      console.log(res.filename);
      if (err) {
        return res.status(400).json({
          err,
          success: false
        })

      }
      return res.status(200).json({
        data: res.filename,
        success: true
      })
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
}
module.exports = {
  creteNewInspection,
  getInspectionData,
  inspectionTemplate,
  generatePdfDoc
};