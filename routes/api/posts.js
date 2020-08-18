const express = require("express");
const router = express.Router();
const commentsRouter = require("./comments");

const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route		GET api/posts/test
// @desc		Test Route
// @access	Public

router.get("/test", (req, res) => {
  res.json({ msg: "It works!" });
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
//-----Locking Method----//
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
//-----Non Locking Method----//
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

// @route		DELETE api/posts/:id
// @desc		Delete the post by id
// @access	owner
//-----Locking Method----//
router.delete("/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const result = await Post.findOneAndDelete({
      _id: req.params.id,
      poster: profile._id,
    });

    if (!result) {
      //did not delete anything
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      res.status(401).json({ msg: "Unauthorized" });
    }

    return res.status(204).json({ msg: "Success!" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
//-----Non Locking Method----//
// router.delete('/:id', auth, async(req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if( !post ) {
//       return res.status(404).json({ msg: "Post not found"})
//     }
//     //Check user
//     const profile = await Profile.findById(post.poster);

//     if( req.user.id !== profile.user) {
//       return res.status(401).json({ msg: "Unauthorized"})
//     }

//    await post.remove();

//    res.json({ msg: "Post Removed"});

//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error)
//    }
// })

// @route		PUT api/posts/:postId/like
// @desc		add or remove a like from a post.
// @access	private
router.put("/:postID/like", auth, async (req, res) => {
  let post;
  try {
    if (req.body.like === true) {
      post = await Post.findByIdAndUpdate(
        req.params.postID,
        {
          $addToSet: { likes: req.user.id },
        },
        { new: true }
      );
    } else if (req.body.like === false) {
      post = await Post.findByIdAndUpdate(
        req.params.postID,
        {
          $pull: { likes: req.user.id },
        },
        { new: true }
      );
    }
    res.status(200).json({ likes: post.likes.length });
  } catch (error) {
    console.log("Error in /" + req.params.postID + "/like: " + error.message);
    res.status(500).json(error);
  }
});

router.use("/comments", commentsRouter);

module.exports = router;
