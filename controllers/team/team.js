const Team = require('../../models/teamModel');
const Token = require('../../models/usertoken')
const { db } = require('../../models/user');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const {
    teamRole,
    objectIdLength
  } = require("../../utils/constants");

exports.getTeamDetails = async (req, res, next) => {
    console.log("User ID: " + req.user);
    const user = await User.findById(req.user._id);
    // const user=await User.findOne({email:req.body.leaderEmail});
    if (!user) {
        // return next(
        //     res.status(401).json({ "message": "User Not Found" })
        // );
        res.status(401).json({
            message: "User Not Found"
        })
    }
    const teamId = user.teamId;
    // console.log(user);
    const team = await Team.findById(teamId).populate("members");
    if (!team) {
        return next(
            res.status(404).json({ "message": "Team Not Found" })
        );
    }
    res.json({
        message: "Team Details sent successfully",
        teamDetails: team
    })
}


exports.makeTeam = (async (req, res, next) => {

    console.log(req.user._id);
    const user = await User.findById({ _id: req.user._id });

    //check whether teamname already taken
    const team = await Team.findOne({ teamName: req.body.teamName });
    if (team) {
        // return next(
        //     new AppError("TeamName Already Exists", 412, errorCodes.TEAM_NAME_EXISTS)
        // );
        res.status(401).json({
            message: "TeamName Already Exists"
        })
    }

    //if user is already in a team
    if (user.teamId || user.teamRole) {
        // return next(
        //     new AppError(
        //         "User Already Part of a Team",
        //         412,
        //         errorCodes.USER_ALREADY_IN_TEAM
        //     )
        // );
        res.status(401).json({
            message: "User Already Part of a Team"
        })
    }


    const newTeam = await new Team({
        teamName: req.body.teamName,
        teamLeaderId: req.user._id,
        members: [req.user._id],
    }).save();

    await User.updateMany(
        { _id: req.user._id },
        { $set: { teamId: newTeam._id, teamRole: teamRole.LEADER } }
    );

    res.status(201).json({
        message: "New Team Created Successfully",
        // teamId: newTeam._id,
    });

});


exports.deleteTeam = (async (req, res) => {
    if (req.params.teamId.length !== objectIdLength) {
        return next(
            new AppError("Invalid TeamId", 412, errorCodes.INVALID_TEAM_ID)
        );
    }

    //validating teamid
    const team = await Team.findById({ _id: req.params.teamId });

    if (!team) {
        res.status(401).json({
            message: "Invalid TeamId"
        })

    }

    //check whether user belongs to the given team and role
    if (team.teamLeaderId.toString() !== req.user._id) {
        res.status(401).json({
            message: "User doesn't belong to the Team or User isn't a Leader"
        })
    }

    //check team size
    if (team.members.length !== 1) {
        res.status(401).json({
            message: "Teamsize more than 1. Remove TeamMembers and Delete the Team"
        })
    }


    await Team.findOneAndDelete({
        _id: req.params.teamId,
    });

    await User.findByIdAndUpdate(
        { _id: req.user._id },
        { teamId: null, teamRole: null }
    );

    res.status(200).json({
        message: "Team Deleted Successfully",
    });
})


exports.removeMember = (async (req, res, next) => {
    // const { error } = removeMemberBodyValidation(req.body);
    // if (error) {
    //     return next(
    //         new AppError(
    //             error.details[0].message,
    //             400,
    //             errorCodes.INPUT_PARAMS_INVALID
    //         )
    //     );
    // }
    //checking for invalid team id
    if (req.params.teamId.length !== objectIdLength) {
        return next(
            new AppError("Invalid TeamId", 412, errorCodes.INVALID_TEAM_ID)
        );
    }

    //validating teamid
    const team = await Team.findById({ _id: req.params.teamId });

    if (!team) {
        return next(
            new AppError("Invalid TeamId", 412, errorCodes.INVALID_TEAM_ID)
        );
    }

    //checking whether user to remove id is valid
    const userToRemove = await User.findById({ _id: req.body.userId });
    if (!userToRemove) {
        return next(
            new AppError("Invalid UserId to Remove", 412, errorCodes.INVALID_USERID)
        );
    }

    //check whether user belongs to the given team and role
    if (team.teamLeaderId.toString() !== req.user._id) {
        return next(
            new AppError(
                "User doesn't belong to the team or user isn't a leader",
                412,
                errorCodes.INVALID_USERID_FOR_TEAMID_OR_USER_NOT_LEADER
            )
        );
    }

    //checking whether user to remove belomgs to the team id
    if (
        userToRemove.teamId == null ||
        userToRemove.teamId.toString() !== req.params.teamId
    ) {
        return next(
            new AppError(
                "User to remove and TeamId didnt Match",
                412,
                errorCodes.INVALID_USERID_FOR_TEAMID
            )
        );
    }

    //updating user teamid and teamrole
    await User.findOneAndUpdate(
        { _id: req.body.userId },
        { teamId: null, teamRole: null }
    );

    //updating team
    await Team.findOneAndUpdate(
        { _id: req.params.teamId },
        { $pull: { members: req.body.userId } }
    );


    res.status(201).json({
        message: "User Removed Successfully",
    });
})

exports.getTeamToken = (async (req, res, next) => {
    const team = await Team.findOne({ teamName: req.body.teamName });
    console.log(team._id);
    console.log(Token._id);
    const accesstok = await Token.findOne({ _id: team._id })
    console.log(accesstok)
})