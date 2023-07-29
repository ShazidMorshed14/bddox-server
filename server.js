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
const user_routes = require("./routes/user/user");

app.use("/api/v1/auth", user_routes);

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
