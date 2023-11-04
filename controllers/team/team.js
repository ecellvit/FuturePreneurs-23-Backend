/*
const Team = require('../../models/teamModel');
const { db } = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const { teamValidation } = require('../../schemas');
const AppError = require('../../utils/appError');
const { errorCodes } = require('../../utils/constants');
const User = require('../../models/user');
const { generateTeamToken } = require("./utils");

exports.getTeam = async (req, res, next) => {
    // console.log("User ID: " + req.user._id);
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(
            res.status(401).json({ "message": "User Not Found" })
        );
    }
    const email = user.email;
    // console.log(user);
    const team = await Team.findOne({ leaderEmail: email });
    if (!team) {
        return next(
            res.status(404).json({ "message": "Team Not Found" })
        );
    }
    res.json({
        team
    })
}

exports.makeTeam = catchAsync(async (req, res, next) => {
    const { error } = teamValidation(req.body);
    if (error) {
        return next(
            res.status(400).json({ "message": error.message })
        )
    }

    //check whether teamname already taken
    const team_by_name = await Team.findOne({ teamName: req.body.teamName });
    if (team_by_name) {
        return next(
            res.status(412).json({ "message": "Team Name Already Exists" })
        );
    }

    // const team_by_number = await Team.findOne({ teamNumber: req.body.teamNumber });
    // if (team_by_number) {
    //     return next(
    //         res.status(412).json({ "message": "Team Number Already Exists" })
    //     );
    // };
    const userID = req.user._id;
    const user = await User.findById(userID);
    if (req.body.leaderEmail !== user.email) {
        return next(
            res.status(401).json({ "message": "Enter the same email you logged in with" })
        );
    }
    const teamByEmail = await Team.findOne({ leaderEmail: req.body.leaderEmail })
    console.log(req.body.leaderEmail);
    console.log(teamByEmail);
    if (teamByEmail) {
        return next(
            res.status(401).json({ "message": "Team with this Email ID already Exists" })
        );
    }
    const newTeam = await new Team({
        teamName: req.body.teamName,
        leaderName: req.body.leaderName,
        leaderEmail: req.body.leaderEmail,
        vps: 15000,
        isQualified: true,
        hasSubmittedSectors: false,
        currentRound: "Not Started"
    }).save();
    await User.findOneAndUpdate({ email: req.body.leaderEmail }, { $set: { hasFilledDetails: true } })
    console.log(req.body);
    res.status(201).json({
        message: "New Team Created Successfully",
        teamId: newTeam._id,
    });
});
*/
//const Team = require('../../models/teamModel');
const Team = require('../../models/teamModel');
const Token=require('../../models/TeamToken')
const { db } = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const { teamValidation } = require('../../schemas');
const AppError = require('../../utils/appError');
const { errorCodes } = require('../../utils/constants');
const User = require('../../models/user');
const jwt=require('jsonwebtoken');
const { generateTeamToken } = require("./utils");
const auth = require('../../middleware/authmiddleware');

exports.getTeam = async (req, res, next) => {
    // console.log("User ID: " + req.user._id);
    const user = await User.findById(req.user._id);
    //const user=await User.findOne({email:req.body.leaderEmail});
    if (!user) {
        return next(
            res.status(401).json({ "message": "User Not Found" })
        );
    }
    const email = user.email;
    // console.log(user);
    const team = await Team.findOne({ leaderEmail: email });
    if (!team) {
        return next(
            res.status(404).json({ "message": "Team Not Found" })
        );
    }
    res.json({
        team
    })
}


