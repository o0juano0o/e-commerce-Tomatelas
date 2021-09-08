const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("../config/auth");

router.use("/users", require("./users"));
router.use("/productos", require("./products"));

// Register
router.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const {
      userName,
      email,
      firstName,
      lastName,
      gender,
      password,
      street,
      city,
      province,
      zipCode,
      phone,
    } = req.body;

    // Validate user input
    if (!(email && password && userName && firstName && lastName)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database

    const oldUser = await User.findOne({ where: { email } });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    // let encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      userName,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      firstName,
      lastName,
      gender,
      password,
      street,
      city,
      province,
      zipCode,
      phone,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user.id, userName },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// Login
router.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { userName, password } = req.body;

    // Validate user input
    if (!(userName && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database

    const user = await User.findOne({ where: { userName } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user.id, userName },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      // user
      res.status(200).json(user);
    }
    // res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.get("/welcome", auth, (req, res) => {
  res.status(200).send(`Welcome ${req.user.user_id}`);
});

module.exports = router;
