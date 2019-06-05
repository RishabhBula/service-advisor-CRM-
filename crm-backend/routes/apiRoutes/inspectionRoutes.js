const express = require("express");
const router = express.Router();
const inspectionController = require("../../controllers/frontend/inspectionController");
const msgTempController = require("../../controllers/frontend/messageTempController");
const token = require("../../common/token");

/* ----------Add new inspection------------ */
router.post("/addInspection", token.authorisedUser, inspectionController.creteNewInspection);

/* get all inspection */
router.get("/inspectionList", token.authorisedUser, inspectionController.getInspectionData);

/* add inspection as template */
router.post("/inspectionTemplate", token.authorisedUser, inspectionController.inspectionTemplate);

/* add new message template */
router.post('/messageTemplate', token.authorisedUser, msgTempController.addMessageTemplate)

/* get all msg templates Search*/
router.get('/messageTemplateListSearch', token.authorisedUser, msgTempController.getAllMsgTemplateListSearch)

/* get all msg templates */
router.get('/messageTemplateList', token.authorisedUser, msgTempController.getAllMsgTemplateList)

/* update message template */
router.put("/messageTemplateUpdate", token.authorisedUser, msgTempController.updateMessageTemplate)

/* delete message template */
router.delete("/messageTemplateDelete", token.authorisedUser, msgTempController.deleteMessageTemplate)

/* send inspection details mail */
router.post("/sendInspectionDetails", token.authorisedUser, msgTempController.sendMailToCustomer)

/* generate PDF Document */
router.post("/generatePdfDoc", token.authorisedUser, inspectionController.generatePdfDoc)
module.exports = router;
