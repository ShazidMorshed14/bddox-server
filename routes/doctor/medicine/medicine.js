const express = require("express");
const router = express.Router();

//importing the controllers
const medicineController = require("../../../controllers/medicine/medicine");
const { requireSignIn } = require("../../../middlewares/auth");

router.post("/create", requireSignIn, medicineController.addMedicine);

router.get(
  "/doctor-wise",
  requireSignIn,
  medicineController.getAllMedicinesOfDoctor
);

router.put("/update/:id", requireSignIn, medicineController.updateMedicine);
router.delete("/delete/:id", requireSignIn, medicineController.deleteMedicine);

module.exports = router;
