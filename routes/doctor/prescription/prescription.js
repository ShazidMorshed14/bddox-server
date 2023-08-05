const express = require("express");
const router = express.Router();

const prescriptionController = require("../../../controllers/prescription/prescription");
const { requireSignIn } = require("../../../middlewares/auth");

//importing the controllers

router.get("/", requireSignIn, prescriptionController.getAllPrescription);
router.get(
  "/details/:id",
  requireSignIn,
  prescriptionController.prescriptionDetails
);
router.get(
  "/doctor-prescription",
  requireSignIn,
  prescriptionController.doctorPrescriptionDetails
);
router.post("/create", requireSignIn, prescriptionController.addPrescription);
router.put(
  "/update/:id",
  requireSignIn,
  prescriptionController.updatePrescription
);

router.delete(
  "/delete/:id",
  requireSignIn,
  prescriptionController.deletePrescription
);

module.exports = router;
