const express = require('express');
const router = express.Router();
const team = require('../controllers/team/team.js');
const auth = require('../middleware/authmiddleware');

router.route('/getTeamDetails')
    .get(auth,team.getTeamDetails)
    
router.route('/createTeam')
    .post(auth,team.makeTeam)

router.route('/deleteTeam/:teamId')
    .post(auth,team.deleteTeam)  

router.route('/remove/:teamId')
    .get(auth, team.removeMember)     


router.route('/getTeamCode')
    .get( auth,team.getTeamToken)
    
router.route('/jointeam')
    .post( auth,team.jointeam)   
    
router.route('/leaveTeam')
    .post(auth,team.leaveteam)
module.exports = router;