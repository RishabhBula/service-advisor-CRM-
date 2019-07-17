const { Twilio } = require("./../config/app");
const { accountSid, authToken, from } = Twilio;
const client = require("twilio")(accountSid, authToken);
const SMSModel = require("../models/smsData");
/**
 *
 */
const sendSMS = async (mobile, message, userId) => {
  let status = "success";
  let result = {};
  try {
    result = await client.messages.create({
      body: message,
      from,
      to: mobile
    });
  } catch (error) {
    status = "error";
    result = {
      error: true,
      message: error.message
    };
  }
  await SMSModel.create({
    to: mobile,
    message,
    from,
    userId,
    detailObject: result,
    status
  });
  return result;
};

module.exports = {
  sendSMS
};
