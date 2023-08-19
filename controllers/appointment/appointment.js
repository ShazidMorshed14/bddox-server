const Appointment = require("../../models/appointment/appointment");
const { generateUniqueCode, formatPhoneNumber } = require("../../utils/utils");
const dayjs = require("dayjs");

const model_name = "Appointment";

const getAllAppointmentsOfDoctor = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;
    let { page, pageSize, pageLess, pid, aid, name, phone, type } = req.query;

    page = page ? parseInt(page) : 1;
    pageSize = pageSize ? parseInt(pageSize) : 10;

    let query = {};
    let totalCount = 0;

    query.doctorId = authenticatedUserId;

    if (aid) {
      query.aid = { $regex: aid, $options: "i" };
    }

    if (pid) {
      query["patientId.pid"] = pid.toString(); // Use dot notation to query nested field
      console.log("Query:", query);
      console.log("pid:", pid);
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

    // Add date filter based on the "type" parameter using Day.js
    if (type === "today") {
      const todayStart = dayjs().startOf("day");
      const todayEnd = dayjs().endOf("day");
      query.date = {
        $gte: todayStart.format("DD-MM-YYYY"),
        $lte: todayEnd.format("DD-MM-YYYY"),
      };
    } else if (type === "this_week") {
      const startOfWeek = dayjs().startOf("week");
      const endOfWeek = dayjs().endOf("week");
      query.date = {
        $gte: startOfWeek.format("DD-MM-YYYY"),
        $lte: endOfWeek.format("DD-MM-YYYY"),
      };
    } else if (type === "this_month") {
      const startOfMonth = dayjs().startOf("month");
      const endOfMonth = dayjs().endOf("month");
      query.date = {
        $gte: startOfMonth.format("DD-MM-YYYY"),
        $lte: endOfMonth.format("DD-MM-YYYY"),
      };
    }

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

const updateAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    await Appointment.findByIdAndUpdate(id, req.body, { new: true })
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

const appointmentDetails = async (req, res) => {
  const { id } = req.params;

  try {
    await Appointment.findOne({ _id: id })
      .populate("doctorId patientId")
      .then((data) => {
        return res.status(200).json({
          success: true,
          message: `${model_name} fetched Successfully!`,
          data: data,
        });
      });
  } catch (error) {
    return res.status(422).json({ error: error });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    await Appointment.findByIdAndDelete(id)
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
  addAppointment,
  getAllAppointmentsOfDoctor,
  updateAppointment,
  appointmentDetails,
  deleteAppointment,
};
