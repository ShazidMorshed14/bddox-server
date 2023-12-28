const Generic = require("../../models/generic/generic");
const slugify = require("slugify");

const model_name = "Generic";

const getAllGenericsOfDoctor = async (req, res) => {
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

    const Generics = await Generic.find(query);

    return res.status(200).json({
      status: 200,
      message: "Generics fetched successfully!",
      data: {
        generics: Generics,
      },
    });
  } catch (error) {
    console.error("Error fetching Generics:", error);
    res.status(500).json({ error: "Error fetching tags" });
  }
};

const addGeneric = async (req, res) => {
  try {
    const { name, status } = req.body;

    const checkIfAlreadyExists = await Generic.findOne({
      doctorId: req.user._id,
      name: name,
    });

    if (checkIfAlreadyExists) {
      return res.status(409).json({ message: "This Option already exists!" });
    }

    const newGeneric = new Generic({
      doctorId: req.user._id,
      name: name,
      sku: slugify(name),
      status: status ? status : "active",
    });

    await newGeneric
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

const updateGeneric = async (req, res) => {
  const { id } = req.params;

  try {
    await Generic.findByIdAndUpdate(id, req.body, { new: true })
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

const deleteGeneric = async (req, res) => {
  const { id } = req.params;

  try {
    await Generic.findByIdAndDelete(id)
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
  getAllGenericsOfDoctor,
  addGeneric,
  updateGeneric,
  deleteGeneric,
};
