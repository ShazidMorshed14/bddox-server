const Prescription = require("../../models/prescription/prescription");

const model_name = "Prescription";

const getAllPrescription = async (req, res) => {
  try {
    let { id, doctor_uid } = req.query;

    const queryObj = {};

    if (id) {
      queryObj._id = id;
    }
    if (doctor_uid) {
      queryObj.doctor_uid = { $regex: doctor_uid, $options: "i" };
    }

    const data = await Prescription.find(queryObj)
      .sort({ _id: -1 })
      .populate("doctorId");

    return res.status(200).json({
      success: true,
      message: `${model_name} fetched successfully!`,
      data: data || [], // Return an empty array if data is falsy (null, undefined, etc.)
    });
  } catch (error) {
    if (error.name === "CastError") {
      // Handle the specific CastError for ObjectId
      return res.status(200).json({
        success: true,
        message: `${model_name} fetched successfully!`,
        data: [], // Return an empty array when the id is invalid
      });
    } else {
      console.log(error);
      return res.status(422).json({ error: error });
    }
  }
};

const addPrescription = async (req, res) => {
  try {
    const { topLeft, topRight, bottomLeft, bottomRight } = req.body;

    const previousPrescription = await Prescription.findOne({
      doctorId: req.user._id,
    });

    if (previousPrescription) {
      return res
        .status(409)
        .json({ message: "User Already has a prescription!" });
    }

    const newPrescription = new Prescription({
      doctorId: req.user._id,
      doctor_uid: req.user.uid,
      topLeft: topLeft,
      topRight: topRight,
      bottomLeft: bottomLeft,
      bottomRight: bottomRight,
    });

    await newPrescription
      .save()
      .then((data) => {
        res.status(200).json({
          success: true,
          message: `${model_name} Added Successfully!`,
          data: data,
        });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } catch (error) {
    return res.status(422).json({ error: error });
  }
};

const updatePrescription = async (req, res) => {
  const { id } = req.params;

  try {
    await Prescription.findByIdAndUpdate(id, req.body, { new: true })
      .then((data) => {
        res.status(200).json({
          success: true,
          message: `${model_name} Updated Successfully!`,
          data: data,
        });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } catch (error) {
    return res.status(422).json({ error: error });
  }
};

const prescriptionDetails = async (req, res) => {
  const { id } = req.params;

  try {
    await Prescription.findOne({ _id: id })
      .populate("doctorId")
      .then((data) => {
        return res.status(200).json({
          success: true,
          message: `${model_name} fetched Successfully!`,
          data: data,
        });
      });
  } catch (error) {
    return res.status(422).json({ error: error });
  }
};

const doctorPrescriptionDetails = async (req, res) => {
  try {
    await Prescription.findOne({ doctorId: req.user._id })
      .populate("doctorId")
      .then((data) => {
        return res.status(200).json({
          success: true,
          message: `${model_name} fetched Successfully!`,
          data: data,
        });
      });
  } catch (error) {
    return res.status(422).json({ error: error });
  }
};

const deletePrescription = async (req, res) => {
  const { id } = req.params;

  try {
    await Prescription.findByIdAndDelete(id)
      .then((data) => {
        res.status(200).json({
          success: true,
          message: `${model_name} deleted Successfully!`,
          data: data,
        });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } catch (error) {
    return res.status(422).json({ error: error });
  }
};

module.exports = {
  addPrescription,
  getAllPrescription,
  updatePrescription,
  prescriptionDetails,
  doctorPrescriptionDetails,
  deletePrescription,
};
