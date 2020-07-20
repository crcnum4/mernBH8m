const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route		GET api/posts/test
// @desc		Test Route
// @access	Public

router.get("/test", (req, res) => {
  res.json({ msg: "It worked!" });
});

// @route		POST api/posts/
// @desc		create a new post
// @access	private
router.post(
  "/",
  auth,
  [
    check("author", "Valid author required").not().isEmpty(),
    check("skillLevel", "Need Skill Level").not().isEmpty(),
    check("skillLevel", "Select from dropdown").isIn([
      "Beginner",
      "Intermediate",
      "Advanced",
      "Associate",
      "Junior",
      "Senior",
      "Lead",
    ]),
    check("title", "Need title").notEmpty(),
    check("summary", "Need summary").notEmpty(),
    check("link", "Need Link").notEmpty(),
    check("link", "Valid URL required").isURL(),
    check("resourceType", "Need resource type").notEmpty(),
    check("resourceType", "Choose valid resource Type").isIn([
      "Other",
      "Article",
      "Video",
      "Slideshow",
      "Book",
      "eBook",
      "PodCast",
    ]),
    check("publishedAt", "Date").optional().isISO8601(),
    check("videoLength", "video length must be a number").optional().isInt(),
    check("timeToComplete", "Must be a number").optional().isInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // store postData in variable
      const postData = req.body;
      // need to get profile matching the userID
      const profile = await Profile.findOne({ user: req.user.id });
      // add profileID to postData
      postData.poster = profile.id;
      // create the post in the database &
      // respond with the post data.
      return res.json(await Post.create(postData));
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

// timeToComplete -> number -> optional

// if valid - how do we know if the data is valid? express-validator
// Post model -> post to the Post model
// return the new Post

module.exports = router;
