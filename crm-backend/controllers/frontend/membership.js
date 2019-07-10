const { StripeAPIKey } = require("./../../config/app");
const stripe = require("stripe")(StripeAPIKey);
const PlanModel = require("./../../models/plan");
const UserModel = require("./../../models/user");
const TransactionModel = require("./../../models/transaction");
const { validationResult } = require("express-validator/check");
const commonValidation = require("../../common");

/**
 *
 */
const subscribe = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    const { body, currentUser } = req;
    const { planId, cardNumber, expMonth, expYear, cvv } = body;
    const { id: userId } = currentUser;
    const plan = await PlanModel.findById(planId);
    if (!plan) {
      return res.status(400).json({
        message: "Invalid plan selected!"
      });
    }
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return res.status(400).json({
        message: "Invalid user!"
      });
    }
    let customerId = null;

    if (userDetails.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(
          userDetails.stripeCustomerId
        );
        if (customer.deleted) {
          throw new Error("Customer is deleted!");
        }
      } catch (error) {
        console.log(
          "Error, while fetching details of customer from stripe:",
          error.message
        );
      }
    }
    if (!customerId) {
      let tokenId = null;
      try {
        const token = await stripe.tokens.create({
          card: {
            number: cardNumber,
            exp_month: expMonth,
            exp_year: expYear,
            cvc: cvv
          }
        });
        tokenId = token.id;
      } catch (error) {
        console.log("Error, while creating token for stripe:", error);
      }
      if (tokenId) {
        try {
          const customer = await stripe.customers.create({
            name: `${userDetails.firstName} ${userDetails.lastName}`,
            email: `${userDetails.email}`,
            description: `Customer for ServiceAdvisor.io`,
            source: tokenId
          });
          customerId = customer.id;
          await UserModel.updateOne(
            {
              _id: userId
            },
            {
              $set: { stripeCustomerId: customerId }
            }
          );
        } catch (error) {
          console.log("Error, while creating customer for stripe:", error);
        }
      }
    }
    let transcation = {};
    if (customerId) {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            plan: plan.stripeId
          }
        ]
      });
      transcation = await TransactionModel.create({
        transactionType: "subscription",
        transactionId: subscription.id,
        amount: plan.amount,
        userId,
        parentId: userId,
        transactionDetails: subscription
      });
    }
    return res.status(200).json({
      message: "Subscribed Successfully!",
      transcation
    });
  } catch (error) {
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
module.exports = { subscribe };
