
const Team = require('../../models/teamModel');
const { db } = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const { teamValidation } = require('../../schemas');
const AppError = require('../../utils/appError');
const { errorCodes } = require('../../utils/constants');
const User = require('../../models/user');
// const { generateTeamToken } = require("./utils");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const { hasFilledDetailsBodyValidation } = require('./validationSchema');

exports.hasFilledDetails = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if(user.hasFilledDetails){
        return res.status(201).json({
            message: "User has filled details",
            hasFilledDetails: user.hasFilledDetails,
        });
    }

    return res.status(201).json({
        message: "User has not filled details",
        hasFilledDetails: user.hasFilledDetails,
    });
});
// to do: update the hasfilleddetials to be true
exports.fillUserDetails = catchAsync(async (req, res, next) => {
    try{
    const user = await User.findById(req.user._id);
    user.firstName=req.body.firstName;
    user.lastName=req.body.lastName;
    user.regNo=req.body.regNo;
    user.mob=req.body.mob;
    await user.save();
    await User.findByIdAndUpdate(user._id,{
        $set:{
           hasFilledDetails:"true"
        }
    })
    return res.status(200).json({
        message:"user details have been saved successfully",
        status:"success"
    })
}catch(error){
    console.error(error);
    return res.status(404).json({
        message:"something went wrong"
    })
}
    
    
});

exports.leaveTeam = catchAsync(async (req, res, next) => {
    //validating teamid
    if (req.params.teamId.length !== objectIdLength) {
        return next(
            new AppError("Invalid TeamId", 412, errorCodes.INVALID_TEAM_ID)
        );
    }

    const team = await Team.findById({ _id: req.params.teamId }).populate([
        "teamLeaderId",
        "members",
    ]);

    //validate team id
    if (!team) {
        return next(
            new AppError("Invalid TeamId", 412, errorCodes.INVALID_TEAM_ID)
        );
    }

    const user = await User.findById({ _id: req.user._id });

    //check if user is part of given team
    if (user.teamId == null || user.teamId.toString() !== req.params.teamId) {
        return next(
            new AppError(
                "User is not part of given TeamID or user isn't part of any Team",
                412,
                errorCodes.INVALID_USERID_FOR_TEAMID
            )
        );
    }

    //check the role. Leader can leave team remove members and delete team.
    if (user.teamRole === teamRole.LEADER) {
        return next(
            new AppError(
                "Leader can't Leave the Team",
                412,
                errorCodes.USER_IS_LEADER
            )
        );
    }

    await User.findOneAndUpdate(
        { _id: req.user._id },
        { teamId: null, teamRole: null }
    );

    await Team.findOneAndUpdate(
        { _id: req.params.teamId },
        { $pull: { members: req.user._id } }
    );
    res.status(201).json({
        error: false,
        message: "Leaving Team Successfull",
    });
});