exports.makeTeam = (async (req, res, next) => {
    
    const { error } = teamValidation(req.body);
    if (error) {
        return next(
            res.status(400).json({ "message": error.message })
        )
    }
    

    //check whether teamname already taken
    const team_by_name = await Team.findOne({ teamName: req.body.teamName });
    if (team_by_name) {
        return next(
            res.status(412).json({ "message": "Team Name Already Exists" })
        );
    }

    // const team_by_number = await Team.findOne({ teamNumber: req.body.teamNumber });
    // if (team_by_number) {
    //     return next(
    //         res.status(412).json({ "message": "Team Number Already Exists" })
    //     );
    // };
    const userID = req.user._id;
   
    const user = await User.findById(userID);
    //const user = await User.findOne({ mobno: req.body.mobno });
    //onsole.log(req.body.mobno);
    //console.log(user.mobno);
    //console.log(user);
    if (req.body.leaderEmail !== user.email) {
        return next(
            res.status(401).json({ "message": "Enter the same email you logged in with" })
        );
    }
    const teamByEmail = await Team.findOne({ leaderEmail: req.body.leaderEmail })
    //console.log(req.body.leaderEmail);
    //console.log(teamByEmail);
    if (teamByEmail) {
        return next(
            res.status(401).json({ "message": "Team with this Email ID already Exists" })
        );
    }
    const newTeam = await new Team({
        teamName: req.body.teamName,
        leaderName: req.body.leaderName,
        leaderEmail: req.body.leaderEmail,
        //vps: 15000,
        isQualified: true,
        hasSubmittedSectors: false,
        currentRound: "Not Started",
        members:req.body.members,
        
    }).save();
    /*
    const accessToken=jwt.sign({leaderEmail:user.email},"mySecretKey")
    const newToken=await new Token({
        token:accessToken
    }).save();
    */
    const t=await Team.findOneAndUpdate({ leaderEmail: req.body.leaderEmail }, { $set: { teamID: newTeam._id } })
    console.log(t.teamID);
    res.status(201).json({
        message: "New Team Created Successfully",
        teamID: newTeam._id,
       // accessToken
    });
});


exports.deleteTeam=(async(req,res)=>{
    const userID = req.user._id;
    const leaders=await User.findById(userID);
    const leader=await Team.findOne({leaderEmail:leaders.email});

    console.log(leader);
    //console.log(req.body.teamName);
    //console.log(leader);
    if(leader){
    if(leader.members.length===0)
    {
        const deleteTeam1 = await Team.findOneAndDelete({ teamName: req.body.teamName });

        console.log(deleteTeam1);
        res.status(201).json({
            message:"Team has been deleted successfully"
        })
    }
    else
    {
        res.status(401).json({
            message:"your team is not empty"
        })
    }
}else{
    res.status(401).json({
        message:"only leader can delete the team"
    })
}}
)


exports.removeMember=(async(req,res,next)=>{
    const userID = req.user._id;
   // const leaders=await User.findById(userID);
   // console.log(leaders);
    const team=await Team.findOne({leaderEmail:req.body.leaderEmail});
    console.log(team);

if(team)
{
    let mem=req.body.members;
    const id1=await Team.findOne({members:mem});
    if(id1)
    {
    team.members = team.members.filter(item => item !== mem);
    console.log(team.members);
    await Team.findOneAndUpdate({ leaderEmail: req.body.leaderEmail }, { $set: { members: team.members } })
    res.status(200).json({
        message:"member removed successfully"
    })
    }else{
        res.status(401).json({
            message:"the members is not in your team"
        })
    }
}
else{
    res.status(400).json({
        message:"only leader can remove the members"
    })
}
        
})



exports.getTeamToken = async (req, res, next) => {
    try {
      const team = await Team.findOne({ teamName: req.body.teamName });
        //console.log(team);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      if (!team.teamToken) {
        const team = await Team.findOne({ teamName: req.body.teamName });
        const accessToken = jwt.sign({ teamID: team.teamID }, process.env.JWT_SECRET);
        
        console.log(team.teamToken);
        console.log(team.teamID);
        const newToken = new Token({
          teamID: team.teamID,
          token: accessToken,
        });
  
        await newToken.save();
        await Team.findOneAndUpdate({ teamName: req.body.teamName }, { $set: { teamToken: true,AccessToken:accessToken} });
  
        res.status(200).json({
          accessToken
        });
      } else {
        try {
          const token_init = team.accessToken;
          console.log(token_init);
          jwt.verify(token_init, process.env.JWT_SECRET);
          
          res.status(200).json({ message: 'Token is still valid' });
        } catch (error) {
            const team = await Team.findOne({ teamName: req.body.teamName });
            const refreshToken = jwt.sign({ teamID: team.teamID }, process.env.JWT_SECRET);
            await Team.findOneAndUpdate({ teamName: req.body.teamName }, { $set: { teamToken: true,AccessToken:refreshToken} });

          //console.error(error);
          res.status(500).json({ RefreshToken: refreshToken });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


exports.jointeam=async(req,res,next)=>{
    try {
            const token = req.body.token;
    
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
         
        const team = await Team.findOne({ _id: decoded.teamID });
        console.log(team);
        if (!team) { 
          return res.status(404).json({ error: 'Team not found' });
        }
    
        
        if (team.isFull) {
          return res.status(403).json({ error: 'Team is full' });
        }
    
 
        
        const find=await User.findOne({email:req.body.email});
        console.log(find);
        team.members.push(find.email);
        await team.save();
        
        res.status(200).json({ message: 'You have joined the team!' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Asks leader to generate new token' });
      }
}
