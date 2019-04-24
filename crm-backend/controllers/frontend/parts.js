const Parts = require("./../../models/parts");
const add = async (req, res) => {
  try {
    const { body, currentUser } = req;
    /* {"note":"","partNumber":"","vendorId":"5cbf111d4ddf7b2a7dd26bd4","location":"","priceMatrix":"","cost":"","price":"","markup":"","margin":"","criticalQuantity":"","quantity":""}
     */
    const {
      partDescription,
      note,
      priceMatrix,
      vendorId,
      location,
      cost,
      price,
      markup,
      margin,
      criticalQuantity,
      quantity
    } = body;
    let data = {
      createdBy: currentUser.id,
      parentId: currentUser.parentId,
      partDescription,
      note: note || "",
      location: location || "",
      cost: cost || 0,
      price: price || 0,
      markup: markup || 0,
      margin: margin || 0,
      criticalQuantity: criticalQuantity || 0,
      quantity: quantity || 0
    };
    if (priceMatrix) {
      data.priceMatrix = priceMatrix;
    }
    if (vendorId) {
      data.vendorId = vendorId;
    }
    const part = new Parts(data);
    const result = await part.save();
    res.status(200).json({
      message: "Part details added successfully.",
      result
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({
      message:
        "We are having problem adding part details, please try again after some time."
    });
  }
};

module.exports = {
  add
};
