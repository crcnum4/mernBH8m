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
    author: String,
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
    },
    cohort: String,
    title: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    summary: String,
    link: String,
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
    },
    publishedAt: Date,
    videoLength: Number,
    timeToComplete: Number,
    comments: { type: [commentSchema], default: [] },
    // TODO rating
    // TODO archive
    // TODO featured
  },
  { timestamps: {} }
);

module.exports = Post = mongoose.model("posts", postSchema);
