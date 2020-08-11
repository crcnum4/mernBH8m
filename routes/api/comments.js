const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
// route soure  |server.js|posts.js        |
// @route		POST api/posts/:postID/comments
// @desc		create a new comment
// @access	private

// Epic:
// Add a comment to a post
// Return updated comments array

router.post("/:postID", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(400)
        .json({ message: "Profile required to add comments." });
    }
    const comment = {
      profile: profile._id,
      content: req.body.content,
    };
    console.log(req.params.postID);
    const post = await Post.findByIdAndUpdate(
      req.params.postID,
      {
        $push: { comments: comment },
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
// *** Non-Locking method *** //
/*
const post = await Post.findById(req.params.postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(400)
        .json({ message: "Profile required to add comments." });
    }
    const comment = {
      profile: profile._id,
      content: req.body.content,
    };
    post.comments.push(comment);
    await post.save();
    res.json(post.comments);
*/

// @route		DELETE api/posts/comments/:postID/:commentID
// @desc    delete a comment
// @access  owner
router.delete("/:postID/:commentID", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const commentIndex = post.comments.findIndex((comment) => {
      return comment._id === req.params.commentID;
    });
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const profile = await Profile.findOne({ user: req.user.id });
    if (post.comments[commentIndex].profile !== profile._id) {
      return res.status(401).json({ message: "Unauthorized deletion" });
    }

    post = await Post.findByIdAndUpdate(
      req.params.postID,
      {
        $pull: {
          comments: { _id: req.params.commentID },
          profile: profile._id,
        },
      },
      { new: true }
    );
    res.json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
// epic: find and delete a comment from a post return the new comment array

//get comment by id
//make sure we're owner of comment
//remove comment
//return post

module.exports = router;
