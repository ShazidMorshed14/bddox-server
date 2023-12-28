const Format = require("../../models/format/format");

const model_name = "Format";

const getAllFormatsOfDoctor = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;
    let { name, status } = req.query;

    let query = {};

    query.doctorId = authenticatedUserId;

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    const formats = await Format.find(query);

    return res.status(200).json({
      status: 200,
      message: "Formats fetched successfully!",
      data: {
        formats: formats,
      },
    });
  } catch (error) {
    console.error("Error fetching formats:", error);
    res.status(500).json({ error: "Error fetching tags" });
  }
};

const addFormat = async (req, res) => {
  try {
    const { name, status } = req.body;

    const checkIfAlreadyExists = await Format.findOne({
      doctorId: req.user._id,
      name: name,
    });

    if (checkIfAlreadyExists) {
      return res.status(409).json({ message: "This Option already exists!" });
    }

    const newFormat = new Format({
      doctorId: req.user._id,
      name: name,
      status: status ? status : "active",
    });

    await newFormat
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

const updateFormat = async (req, res) => {
  const { id } = req.params;

  try {
    await Format.findByIdAndUpdate(id, req.body, { new: true })
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

const deleteFormat = async (req, res) => {
  const { id } = req.params;

  try {
    await Format.findByIdAndDelete(id)
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
  getAllFormatsOfDoctor,
  addFormat,
  updateFormat,
  deleteFormat,
};
