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

router.get(
  "/details/:id",
  requireSignIn,
  appointmentController.appointmentDetails
);

router.put(
  "/update/:id",
  requireSignIn,
  appointmentController.updateAppointment
);

router.delete(
  "/delete/:id",
  requireSignIn,
  appointmentController.deleteAppointment
);

module.exports = router;
