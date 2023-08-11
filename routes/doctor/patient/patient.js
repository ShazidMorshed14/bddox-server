const express = require("express");
const router = express.Router();

//importing the controllers
const patientController = require("../../../controllers/patient/patient");
const { requireSignIn } = require("../../../middlewares/auth");

router.post("/create", requireSignIn, patientController.addPatient);
router.get(
  "/doctor-wise",
  requireSignIn,
  patientController.getAllPatientsOfDoctor
);

router.put("/update/:id", requireSignIn, patientController.updatePatient);
router.delete("/delete/:id", requireSignIn, patientController.deletePatient);

module.exports = router;
