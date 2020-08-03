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

// @route		GET api/posts/
// @desc		get all posts
// @access	public
router.get("/", async (req, res) => {
  try {
    // access DB with Post model to get all posts
    const posts = await Post.find({ deleted: false }).populate(
      "poster",
      "avatar name firstName"
    );

    // send data back to requester
    res.json(posts);
  } catch (error) {
    // if not, return error
    console.error(error);
    return res.status(500).json(error);
  }
});

// get one post by id

// @route		GET api/posts/:postId
// @desc		get a single post by the id
// @access	public
router.get("/:postId", async (req, res) => {
  // get a single post and return it to the requester
  try {
    // access data base via post model to get a single post
    const post = await Post.findById(req.params.postId).populate("poster", [
      "name",
      "avatar",
      "firstName",
    ]);
    // handle errors
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    // send it back to requester if found
    res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// @route		PUT api/posts/:postId
// @desc		update an existing post
// @access	owner
router.put("/:postId", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    console.log(profile._id);
    console.log(req.params.postId);

    const post = await Post.findOneAndUpdate(
      { _id: req.params.postId, poster: profile._id },
      req.body,
      { new: true }
    );

    console.log(post);

    if (!post) {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ msg: "post not found" });
      }
      return res.status(401).json({ msg: "Unauthorized" });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});
/*
router.put("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const profile = await Profile.findById(post.poster);

    if (req.user.id !== profile.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const postData = { ...post, ...req.body };

    await post.update(postData);

    return res.json(post);
    /
      const profile = await Profile.find({user: req.user.id});

      if (profile._id !== post.poster)
    /
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
*/

// epic: get and update an existing post
// modify the data
// comit the changes to the database
// send the new data back to requester

module.exports = router;
