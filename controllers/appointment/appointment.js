const Appointment = require("../../models/appointment/appointment");
const { generateUniqueCode, formatPhoneNumber } = require("../../utils/utils");

const model_name = "Appointment";

const getAllAppointmentsOfDoctor = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;
    let { page, pageSize, pageLess, pid, name, phone } = req.query;

    page = page ? parseInt(page) : 1;
    pageSize = pageSize ? parseInt(pageSize) : 10;

    let query = {};
    let totalCount = 0;

    query.doctorId = authenticatedUserId;

    if (pid) {
      query.pid = { $regex: pid, $options: "i" };
    }

    // if (phone) {
    //   if (phone.startsWith("+")) {
    //     phone = phone.substring(1); // Remove the leading "+"
    //   }
    //   query.phone = { $regex: phone, $options: "i" };
    // }

    // if (name) {
    //   query.name = { $regex: name, $options: "i" };
    // }

    if (pageLess) {
      // If pageLess is true, return all patients
      const appointments = await Appointment.find(query).populate("patientId");
      totalCount = appointments.length;

      if (pageLess !== undefined && pageLess === "true") {
        return res.status(200).json({
          status: 200,
          message: "Mappings fetched successfully!",
          data: {
            appointments: appointments,
            total: totalCount,
          },
        });
      }
    } else {
      // If pageLess is false or not provided, apply pagination
      const skip = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const paginatedAppointments = await Appointment.find(query)
        .populate("patientId")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

      totalCount = await Appointment.countDocuments(query);

      return res.status(200).json({
        status: 200,
        message: `${model_name} fetched successfully!`,
        data: {
          appointments: paginatedAppointments,
          total: totalCount,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Error fetching patients" });
  }
};

const addAppointment = async (req, res) => {
  try {
    const {
      patientId,
      date,
      time,
      next_visiting_date,
      payment,
      payment_status,
      status,
    } = req.body;

    const checkExistingAppointmentTiming = await Appointment.findOne({
      time: time,
      date: date,
    });

    if (checkExistingAppointmentTiming) {
      return res
        .status(409)
        .json({ message: "Appointment already exists on that day!" });
    }

    const newAppointment = new Appointment({
      aid: `AID-${generateUniqueCode()}`,
      doctorId: req.user._id,
      patientId: patientId,
      date: date,
      time: time,
      next_visiting_date: next_visiting_date,
      payment: payment ? payment : 0,
      payment_status: payment_status ? payment_status : "unpaid",
      status: status ? status : "pending",
    });

    await newAppointment
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

// const updatePatient = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Patient.findByIdAndUpdate(id, req.body, { new: true })
//       .then((data) => {
//         res.status(200).json({
//           success: true,
//           message: `${model_name} Updated Successfully!`,
//           data: data,
//         });
//       })
//       .catch((err) => {
//         return res.status(422).json({ message: err });
//       });
//   } catch (error) {
//     return res.status(422).json({ message: error });
//   }
// };

// const patientDetails = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Patient.findOne({ _id: id })
//       .populate("ref")
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

// const deletePatient = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Patient.findByIdAndDelete(id)
//       .then((data) => {
//         res.status(200).json({
//           success: true,
//           message: `${model_name} deleted Successfully!`,
//           data: data,
//         });
//       })
//       .catch((err) => {
//         return res.status(422).json({ message: err });
//       });
//   } catch (error) {
//     return res.status(422).json({ message: error });
//   }
// };

module.exports = {
  addAppointment,
  getAllAppointmentsOfDoctor,
};
