const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamTokenSchema = new Schema(
  {
    teamID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 6, // 60 seconds (1 minute)
    }
    
  },
  { collection: "TeamToken" }
);

module.exports = mongoose.model("TeamToken", teamTokenSchema);