const express = require("express");
const router = express.Router();

//importing the controllers
const appointmentController = require("../../../controllers/appointment/appointment");
const { requireSignIn } = require("../../../middlewares/auth");

router.post("/create", requireSignIn, appointmentController.addAppointment);
router.get(
  "/doctor-wise",
  requireSignIn,
  appointmentController.getAllAppointmentsOfDoctor
);

// router.put("/update/:id", requireSignIn, patientController.updatePatient);
// router.delete("/delete/:id", requireSignIn, patientController.deletePatient);

module.exports = router;
