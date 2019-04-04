const jwt = require("jsonwebtoken");
const userModel = require("../../models/user");
const roleModel = require("../../models/role");
const { validationResult } = require("express-validator/check");
const commonValidation = require("../../common");
const commonSmtp = require("../../common/index");
const commonCrypto = require("../../common/crypto");
const {
  validationMessage,
  otherMessage
} = require("../../common/validationMessage");
const { Email, AvailiableTemplates } = require("../../common/Email");
const moment = require("moment");

const signUp = async (req, res) => {
  try {
    const confirmationNumber = new Date().valueOf();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false
      });
    }
    let userFind = await userModel.find({ email: req.body.email });
    if (userFind.length >= 1) {
      return res.status(401).json({
        message: validationMessage.emailAlreadyExist,
        success: false
      });
    } else {
      var roleType = await roleModel.findOne({ userType: "admin" });
      var salt = commonCrypto.generateSalt(6);
      var $data = req.body;
      $data.salt = salt;
      $data.password = commonCrypto.hashPassword($data.password, salt);
      $data.roleType = roleType._id;
      $data.permission = roleType.permissionObject;
      $data.firstTimeUser = true;
      $data.loggedInIp = commonSmtp.getIpAddress(req);
      $data.userSideActivationValue = confirmationNumber;
      let result = await userModel($data).save();
      var token = jwt.sign(
        {
          id: result._id,
          randomKey: salt,
          email: $data.email,
          firstName: $data.firstName,
          lastName: $data.lastName
        },
        commonCrypto.secret,
        {
          expiresIn: 86400
        }
      );

      const emailVar = new Email(res);
      await emailVar.setTemplate(AvailiableTemplates.SIGNUP_CONFIRMATION, {
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        userId: result._id,
        userSideActivationValue: confirmationNumber
      });
      await emailVar.sendEmail(result.email);

      return res.status(200).json({
        message: otherMessage.newRegister,
        result: result,
        token: token,
        success: true
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

const confirmationSignUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false
      });
    }
    let data = req.body;
    var userData = await userModel.findOne({
      $and: [
        { _id: data.userId },
        { userSideActivation: false },
        { userSideActivationValue: data.activeValue }
      ]
    });
    if (userData) {
      let roleUpdate = await userModel.updateOne(
        {
          _id: userData._id
        },
        {
          $set: {
            userSideActivation: true,
            userSideActivationValue: ""
          }
        }
      );
      if (roleUpdate) {
        const emailVar = new Email(res);
        await emailVar.setTemplate(AvailiableTemplates.SIGNUP, {
          firstName: userData.firstName,
          lastName: userData.lastName
        });
        await emailVar.sendEmail(userData.email);
        res.status(200).json({
          message: userData,
          success: true
        });
      } else {
        res.status(401).json({
          message: "Some thing Went Wrong",
          success: false
        });
      }
    } else {
      res.status(401).json({
        message: "User already exist.",
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

const loginApp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userModel.findOne({
      $and: [{ email: email }]
    });
    if (result === null) {
      throw {
        code: 400,
        message: "Email Address not found!",
        success: false
      };
    }
    if (!result.status) {
      throw {
        code: 400,
        message: "you are not authorized to access CRM",
        success: false
      };
    }
    if (!commonCrypto.verifyPassword(result.password, password, result.salt)) {
      throw {
        code: 400,
        message: "Password did not match!",
        success: false
      };
    }
    let ipUpdate = await userModel.updateOne(
      {
        _id: result._id
      },
      {
        $set: {
          loggedInIp: commonSmtp.getIpAddress(req)
        }
      })
    var token = jwt.sign({
      id: result._id,
      randomKey: commonCrypto.generateSalt(8),
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName
    }, commonCrypto.secret, {
        expiresIn: 86400
      });
    return res.status(200).json({
      responseCode: 200,
      data: result,
      tokenExpire: moment() + 86400,
      token: token,
      message: "Successfully Login",
      success: true
    })
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -----------------User Forgot Password-------------- */
const userForgotPassword = async (req, res) => {
  const { body } = req;
  try {
    const userData = await userModel.findOne({ email: body.email })
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "Email not registered.",
        success: false
      });
    }
    const encryptedUserId = commonCrypto.encrypt(userData.id);
    const encrypteUserEmail = commonCrypto.encrypt(userData.email);
    const encrypteVerifyToken = commonCrypto.encrypt(userData.email + userData.id);
    const emailVar = new Email(res);
    await emailVar.setTemplate(AvailiableTemplates.FORGET_PASSWORD, {
      resetPageUrl: 'http://192.168.2.126:3000',
      fullName: userData.firstName + ' ' + userData.lastName,
      email: encrypteUserEmail,
      userId: encryptedUserId,
      verifyToken: encrypteVerifyToken,
    });
    const updateVerifyToken = await userModel.update({
      email: userData.email
    }, {
        verifyToken: encrypteVerifyToken
      })
    await emailVar.sendEmail(body.email);
    return res.status(200).json({
      responsecode: 200,
      message: "Reset password link have been send successfully to your registered email address.",
      success: true
    });
  } catch (error) {
    console.log("this is forgot password error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
}
/* -----------------User Verify Link-------------- */
const userVerifyLink = async (req, res) => {
  const { body } = req;
  try {
    const decryptedUserId = commonCrypto.decrypt(body.verification);
    const decryptedUserEmail = commonCrypto.decrypt(body.user);
    const userData = await userModel.findOne({
      email: decryptedUserEmail,
      _id: decryptedUserId,
      verifyToken: body.token,
    })
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "Your session has been expired.",
        success: false
      });
    }
    return res.status(200).json({
      message: "Link verified successfully!",
      data: userData,
      success: true
    });
  } catch (error) {
    console.log("this is forgot password error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
}

/* -----------------User Reset password-------------- */
const userResetpassword = async (req, res) => {
  const { body } = req;
  try {
    const userData = await userModel.findOne({ email: body.email })
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "Email not registered.",
        success: false
      });
    }
    var salt = commonCrypto.generateSalt(6);
    body.salt = salt;;
    const encryptedUserpassword = commonCrypto.hashPassword(body.password, salt);
    const result = await userModel.update({
      email: body.email,
      verifyToken: body.token
    },
      {
        $set: {
          password: encryptedUserpassword.password,
          salt: body.salt,
          verifyToken: "",
        }
      }
    )
    if (result) {
      return res.status(200).json({
        message: "Password updated successfully!",
        success: true
      });
    }
  } catch (error) {
    console.log("this is forgot password error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
}
module.exports = {
  signUp,
  confirmationSignUp,
  loginApp,
  userForgotPassword,
  userVerifyLink,
  userResetpassword
};
