const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//importing mongodb connection function
const connecDB = require("./db/connect");

//importing the routes
const user_routes = require("./routes/doctor/user/user");
const dashboard_routes = require("./routes/doctor/dashboard/dashboard");
const prescription_routes = require("./routes/doctor/prescription/prescription");
const patient_routes = require("./routes/doctor/patient/patient");
const appointment_routes = require("./routes/doctor/appointment/appointment");
const tag_routes = require("./routes/doctor/tag/tag");
const format_routes = require("./routes/doctor/format/format");
const generic_routes = require("./routes/doctor/generic/generic");

//assigning the routes
app.use("/api/v1/auth", user_routes);
app.use("/api/v1/dashboard", dashboard_routes);
app.use("/api/v1/prescription", prescription_routes);
app.use("/api/v1/patient", patient_routes);
app.use("/api/v1/appointment", appointment_routes);
app.use("/api/v1/tag", tag_routes);
app.use("/api/v1/format", format_routes);
app.use("/api/v1/generic", generic_routes);

const start = async () => {
  try {
    await connecDB(process.env.MONGOURI);
    app.listen(PORT, () => {
      console.log(`app running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
