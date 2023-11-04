
const mongoose = require('mongoose');
const teamSchema = mongoose.Schema(
    {
        teamName: {
            type: String,
            unique: true
        },
        teamLeaderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        teamNumber: {
            type: Number
        },
        leaderName: {
            type: String
        },
        leaderEmail: {
            type: String
        },
        teamID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TeamModel"
        },
        isQualified: {
            type: Boolean
        },
        currentRound: {
            type: String
        },
        members:{
            type:[String]
        },
        teamToken:{
            type:Boolean
        },
        AccessToken:{
            type:String
        }
    },
    { collection: "TeamModel" }
);

module.exports = mongoose.model("TeamModel", teamSchema);

/*
const mongoose = require('mongoose');
const teamSchema = mongoose.Schema(
    {
        teamName: {
            type: String,
            unique: true
        },
        teamLeaderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        teamNumber: {
            type: Number
        },
        leaderName: {
            type: String
        },
        leaderEmail: {
            type: String
        },
        teamID: {
            type: mongoose.Schema.Types.ObjectId
        },
        isQualified: {
            type: Boolean
        },
        currentRound: {
            type: String
        },
        teamToken:{
            type:String
        },
        members:{
            type:[Number]
        }
    },
    { collection: "TeamModel" }
);

module.exports = mongoose.model("TeamModel", teamSchema);
*/
