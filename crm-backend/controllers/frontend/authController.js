const jwt = require("jsonwebtoken");
const userModel = require("../../models/user");
const roleModel = require("../../models/role");
const { validationResult } = require("express-validator/check");
const commonValidation = require("../../common");
const commonSmtp = require("../../common/index");
const commonCrypto = require("../../common/crypto");
const {
  validationMessage,
  otherMessage,
} = require("../../common/validationMessage");
const { Email, AvailiableTemplates } = require("../../common/Email");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const __basedir = path.join(__dirname, "../../public");
const { resizeImage } = require("../../common/imageThumbnail");
const mongoose = require("mongoose");

const signUp = async (req, res) => {
  try {
    const confirmationNumber = new Date().valueOf();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false,
      });
    }
    let userFind = await userModel.find({ email: req.body.email });
    if (userFind.length >= 1) {
      return res.status(401).json({
        message: validationMessage.emailAlreadyExist,
        success: false,
      });
    } else {
      var roleType = await roleModel.findOne({ userType: "admin" });
      var salt = commonCrypto.generateSalt(6);
      var $data = req.body;
      $data.salt = salt;
      $data.password = commonCrypto.hashPassword($data.password, salt);
      $data.roleType = roleType._id;
      $data.permissions = roleType.permissionObject;
      $data.firstTimeUser = true;
      $data.loggedInIp = commonSmtp.getIpAddress(req);
      $data.userSideActivationValue = confirmationNumber;
      let result = await userModel($data).save();
      const emailVar = new Email(req);
      await emailVar.setTemplate(AvailiableTemplates.SIGNUP_CONFIRMATION, {
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        userId: result._id,
        userSideActivationValue: confirmationNumber,
      });
      await emailVar.sendEmail(result.email);

      return res.status(200).json({
        message: otherMessage.confirmMessage,
        success: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

const confirmationSignUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false,
      });
    }
    let data = req.body;
    var userData = await userModel.findOne({
      $and: [
        { _id: data.userId },
        { userSideActivation: false },
        { userSideActivationValue: data.activeValue },
      ],
    });
    if (userData) {
      let roleUpdate = await userModel.updateOne(
        {
          _id: userData._id,
        },
        {
          $set: {
            userSideActivation: true,
            userSideActivationValue: "",
          },
        }
      );
      if (roleUpdate) {
        const emailVar = new Email(req);
        await emailVar.setTemplate(AvailiableTemplates.SIGNUP, {
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
        await emailVar.sendEmail(userData.email);
        res.status(200).json({
          message: userData,
          success: true,
        });
      } else {
        res.status(401).json({
          message: "Some thing Went Wrong",
          success: false,
        });
      }
    } else {
      res.status(401).json({
        message: "User already exist.",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

const loginApp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userModel.findOne({
      $and: [{ email: email }],
    });
    if (result === null) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 400,
        message: "Email Address not found!",
        success: false,
      };
    }
    if (!result.status) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 400,
        message: "Kindly Verify your Account and try to Login.",
        success: false,
      };
    }
    if (!result.userSideActivation) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 400,
        message: "you are not authorized to access CRM",
        success: false,
      };
    }
    if (!commonCrypto.verifyPassword(result.password, password, result.salt)) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 400,
        message: "Password did not match!",
        success: false,
      };
    }
    await userModel.updateOne(
      {
        _id: result._id,
      },
      {
        $set: {
          loggedInIp: commonSmtp.getIpAddress(req),
          loggedInAt: new Date(),
        },
      }
    );
    var token = jwt.sign(
      {
        id: result._id,
        randomKey: commonCrypto.generateSalt(8),
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        parentId: result.parentId,
      },
      commonCrypto.secret,
      {
        expiresIn: 86400,
      }
    );
    return res.status(200).json({
      responseCode: 200,
      data: result,
      tokenExpire: moment() + 86400,
      token: token,
      message: "Successfully Login",
      success: true,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/* -----------------User Forgot Password-------------- */
const userForgotPassword = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false,
    });
  }
  try {
    const userData = await userModel.findOne({ email: body.email });
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "Email not registered.",
        success: false,
      });
    }
    const encryptedUserId = commonCrypto.encrypt(userData.id);
    const encrypteUserEmail = commonCrypto.encrypt(userData.email);
    const encrypteVerifyToken = commonCrypto.encrypt(
      userData.email + userData.id
    );
    const emailVar = new Email(req);
    await emailVar.setTemplate(AvailiableTemplates.FORGET_PASSWORD, {
      resetPageUrl: req.headers.host,
      fullName: userData.firstName + " " + userData.lastName,
      email: encrypteUserEmail,
      userId: encryptedUserId,
      verifyToken: encrypteVerifyToken,
    });
    await userModel.update(
      {
        email: userData.email,
      },
      {
        verifyToken: encrypteVerifyToken,
      }
    );
    await emailVar.sendEmail(body.email);
    return res.status(200).json({
      responsecode: 200,
      message:
        "Reset password link have been send successfully to your registered email address.",
      success: true,
    });
  } catch (error) {
    console.log("this is forgot password error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/* -----------------User Verify Link-------------- */
const userVerifyLink = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false,
    });
  }
  try {
    const decryptedUserId = commonCrypto.decrypt(body.verification);
    const decryptedUserEmail = commonCrypto.decrypt(body.user);
    const userData = await userModel.findOne({
      email: decryptedUserEmail,
      _id: decryptedUserId,
      verifyToken: body.token,
    });
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "Your session has been expired.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Link verified successfully!",
      data: userData,
      success: true,
    });
  } catch (error) {
    console.log("this is verify link error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

/* -----------------User Reset password-------------- */
const userResetpassword = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false,
    });
  }
  try {
    const decryptedUserEmail = commonCrypto.decrypt(body.user);
    const userData = await userModel.findOne({ email: decryptedUserEmail });
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "Email not registered.",
        success: false,
      });
    }
    var salt = commonCrypto.generateSalt(6);
    body.salt = salt;
    const encryptedUserpassword = commonCrypto.hashPassword(
      body.password,
      salt
    );
    if (!userData.verifyToken) {
      return res.status(400).json({
        responsecode: 400,
        message: "Your session has been expired.",
        success: false,
      });
    }
    const result = await userModel.findByIdAndUpdate(
      {
        _id: userData.id,
      },
      {
        $set: {
          password: encryptedUserpassword,
          salt: body.salt,
          verifyToken: null,
        },
      }
    );
    if (result) {
      return res.status(200).json({
        message: "Password updated successfully!",
        success: true,
      });
    } else {
      return res.status(400).json({
        responsecode: 400,
        message: "Your session has been expired.",
        success: false,
      });
    }
  } catch (error) {
    console.log("this is Reset password error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/* ------------User Company Setup--------------- */
const userCompanySetup = async (req, res) => {
  const { body, currentUser } = req;
  try {
    const userData = await userModel.findById(currentUser.id);
    if (!userData) {
      return res.status(400).json({
        responsecode: 400,
        message: "User not registered",
        success: false,
      });
    }
    const comapnyData = {
      companyName: body.companyName,
      website: body.website,
      peopleWork: body.peopleWork,
      serviceOffer: body.serviceOffer,
      vehicleService: body.vehicleService,
    };
    const companySetup = await userModel.findByIdAndUpdate(
      {
        _id: userData.id,
      },
      {
        $set: comapnyData,
      }
    );
    if (!companySetup) {
      return res.status(400).json({
        responsecode: 400,
        message: "Error uploding user company details.",
        success: false,
      });
    } else {
      return res.status(200).json({
        responsecode: 200,
        message: "User company details uploaded successfully!",
        success: false,
      });
    }
  } catch (error) {
    console.log("this is Company setup error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/* ------------User Company Setup End--------------- */

/* ---------------User Image Upload---------------- */
const imageUpload = async (req, res) => {
  try {
    const { body, currentUser } = req;
    if (!body.imageData) {
      return res.status(401).json({
        responseCode: 401,
        message: "Not provided any file to upload!",
        success: false,
      });
    }
    if (body.imageData !== undefined || body.imageData !== "") {
      const base64Image = body.imageData.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      var buf = new Buffer(base64Image, "base64");

      var originalImagePath = __basedir + "/images/" + currentUser.id;
      var thumbnailImagePath =
        __basedir + "/images-thumbnail/" + currentUser.id + "image-thumb";
      const thumbnailImage = resizeImage(
        originalImagePath,
        thumbnailImagePath,
        600
      );
      console.log("**********This is thumbnailImage", thumbnailImage);

      fs.writeFile(originalImagePath, buf, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
      const imageUploadData = {
        originalImage: currentUser.id,
        thumbnailImage: currentUser.id + "image-thumb",
      };
      const companyLogo = await userModel.findByIdAndUpdate(
        { _id: currentUser.id },
        {
          shopLogo: imageUploadData,
        }
      );
      if (companyLogo) {
        return res.status(200).json({
          responseCode: 200,
          message: "Image uploaded successfully!",
          imageData: currentUser.id,
          success: true,
        });
      } else {
        return res.status(400).json({
          responseCode: 400,
          message: "Error uploading company logo.",
          success: false,
        });
      }
    } else {
      return res.status(400).json({
        responsecode: 400,
        message: "Enter valid image.",
        success: false,
      });
    }
  } catch (error) {
    console.log("**************This is image upload error", error);
    return res.status(400).json({
      responseCode: 400,
      message: "Error while saving file!",
      error: error,
      success: false,
    });
  }
};
/* ---------------User Image Upload End---------------- */

/* ----------------User Image Delete-------------------- */
const imageDelete = async (req, res) => {
  try {
    const { body, currentUser } = req;
    if (!body.imageData) {
      return res.status(401).json({
        responseCode: 401,
        message: "Not provided any file to upload!",
        success: false,
      });
    }
    if (body.imageData !== undefined || body.imageData !== "") {
      const base64Image = body.imageData.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      var buf = new Buffer(base64Image, "base64");

      var originalImagePath = __basedir + "/images/" + currentUser.id;
      var thumbnailImagePath =
        __basedir + "/images-thumbnail/" + currentUser.id + "image-thumb";
      fs.unlinkSync(originalImagePath, buf, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was deleted!");
      });
      fs.unlinkSync(thumbnailImagePath, buf, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was deleted!");
      });
      const imageUploadData = {
        originalImage: null,
        thumbnailImage: null,
      };
      const companyLogo = await userModel.findByIdAndUpdate(
        { _id: currentUser.id },
        {
          shopLogo: imageUploadData,
        }
      );
      if (companyLogo) {
        return res.status(200).json({
          responseCode: 200,
          message: "Image deleted successfully!",
          success: true,
        });
      } else {
        return res.status(400).json({
          responseCode: 400,
          message: "Error uploading company logo.",
          success: false,
        });
      }
    } else {
      return res.status(400).json({
        responsecode: 400,
        message: "Enter valid image.",
        success: false,
      });
    }
  } catch (error) {
    console.log("**************This is image upload error", error);
    return res.status(400).json({
      responseCode: 400,
      message: "Error while saving file!",
      error: error,
      success: false,
    });
  }
};
/* ----------------User Image Delete End-------------------- */

/*----------------User create by admin------------------ */
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false,
      });
    }
    const confirmationNumber = new Date().valueOf();
    let $data = req.body;
    $data.firstTimeUser = true;
    $data.userSideActivationValue = confirmationNumber;
    let inserList = {
      ...$data,
      roleType: mongoose.Types.ObjectId($data.roleType),
      parentId: req.currentUser.id,
      rate: parseFloat($data.rate.replace(/[$,\s]/g, "")).toFixed(2),
    };
    let result = await userModel(inserList).save();
    const emailVar = new Email(req);
    await emailVar.setTemplate(AvailiableTemplates.USER_ADDED_CONFIRMATION, {
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      userId: result._id,
      userSideActivationValue: confirmationNumber,
    });
    await emailVar.sendEmail(result.email);
    if (result) {
      return res.status(200).json({
        message: otherMessage.insertUserMessage,
        success: true,
      });
    } else {
      return res.status(400).json({
        result: result,
        message: "Error in inserting user.",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

/*----------------User create by admin------------------ */
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false,
      });
    }
    let $data = req.body;

    let inserList = {
      ...$data,
      roleType: mongoose.Types.ObjectId($data.roleType),
      parentId: req.currentUser.id,
      rate: parseFloat($data.rate.replace(/[$,\s]/g, "")).toFixed(2),
    };
    let result = await userModel.findByIdAndUpdate(
      req.params.userId,
      inserList
    );
    return res.status(200).json({
      message: otherMessage.updatedUserMessage,
      data: result,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

/* verify user */
const verfiyUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false,
      });
    }
    let $data = req.body;
    var userData = await userModel.findOne({
      $and: [
        { _id: $data.userId },
        { userSideActivation: false },
        { userSideActivationValue: $data.activeValue },
      ],
    });
    if (userData) {
      let salt = commonCrypto.generateSalt(6);
      let password = commonCrypto.hashPassword($data.password, salt);
      let loggedInIp = commonSmtp.getIpAddress(req);
      let roleUpdate = await userModel.updateOne(
        {
          _id: userData._id,
        },
        {
          $set: {
            userSideActivation: true,
            userSideActivationValue: "",
            password: password,
            loggedInIp: loggedInIp,
          },
        }
      );
      if (roleUpdate) {
        res.status(200).json({
          message: otherMessage.userPasswordCreation,
          success: true,
        });
      } else {
        res.status(401).json({
          message: "Some thing Went Wrong",
          success: false,
        });
      }
    } else {
      res.status(401).json({
        message: otherMessage.linkExpiration,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

/* verify user Link*/
const verfiyUserLink = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false,
      });
    }
    let $data = req.body;
    var userData = await userModel.findOne({
      $and: [
        { _id: $data.userId },
        { userSideActivation: false },
        { userSideActivationValue: $data.activeValue },
      ],
    });
    if (userData) {
      res.status(200).json({
        message: "Link verified successfully!",
        success: true,
      });
    } else {
      res.status(401).json({
        message: otherMessage.linkExpiration,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

module.exports = {
  signUp,
  confirmationSignUp,
  loginApp,
  userForgotPassword,
  userVerifyLink,
  userResetpassword,
  userCompanySetup,
  createUser,
  updateUser,
  verfiyUser,
  verfiyUserLink,
  imageUpload,
  imageDelete,
};
