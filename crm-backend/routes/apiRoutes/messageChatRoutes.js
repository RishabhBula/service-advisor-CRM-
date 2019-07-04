const express = require("express");
const router = express.Router();
const messageChatController = require("../../controllers/frontend/messageChatController");
const token = require("../../common/token");
const validation = require("../../common/apiValidation");

/* send message */
router.post("/sendMessage", token.authorisedUser, validation.messageChatValidations, messageChatController.sendMessageChat)

/* verifyLink message */
router.post("/verifyLink", messageChatController.verifyUserMessageLink)

/* verifyLink message */
router.put("/updateNotes",token.authorisedUser ,messageChatController.updateInternalNotes)

module.exports = router;
