
const Team = require('../../models/teamModel');
const { db } = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const { teamValidation } = require('../../schemas');
const AppError = require('../../utils/appError');
const { errorCodes } = require('../../utils/constants');
//const User = require('../../models/user');
//const { generateTeamToken } = require("./utils");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const User = require('../../models/user');
const { hasFilledDetailsBodyValidation } = require('./validationSchema');
exports.hasFilledDetails = catchAsync(async (req, res, next) => {
    const emailUser= await User.findOne({email:req.body.email});
    const FirsTnAMEuSER = await User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { firstName: req.body.firstName, lastName: req.body.lastName, regNo:req.body.regNo,mobno:req.body.mobno } }
      );
      res.status(201).json({
        message: "Checking User Successfull",
        //teamId: user.teamId,
        //hasFilledDetails: user.hasFilledDetails,
    });
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
