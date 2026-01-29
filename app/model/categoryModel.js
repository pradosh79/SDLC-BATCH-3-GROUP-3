const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: String,
    icon: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// ✅ Mongoose 7+ compatible pre-save hook
categorySchema.pre("save", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

module.exports = mongoose.model("category", categorySchema);
