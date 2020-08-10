const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Posts = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route		POST api/posts/:postID/comments
// @desc		create a new comment
// @access	private

// Epic:
// Add a comment to a post
// Return updated comments array

// Ensure that user is logged in
// Find post by the postID
// Get the comment from the request
// ** below could be unlocking
// build comment object (get profile id through user ID)
// add the comment to the post
// ** end the possible locking
// We need to get/verify User Profile
// Return comments array

module.exports = router;
