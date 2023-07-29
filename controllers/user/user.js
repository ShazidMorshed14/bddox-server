const User = require("../../models/user/user");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  generateUniqueCode,
  generateHashedPassword,
} = require("../../utils/utils");

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      degrees,
      image,
      isSubscribed,
      user_weight,
    } = req.body;

    await User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          return res.status(409).json({ message: "Email Already exists" });
        } else {
          const user = new User({
            name: name,
            email: email,
            password: generateHashedPassword(password),
            role: role ? role : "doctor",
            degrees: degrees ? degrees : [],
            image: image
              ? image
              : "https://res.cloudinary.com/aventra/image/upload/v1676883327/default-avatar-png_okjzqd.png",
            isSubscribed: isSubscribed ? isSubscribed : false,
            user_weight: user_weight ? user_weight : 2,
            uid: `DID-${generateUniqueCode()}`,
          });

          user
            .save()
            .then((userData) => {
              res.status(200).json({ user: userData });
            })
            .catch((err) => {
              console.log(err);
              return res.status(422).json({ message: err });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(422).json({ message: err });
      });
  } catch (err) {
    console.log(err);
    return res.status(422).json({ message: err });
  }
};

const signin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      const {
        _id,
        password,
        name,
        email,
        role,
        degrees,
        image,
        isSubscribed,
        user_weight,
        uid,
      } = user;
      if (bcrypt.compareSync(req.body.password, password)) {
        //creating token with userId
        var token = jwt.sign({ _id: _id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });

        return res.status(200).json({
          status: 200,
          message: "User logged in successfully",
          data: {
            user: {
              _id,
              name,
              email,
              role,
              degrees,
              image,
              isSubscribed,
              user_weight,
              uid,
            },
            token: token,
          },
        });
      } else {
        return res.status(422).json({ message: "Email or Password not valid" });
      }
    } else {
      return res.status(404).json({ message: "No user with this email" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { signup, signin };
