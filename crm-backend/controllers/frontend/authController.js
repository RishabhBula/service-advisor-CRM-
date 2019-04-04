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

const signUp = async (req, res) => {
    try {
        const confirmationNumber = new Date().valueOf();
        const errors = validationResult(req);        
        if (!errors.isEmpty())
        {
            return res.status(422).json({
                message: commonValidation.formatValidationErr(errors.mapped(), true),
                success: false
            });
        }
        let userFind = await userModel.find({"email": req.body.email})
        if (userFind.length >= 1) {
             return res.status(401).json({
               message: validationMessage.emailAlreadyExist,
               success: false,
             });
        }
        else {
            var roleType =await roleModel.findOne({ userType : "admin"});
            var salt = commonCrypto.generateSalt(6);
            var $data = req.body;
            //$data.salt = salt;
            $data.password = commonCrypto.hashPassword(
              $data.password,
              salt
            );
            $data.roleType = roleType._id;
            $data.permission = roleType.permissionObject;
            $data.firstTimeUser = true;
            $data.loggedInIp = commonSmtp.getIpAddress(req);
            $data.userSideActivationValue = confirmationNumber;
            let result =  await userModel($data).save();
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
            await emailVar.setTemplate(
              AvailiableTemplates.SIGNUP_CONFIRMATION,
              {
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                userId: result._id,
                userSideActivationValue: confirmationNumber
              }
            );
            await emailVar.sendEmail(result.email);


            return res.status(200).json({
              message: otherMessage.newRegister,
              result: result,
              token: token,
              success: true
            });            
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message ? error.message : 'Unexpected error occure.',
            success: false
        });
    }
}

const confirmationSignUp = async (req, res) => {
    try {
        let data = req.body;
        var userData = await userModel.findOne(
                                        {$and: [
                                            { _id: data.userId},
                                            {userSideActivation: false},
                                            {userSideActivationValue: data.activeValue}
                                            ]
                                        }
                                    );
        if(userData) {
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
            if(roleUpdate) {
                 const emailVar = new Email(res);
                await emailVar.setTemplate(
                   AvailiableTemplates.SIGNUP,
                   {
                     firstName: userData.firstName,
                     lastName: userData.lastName,
                   }
                );
                await emailVar.sendEmail(userData.email);
                res.status(200).json({
                  message: userData,
                  success: true
                });
            }
            else {
                res.status(401).json({
                  message: "Some thing Went Wrong",
                  success: false
                });
            }
            
        }
        else {
            res.status(401).json({
              message: userData,
              success: false
            });
        }
    }
    catch(error) {
        res.status(500).json({
            message: error.message ? error.message : 'Unexpected error occure.',
            success: false
        });
    }
}

module.exports = {
  signUp,
  confirmationSignUp
};