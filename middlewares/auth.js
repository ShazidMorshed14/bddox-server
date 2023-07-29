require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireSignIn = (req, res, next) => {
  const { authorization } = req.headers;
  //console.log(authorization);

  if (!authorization) {
    return res.status(409).json({ error: "token not authorized" });
  } else {
    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(409).json({ error: err });
      } else {
        const { _id } = payload;
        //console.log(_id);

        User.findOne({ _id: _id })
          .then((foundUser) => {
            if (foundUser) {
              req.user = foundUser;
              req.user.password = undefined; //hiding the hashed password
              //console.log(req.user);
              next();
            } else {
              return res.status(404).json({ error: "No user exists" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(409).json({ message: "Access Denied" });
  } else {
    next();
  }
};

module.exports = { requireSignIn, adminMiddleware };
