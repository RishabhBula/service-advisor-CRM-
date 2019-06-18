
const { Email } = require("../../common/Email");

/* Mail to verify google captcha */
const mailToVerifyCaptcha = async (req, res) => {
    const { body } = req;
    try {
        const emailVar = new Email(body);
        await emailVar.setSubject("[Service Advisor]" + body.$subject + " - Verification Link");
        await emailVar.setBody(body.$message);
        await emailVar.sendEmail(body.$email_to);
        return res.status(200).json({
            message: "Verification link send successfully!",
            success: true
        })
    } catch (error) {
        console.log("this is send mail error", error);
        return res.status(500).json({
            message: error.message ? error.message : "Unexpected error occure.",
            success: false
        });
    }
}
module.exports = {
    mailToVerifyCaptcha
}