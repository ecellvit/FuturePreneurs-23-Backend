
const Team = require('../../models/teamModel');
const { db } = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const { teamValidation } = require('../../schemas');
const AppError = require('../../utils/appError');
const { errorCodes } = require('../../utils/constants');
const User = require('../../models/user');
const { generateTeamToken } = require("./utils");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const { hasFilledDetailsBodyValidation } = require('./validationSchema');
exports.hasFilledDetails = catchAsync(async (req, res, next) => {








    const { error } = hasFilledDetailsBodyValidation(req.body);
    if (error) {
        return next(
            new AppError(
                error.details[0].message,
                400,
                errorCodes.INPUT_PARAMS_INVALID
            )
        );
    }

    const token = req.body.token;
    const emailFromClient = req.body.email;

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) {
        return next(
            new AppError(
                "Please SignOut and SignIn Again",
                401,
                errorCodes.INVALID_TOKEN
            )
        );
    }

    const { email } = ticket.getPayload();
    if (email !== emailFromClient) {
        return next(
            new AppError(
                "Please SignOut and SignIn Again",
                401,
                errorCodes.INVALID_TOKEN
            )
        );
    }

    const user = await User.findOne({ email: emailFromClient });

    return res.status(201).json({
        message: "Checking User Successfull",
        teamId: user.teamId,
        hasFilledDetails: user.hasFilledDetails,
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