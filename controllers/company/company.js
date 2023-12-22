const Company = require("../../models/company/company");
const slugify = require("slugify");

const model_name = "Company";

const getAllCompanysOfDoctor = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;
    let { name, sku, status } = req.query;

    let query = {};

    query.doctorId = authenticatedUserId;

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (sku) {
      query.sku = { $regex: sku, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    const companies = await Company.find(query);

    return res.status(200).json({
      status: 200,
      message: "Companys fetched successfully!",
      data: {
        companies: companies,
      },
    });
  } catch (error) {
    console.error("Error fetching Companys:", error);
    res.status(500).json({ error: "Error fetching tags" });
  }
};

const addCompany = async (req, res) => {
  try {
    const { name, status } = req.body;

    const checkIfAlreadyExists = await Company.findOne({
      doctorId: req.user._id,
      name: name,
    });

    if (checkIfAlreadyExists) {
      return res.status(409).json({ message: "This Option already exists!" });
    }

    const newCompany = new Company({
      doctorId: req.user._id,
      name: name,
      sku: slugify(name),
      status: status ? status : "active",
    });

    await newCompany
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

const updateCompany = async (req, res) => {
  const { id } = req.params;

  try {
    await Company.findByIdAndUpdate(id, req.body, { new: true })
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

const deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    await Company.findByIdAndDelete(id)
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
  getAllCompanysOfDoctor,
  addCompany,
  updateCompany,
  deleteCompany,
};
