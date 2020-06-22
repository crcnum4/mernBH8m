const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bio: String,
    city: String,
    state: String,
    avatar: String,
    githubUrl: String,
    twitterUrl: String,
  },
  //timestamps(updated at and created at) will track changes to data
  //mongoose will handle the timestamps
  { timestamps: {} }
);

module.exports = Profile = mongoose.model("profiles", profileSchema);
