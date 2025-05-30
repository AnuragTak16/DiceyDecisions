const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    allowCustomOptions: { type: Boolean, default: false },

    options: [
      {
        id: String,
        text: String,
        count: { type: Number, default: 0 },
      },
    ],
    votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    duration: {
      days: { type: Number, default: 0 },
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date }, // remove default here
  },
  { timestamps: true }
);

voteSchema.pre("save", function (next) {
  if (
    this.isNew ||
    this.isModified("startTime") ||
    this.isModified("duration")
  ) {
    const durationMs =
      (this.duration.days || 0) * 24 * 60 * 60 * 1000 +
      (this.duration.hours || 0) * 60 * 60 * 1000 +
      (this.duration.minutes || 0) * 60 * 1000;

    this.endTime = new Date(this.startTime.getTime() + durationMs);
  }

  next();
});

// ✅ Create and export model
const VotingSchema = mongoose.model("Vote", voteSchema);
module.exports = VotingSchema;
