const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
        },
        hasFilledDetails: {
            type: Boolean,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        regNo: {
            type: String,
        },
        mobno: {
            type: String,
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TeamModel",
        },
        teamRole:{
            type: Number,
        },
        isQualified: {
            type: Boolean,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    },
    { collection: "Users" }
);

module.exports = mongoose.model("Users", userSchema);

