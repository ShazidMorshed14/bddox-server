const express = require("express");
const router = express.Router();

//importing the controllers
const companyController = require("../../../controllers/company/company");
const { requireSignIn } = require("../../../middlewares/auth");

router.post("/create", requireSignIn, companyController.addCompany);

router.get(
  "/doctor-wise",
  requireSignIn,
  companyController.getAllCompanysOfDoctor
);

router.put("/update/:id", requireSignIn, companyController.updateCompany);
router.delete("/delete/:id", requireSignIn, companyController.deleteCompany);

module.exports = router;
