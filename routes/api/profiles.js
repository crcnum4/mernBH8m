const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
const isEmpty = require("../../utils/isEmpty");
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  console.log(req.user);
  res.json({ message: "test route" });
});

//Basic post route. Expects an entire profile in JSON.
// @route		POST api/profiles
// @desc		create profile for logged in user
// @access	private
router.post(
  "/",
  auth,
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("githubUrl", "Valid URL Required").optional().isURL(),
    check("twitterUrl", "Valid URL Required").optional().isURL(),
  ],
  async (req, res) => {
    console.log("POST request received:");
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        firstName,
        lastName,
        city,
        state,
        githubUrl,
        twitterUrl,
        bio,
      } = req.body;
      const userId = req.user.id;

      // Build profile object
      const profileFields = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        // name: `${firstName.trim()} ${lastName.trim()}`,
        // initials: `${firstName[0]}${lastName[0]}`
      };
      profileFields.name = `${profileFields.firstName} ${profileFields.lastName}`;
      profileFields.user = userId;
      if (bio) profileFields.bio = bio;
      if (city) profileFields.city = city;
      if (state) profileFields.state = state;

      //Build Social Object
      profileFields.social = {};
      if (githubUrl) profileFields.social.githubUrl = githubUrl;
      if (twitterUrl) profileFields.social.twitterUrl = twitterUrl;

      try {
        let profile = await Profile.findById(userId);

        if (!isEmpty(profile)) {
          //Update
          profile = await Profile.findByIdAndUpdate(
            userId,
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
        }

        //Create

        profile = await Profile.create(profileFields);
        res.json(profile);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// @route    GET api/profiles/self
// @desc     Get self profile
// @access   Private
router.get("/self", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error", err });
  }
});

// @route    GET api/profiles/:id
// @desc     Get profile by id
// @access   Public
router.get("/:id", async (req, res) => {
  try {
    // const profile = await Profile.findOne({ user: req.params.id });
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ msg: "There is no profile for this user" });
    }
    console.log(profile);
    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error", err });
  }
});

// @route    GET api/profiles
// @desc     Get all profiles - 1. do not send city and state and 2. do not include logged in user in results
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const profiles = await Profile.find(
      { user: { $ne: req.user.id } },
      { city: 0, state: 0, user: 0 }
    );
    if (!profiles) {
      return res.status(400).json({ msg: "Cannot access profiles." });
    }
    console.log(profiles);
    res.json(profiles);
  } catch (error) {
    console.error(err.message);
    s;
    res.status(500).send("Server Error");
  }
});

// @route		PUT api/profiles/
// @desc		update your profile
// @access	Private
router.put("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: "profile has not been created" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error);
  }
});

module.exports = router;
