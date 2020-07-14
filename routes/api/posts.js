const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");

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
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return res.json(req.body);
  }
);
// link -> string -> url
// resourceType -> string -> enum
// publishedAt -> date -> optional
// videolength -> number -> optional
// timeToComplete -> number -> optional

// if valid - how do we know if the data is valid? express-validator
// Post model -> post to the Post model
// return the new Post

module.exports = router;
