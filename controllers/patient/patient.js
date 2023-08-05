const Patient = require("../../models/patient/patient");
const { generateUniqueCode, formatPhoneNumber } = require("../../utils/utils");

const model_name = "Patient";

const getAllPatientsOfDoctor = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;
    let { page, pageSize, pageLess, pid, name, phone } = req.query;

    page = page ? parseInt(page) : 1;
    pageSize = pageSize ? parseInt(pageSize) : 10;

    let query = {};
    let totalCount = 0;

    query.ref = authenticatedUserId;

    if (pid) {
      query.pid = { $regex: pid, $options: "i" };
    }

    if (phone) {
      if (phone.startsWith("+")) {
        phone = phone.substring(1); // Remove the leading "+"
      }
      query.phone = { $regex: phone, $options: "i" };
    }

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (pageLess) {
      // If pageLess is true, return all patients
      const patients = await Patient.find(query);
      totalCount = patients.length;

      if (pageLess !== undefined && pageLess === "true") {
        return res.status(200).json({
          status: 200,
          message: "Mappings fetched successfully!",
          data: {
            patients: patients,
            total: totalCount,
          },
        });
      }
    } else {
      // If pageLess is false or not provided, apply pagination
      const skip = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const paginatedPatients = await Patient.find(query)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

      totalCount = await Patient.countDocuments(query);

      return res.status(200).json({
        status: 200,
        message: `${model_name} fetched successfully!`,
        data: {
          patients: paginatedPatients,
          total: totalCount,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Error fetching patients" });
  }
};

const addPatient = async (req, res) => {
  try {
    const { name, dob, address, phone, gender } = req.body;

    const previousPatient = await Patient.findOne({
      phone: phone,
    });

    if (previousPatient) {
      return res.status(409).json({ message: "Phone number already exists!" });
    }

    const newPatient = new Patient({
      name: name,
      pid: `PID-${generateUniqueCode()}`,
      dob: dob,
      address: address,
      phone: formatPhoneNumber(phone),
      gender: gender ? gender : "male",
      ref: [req.user._id],
    });

    await newPatient
      .save()
      .then((data) => {
        res.status(200).json({
          success: true,
          message: `${model_name} Registered Successfully!`,
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

// const updatePrescription = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Prescription.findByIdAndUpdate(id, req.body, { new: true })
//       .then((data) => {
//         res.status(200).json({
//           success: true,
//           message: `${model_name} Updated Successfully!`,
//           data: data,
//         });
//       })
//       .catch((err) => {
//         return res.status(422).json({ error: err });
//       });
//   } catch (error) {
//     return res.status(422).json({ error: error });
//   }
// };

// const prescriptionDetails = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Prescription.findOne({ _id: id })
//       .populate("doctorId")
//       .then((data) => {
//         return res.status(200).json({
//           success: true,
//           message: `${model_name} fetched Successfully!`,
//           data: data,
//         });
//       });
//   } catch (error) {
//     return res.status(422).json({ error: error });
//   }
// };

// const doctorPrescriptionDetails = async (req, res) => {
//   try {
//     await Prescription.findOne({ doctorId: req.user._id })
//       .populate("doctorId")
//       .then((data) => {
//         return res.status(200).json({
//           success: true,
//           message: `${model_name} fetched Successfully!`,
//           data: data,
//         });
//       });
//   } catch (error) {
//     return res.status(422).json({ error: error });
//   }
// };

// const deletePrescription = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Prescription.findByIdAndDelete(id)
//       .then((data) => {
//         res.status(200).json({
//           success: true,
//           message: `${model_name} deleted Successfully!`,
//           data: data,
//         });
//       })
//       .catch((err) => {
//         return res.status(422).json({ error: err });
//       });
//   } catch (error) {
//     return res.status(422).json({ error: error });
//   }
// };

module.exports = {
  addPatient,
  getAllPatientsOfDoctor,
};
