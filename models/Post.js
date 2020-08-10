const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "profiles",
      required: true,
    },
    content: { type: String, required: true },
    // likes:
    // just like - twitter
    // upvoting 'likeing' or downvoting or 'dislike' -> youtube
    // feelings - like, dislike, interesting, hate, love, sorry, informative -> new facebook
    // rank - stars 1 to 5 etc
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: {} }
);

const postSchema = new Schema(
  {
    poster: {
      type: Schema.Types.ObjectId,
      ref: "profiles",
      required: true,
    },
    deleted: { type: Boolean, default: false },
    author: { type: String, required: true },
    skillLevel: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Associate",
        "Junior",
        "Senior",
        "Lead",
      ],
      required: true,
    },
    cohort: String,
    title: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      default: ["Other"],
    },
    summary: { type: String, required: true },
    link: { type: String, required: true },
    resourceType: {
      type: String,
      enum: [
        "Other",
        "Article",
        "Video",
        "Slideshow",
        "Book",
        "eBook",
        "PodCast",
      ],
      required: true,
    },
    publishedAt: Date,
    videoLength: Number,
    timeToComplete: Number,
    comments: { type: [commentSchema], default: [] },
    // TODO rating - user 1 rating 1 to 5 rating. an array of json objects with user id and rating
    // rating: {
    //   type: [
    //     {
    //       user: {
    //         //Could also be profile
    //         type: Schema.Types.ObjectId,
    //         required: true,
    //       },
    //       rating: Number,
    //     },
    //   ],
    //   default: [],
    // },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    // TODO archive
    // TODO featured
  },
  { timestamps: {} }
);

module.exports = Post = mongoose.model("posts", postSchema);
