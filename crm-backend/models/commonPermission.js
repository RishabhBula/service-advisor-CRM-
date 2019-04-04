const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DiscountType = new Schema({
  status: {
    type: Boolean
  },
  percentageDiscount: {
    type: Number
  }
});
const LaboutRateType = new Schema({
  status: {
    type: Boolean
  },
  laborRate: {
    type: Schema.Types.ObjectId,
    ref: "RateStandard",
    default: null
  }
});
const PriceMatrixOptions = new Schema({
  status: {
    type: Boolean
  },
  pricingMatrix: {
    type: Schema.Types.ObjectId
  }
});
const PermissionObject = new Schema({
  isCorporateFleetTaxExempt: {
    type: Boolean
  },
  shouldReceiveDiscount: {
    type: DiscountType
  },
  shouldLaborRateOverride: {
    type: LaboutRateType
  },
  shouldPricingMatrixOverride: {
    type: PriceMatrixOptions
  }
});

module.exports = { PermissionObject };