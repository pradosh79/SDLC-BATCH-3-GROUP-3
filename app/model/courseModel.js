const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    /* ============================
       BASIC COURSE INFO
    ============================ */
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    shortDescription: {
      type: String,
      required: true,
      maxlength: 300,
    },

    longDescription: {
      type: String,
    },

    /* ============================
       TEACHER INFO
    ============================ */
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    /* ============================
       MEDIA
    ============================ */
    thumbnail: {
      type: String, // Cloudinary URL
      required: true,
    },

    previewVideo: {
      type: String, // optional intro video URL
    },

    /* ============================
       CLASSIFICATION
    ============================ */
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
      index: true,
    },

    tags: {
      type: [String],
      index: true,
    },

    /* ============================
       COURSE STATS
    ============================ */
    totalLessons: {
      type: Number,
      default: 0,
    },

    totalDuration: {
      type: String, // e.g. "4h 30m"
    },

    /* ============================
       PRICING
    ============================ */
    price: {
      type: Number,
      default: 0,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    /* ============================
       RATINGS & REVIEWS
    ============================ */
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    ratings: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ============================
       COURSE STATUS
    ============================ */
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },

    publishedAt: {
      type: Date,
    },

    isPopular: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false }
  },
  { timestamps: true }
);

/* ============================
   INDEXES FOR PERFORMANCE
============================ */
courseSchema.index({ title: "text", shortDescription: "text", tags: "text" });

/* ============================
   PLUGINS
============================ */
courseSchema.plugin(aggregatePaginate);

/* ============================
   EXPORT
============================ */
module.exports = mongoose.model("Course", courseSchema);
