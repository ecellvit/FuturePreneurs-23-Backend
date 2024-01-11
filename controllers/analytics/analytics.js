const Team = require('../../models/teamModel');
const User = require('../../models/user');


exports.totalteams = async (req, res, next) => {
    try {
        const totalTeams = await Team.countDocuments(); 
        let count1 = 0;
        let count2=0;
        let count3=0;
        let count4=0;
        const totalTeams1 = await Team.find();
        console.log(totalTeams1);


        const counts = req.body.count;

        for (const team of totalTeams1) {
            console.log(team);
            if (team.members.length === 1) {
                count1++;
            }
            else if (team.members.length === 2) {
                count2++;
            }
            else if (team.members.length === 3) {
                count3++;
            }
            else if (team.members.length === 4) {
                count4++;
            }
        }

       return  res.status(200).json({
            "Total no of teams":totalTeams,
            "No of 4- member teams":count4,
            "No of 3- member teams":count3,
            "No of 2- member teams":count2,
            "No of 1- member teams":count1

        });
    } catch (error) {
        console.error(error);
       return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.noofparticipants = async (req, res, next) => {
    try {
        const totalparticipants = await User.countDocuments(); 
        return res.status(200).json({
            "Total no of participants":totalparticipants,
           
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

