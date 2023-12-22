const Medicine = require("../../models/medicine/medicine");
const slugify = require("slugify");
const { generateUniqueCode } = require("../../utils/utils");

const model_name = "Medicine";

const getAllMedicinesOfDoctor = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;
    let {
      name,
      sku,
      formatId,
      genericId,
      companyId,
      status,
      pageLess,
      page,
      pageSize,
    } = req.query;

    let query = {};
    let totalCount = 0;

    query.doctorId = authenticatedUserId;

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (sku) {
      query.sku = { $regex: sku, $options: "i" };
    }

    if (formatId) {
      query.formatId = formatId;
    }

    if (genericId) {
      query.genericId = genericId;
    }

    if (companyId) {
      query.companyId = companyId;
    }

    if (status) {
      query.status = status;
    }

    if (pageLess) {
      // If pageLess is true, return all patients
      const Medicines = await Medicine.find(query).populate(
        "formatId genericId companyId"
      );
      totalCount = Medicines.length;

      if (pageLess !== undefined && pageLess === "true") {
        return res.status(200).json({
          status: 200,
          message: "Medicines fetched successfully!",
          data: {
            medicines: Medicines,
            total: totalCount,
          },
        });
      }
    } else {
      // If pageLess is false or not provided, apply pagination
      const skip = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const paginatedMedicines = await Medicine.find(query)
        .populate("formatId genericId companyId")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

      totalCount = await Medicine.countDocuments(query);

      return res.status(200).json({
        status: 200,
        message: `${model_name} fetched successfully!`,
        data: {
          medicines: paginatedMedicines,
          total: totalCount,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching Medicines:", error);
    res.status(500).json({ error: "Error fetching tags" });
  }
};

const addMedicine = async (req, res) => {
  try {
    const { name, formatId, genericId, companyId, status } = req.body;

    const checkIfAlreadyExists = await Medicine.findOne({
      doctorId: req.user._id,
      name: name,
    });

    if (checkIfAlreadyExists) {
      return res.status(409).json({ message: "This Option already exists!" });
    }

    const newMedicine = new Medicine({
      doctorId: req.user._id,
      name: name,
      sku: `${slugify(name)}-${generateUniqueCode()}`,
      formatId: formatId,
      genericId: genericId,
      companyId: companyId,
      status: status ? status : "active",
    });

    await newMedicine
      .save()
      .then((data) => {
        res.status(200).json({
          success: true,
          message: `${model_name} Registered Successfully!`,
          data: data,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(422).json({ message: err });
      });
  } catch (error) {
    return res.status(422).json({ message: error });
  }
};

const updateMedicine = async (req, res) => {
  const { id } = req.params;

  try {
    await Medicine.findByIdAndUpdate(id, req.body, { new: true })
      .then((data) => {
        res.status(200).json({
          success: true,
          message: `${model_name} Updated Successfully!`,
          data: data,
        });
      })
      .catch((err) => {
        return res.status(422).json({ message: err });
      });
  } catch (error) {
    return res.status(422).json({ message: error });
  }
};

const deleteMedicine = async (req, res) => {
  const { id } = req.params;

  try {
    await Medicine.findByIdAndDelete(id)
      .then((data) => {
        res.status(200).json({
          success: true,
          message: `${model_name} deleted Successfully!`,
          data: data,
        });
      })
      .catch((err) => {
        return res.status(422).json({ message: err });
      });
  } catch (error) {
    return res.status(422).json({ message: error });
  }
};

module.exports = {
  getAllMedicinesOfDoctor,
  addMedicine,
  updateMedicine,
  deleteMedicine,
};
