const commonSmtp = require("./index");
const fs = require("fs");
var path = require("path");

const AvailiableTemplates = {
  SIGNUP_CONFIRMATION: "signupConfirm",
  USER_ADDED_CONFIRMATION: "userConfirm",
  SIGNUP: "signup",
  SIGNUP_BY_ADMIN: "userProfileEmail",
  UPDATE_BY_ADMIN: "updateUserProfile",
  FORGET_PASSWORD: "forgotPassword",
  ORDER_COMPLETE: "orderComplete",
  WEBINAR_ORDER_COMPLETE: "webinarOrder",
  ADMIN_ORDER_EMAIL: "adminEmail",
  ADMIN_WEBINAR_ORDER_EMAIL: "adminWebinarOrder",
  WEBINAR_NOTIFICATION: "webinarNotification",
  REFUND_ORDER: "refundOrderUserEmail",
  REFUND_ORDER_ADMIN: "refundOrderAdminEmail",
  NEWSLETTER_EMAIL: "newsletterEmail",
  UNSUBSCRIBE_EMAIL: "unSubscribeEmail",
};
class Email {
  constructor(req) {
    const host = req.headers.referer.split("/");
    this.host = [host[0], host[1], host[2]].join("/");
    this.body = "";
    this.subject = "";
    this.to = "";
  }
  async setTemplate(templateName, replaceObject = {}) {
    if (!templateName) {
      throw new Error("Please provide template name", 400);
    }
    switch (templateName) {
      case AvailiableTemplates.SIGNUP_CONFIRMATION:
        this.subject = "[CRM-360 Degree] Please confirm your email address";
        break;
      case AvailiableTemplates.SIGNUP:
        this.subject = "[CRM-360 Degree] Registration";
        break;
      case AvailiableTemplates.USER_ADDED_CONFIRMATION:
        this.subject = "[CRM-360 Degree] You've Been Invited to Join CRM 360 ";
        break;

      case AvailiableTemplates.UPDATE_BY_ADMIN:
        this.subject = "[CRM-360 Degree] Updated Your Password";
        break;

      case AvailiableTemplates.FORGET_PASSWORD:
        this.subject = "[CRM-360 Degree] Reset Password";
        break;
      case AvailiableTemplates.ORDER_COMPLETE:
        this.subject = "[CRM-360 Degree] Order Complete";
        break;
      case AvailiableTemplates.WEBINAR_ORDER_COMPLETE:
        this.subject = "[CRM-360 Degree] Order Complete";
        break;
      case AvailiableTemplates.ADMIN_ORDER_EMAIL:
        this.subject = "[CRM-360 Degree] New Order Placed";
        break;
      case AvailiableTemplates.ADMIN_WEBINAR_ORDER_EMAIL:
        this.subject = "[CRM-360 Degree] New Order Placed";
        break;
      case AvailiableTemplates.WEBINAR_NOTIFICATION:
        this.subject = "[CRM-360 Degree] Webinar Notification";
        break;
      case AvailiableTemplates.REFUND_ORDER:
        this.subject = "[CRM-360 Degree] Refund Order";
        break;
      case AvailiableTemplates.REFUND_ORDER_ADMIN:
        this.subject = "[CRM-360 Degree] Refund Order Successfully";
        break;
      case AvailiableTemplates.NEWSLETTER_EMAIL:
        this.subject = "[CRM-360 Degree] Subscription";
        break;
      case AvailiableTemplates.UNSUBSCRIBE_EMAIL:
        this.subject = "[CRM-360 Degree] Unsubscription";
        break;

      default:
        throw new Error("Invalid template name", 400);
    }
    let content = fs.readFileSync(
      path.join(__dirname, `./emailtemplates/${templateName}.html`),
      "utf8"
    );
    replaceObject.webURL = this.host;

    for (const key in replaceObject) {
      if (replaceObject.hasOwnProperty(key)) {
        const val = replaceObject[key];
        content = content.replace(new RegExp(`{${key}}`, "g"), val);
      }
    }
    this.body = content;
    return content;
  }
  setSubject(subject) {
    this.subject = subject;
  }
  setBody(body) {
    this.body = body;
  }
  async sendEmail(email) {
    if (!email) {
      throw new Error("Please provide email.");
    }
    const mailOption = {
      from: "CRM-360 <test.chapter247@gmail.com>",
      to: email.split(","),
      subject: this.subject,
      html: this.body,
    };
    const resp = await commonSmtp.smtpTransport.sendMail(mailOption);
    return resp;
  }
}

module.exports = {
  Email,
  AvailiableTemplates,
};
