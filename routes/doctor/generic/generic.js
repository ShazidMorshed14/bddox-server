const express = require("express");
const router = express.Router();

//importing the controllers
const genericController = require("../../../controllers/generic/generic");
const { requireSignIn } = require("../../../middlewares/auth");

router.post("/create", requireSignIn, genericController.addGeneric);

router.get(
  "/doctor-wise",
  requireSignIn,
  genericController.getAllGenericsOfDoctor
);

router.put("/update/:id", requireSignIn, genericController.updateGeneric);
router.delete("/delete/:id", requireSignIn, genericController.deleteGeneric);

module.exports = router;
