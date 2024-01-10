const Team = require('../../models/teamModel');
const Token = require('../../models/TeamToken')
const { db } = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const { teamValidation } = require('../../schemas');
const AppError = require('../../utils/appError');

const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { generateTeamToken } = require("./utils");
const auth = require('../../middleware/authmiddleware');
const {
    teamRole,
    objectIdLength
} = require("../../utils/constants");

//   const { nanoid } = require('nanoid');
const { customAlphabet } = require('nanoid');
exports.getTeamDetails = async (req, res, next) => {
    console.log("User ID: " + req.user);
    const user = await User.findById(req.user._id);
    // const user=await User.findOne({email:req.body.leaderEmail});
    if (!user) {
        // return next(
        //     res.status(401).json({ "message": "User Not Found" })
        // );
        return res.status(401).json({
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
    return res.json({
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
        return res.status(401).json({
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
        return res.status(401).json({
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

    return res.status(201).json({
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
        return res.status(401).json({
            message: "Invalid TeamId"
        })

    }

    //check whether user belongs to the given team and role
    if (team.teamLeaderId.toString() !== req.user._id) {
        return res.status(401).json({
            message: "User doesn't belong to the Team or User isn't a Leader"
        })
    }

    //check team size
    if (team.members.length !== 1) {
        return res.status(401).json({
            message: "Teamsize more than 1. Remove TeamMembers and Delete the Team"
        })
    }


    await Team.findOneAndDelete({
        _id: req.params.teamId,
    });

    await Token.findOneAndDelete({
        teamId: req.params.teamId,
    });

    await User.findByIdAndUpdate(
        { _id: req.user._id },
        { teamId: null, teamRole: null }
    );

    return res.status(200).json({
        message: "Team Deleted Successfully",   
        status: "success"
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
    // if (req.params.teamId.length !== objectIdLength) {
    //     return next(
    //         new AppError("Invalid TeamId", 412, errorCodes.INVALID_TEAM_ID)
    //     );
    // }
    

    //validating teamid
    const team = await Team.findById({ _id: req.params.teamId });

    if (!team) {
            return res.status(401).json({
                message: "Invalid UserId to Remove"
            })
    }

    //checking whether user to remove id is valid
    const userToRemove = await User.findById({ _id: req.body.userId });
    if (!userToRemove) {
        return res.status(401).json({
            message: "Invalid UserId to Remove"
        })
    }

    //check whether user belongs to the given team and role
    if (team.teamLeaderId.toString() !== req.user._id) {
        return res.status(401).json({
            message: "User doesn't belong to the team or user isn't a leader"
        })
    }

    //checking whether user to remove belomgs to the team id
    if (
        userToRemove.teamId == null ||
        userToRemove.teamId.toString() !== req.params.teamId
    ) {
        return res.status(401).json({
            message: "User to remove and TeamId didnt Match"
        })
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

exports.getTeamToken = async (req, res, next) => {
    try {
        const leaderId = req.user._id;
        const team = await Team.findOne({ teamLeaderId: leaderId });

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        if (!team.teamCode) {
            const teamCode = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)();
            // const teamCode = nanoid(10)
            const newToken = await new Token({
                teamId: team._id,
                token: teamCode,
            }).save();

            await Team.findOneAndUpdate({ _id: team._id }, { $set: { teamCode: teamCode } });

            return res.status(200).json({
                "teamCode": teamCode,
                "teamName": team.teamName
            });

        } 
        else {
            const token = await Token.findOne({ teamId: team._id });

            if (!token) {
                return res.status(404).json({ error: 'Token not found' });
            }

            const currentTime = new Date();
            const tokenCreationTime = token.createdAt;
            const timeDifference = (currentTime - tokenCreationTime) / (1000 * 60); // Difference in minutes
            console.log("-====",tokenCreationTime)
            console.log("-====",currentTime)
            if (timeDifference > 10) {
                // Token expired, generate a new token
                const newTeamCode = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)();
                await Token.findOneAndUpdate({ teamId: team._id }, { $set: { token: newTeamCode, createdAt: currentTime } });
                await Team.findOneAndUpdate({ _id: team._id }, { $set: { teamCode: newTeamCode } });

                return res.status(200).json({ "teamCode": newTeamCode, "teamName": team.teamName });
            } else {
                return res.status(200).json({ "teamCode": token.token, "teamName": team.teamName });
            }
        }
   
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.jointeam = async (req, res, next) => {
    try {
        const userID = req.user._id;
        const code = req.body.teamCode;
        const team = await Team.findOne({ teamCode: code });
        //check if user is not a part of any team
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        // console.log(team)
        const token = await Token.findOne({ teamId: team._id });

        if (!token) {
            return res.status(404).json({ error: 'Token not found' });
        }

        const currentTime = new Date();
        const tokenCreationTime = token.createdAt;

        const timeDifference = (currentTime - tokenCreationTime) / (1000 * 60); // Difference in minutes

        if (timeDifference > 10) {
            // Token expired, prompt for a new token
            return res.status(401).json({ error: 'Token expired. Ask leader to generate a new token.' });
        }
        if (code !== token.token) {
            return res.status(401).json({ error: 'Incorrect token' });
        }

        await User.findOneAndUpdate({ _id: userID }, { $set: { teamId: team.id, teamRole: teamRole.MEMBER  } });

        team.members.push(userID);

        await team.save();

        return res.status(200).json({ message: 'You have joined the team!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Asks leader to generate new token' });
    }
}

exports.getTeamViaToken = async (req, res, next) => {
    try {
        const code = req.body.teamCode;
        const team = await Team.findOne({ teamCode: code });
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        return res.status(200).json({ message: 'Team details sent sucessfullt!', teamDetails: team });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Team Not found' });
    }
}

exports.leaveteam = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (user.teamRole != "1") {
            return res.status(401).json({
                message: "Leader cant leave the team",
            });
        }
        // Check if the user is part of a team
        if (!user.teamId) {
            return res.status(401).json({
                message: "User is not part of any team",
            });
        }
        const team = await Team.findById(user.teamId);
        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        // Remove the user from the team's members
        team.members.pull(userId);
        await team.save();
        await User.findByIdAndUpdate(userId, { $set: { teamId: null, teamRole: null } });

        res.status(200).json({
            message: "User has left the team successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' })
    }
}
