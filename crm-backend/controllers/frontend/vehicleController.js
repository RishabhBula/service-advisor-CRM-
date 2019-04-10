const vehicleModal = require("../../models/vehicle");

/* ------------Add New Vehicle------------ */
const addNewVehicle = async (req, res) => {
  const { body } = req;
  try {
    const vehicleData = {
      notes: body.notes,
      year: parseInt(body.year),
      make: body.make,
      modal: body.modal,
      type: body.type,
      miles: body.miles,
      color: body.color,
      licensePlate: body.licensePlate,
      unit: body.unit,
      vin: body.vin,
      subModal: body.subModal,
      engineSize: body.engineSize,
      productionDate: body.productionDate,
      transmission: body.transmission,
      drivetrain: body.drivetrain,
    };
    const addVehicleData = new vehicleModal(vehicleData);
    const result = await addVehicleData.save();
    if (!result) {
      return res.status(400).json({
        responsecode: 400,
        message: "Error uploading vehicle data.",
        success: false,
      });
    } else {
      return res.status(200).json({
        responsecode: 200,
        message: "Vehicle data uploaded successfully!",
        success: true,
      });
    }
  } catch (error) {
    console.log("This is vehicle adding error", error);
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/* ------------Add New Vehicle End------------ */

module.exports = {
  addNewVehicle,
};
