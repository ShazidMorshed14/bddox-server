const Tag = require("../../models/tag/tag");

const model_name = "Tag";

const getAllTagsOfDoctor = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;
    let { type } = req.query;

    let query = {};

    query.doctorId = authenticatedUserId;

    if (type) {
      query.type = { $regex: type, $options: "i" };
    }

    const tags = await Tag.find(query);

    return res.status(200).json({
      status: 200,
      message: "Tags fetched successfully!",
      data: {
        tags: tags,
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Error fetching tags" });
  }
};

const addTag = async (req, res) => {
  try {
    const { value, type } = req.body;

    const checkIfAlreadyExists = await Tag.findOne({
      doctorId: req.user._id,
      value: value,
      type: type,
    });

    if (checkIfAlreadyExists) {
      return res.status(409).json({ message: "This Option already exists!" });
    }

    const newTag = new Tag({
      doctorId: req.user._id,
      value: value,
      type: type ? type : "cc",
    });

    await newTag
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

module.exports = {
  getAllTagsOfDoctor,
  addTag,
};
