/*
const express = require('express');
const router = express.Router();
const team = require('../controllers/team/team');
const auth = require('../middleware/authmiddleware');
router.route('/getTeam')
    .get(auth, team.getTeam)
router.route('/createTeam')
    .post(auth, team.makeTeam)

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const team = require('../controllers/team');
//const auth = require('../middleware/authmiddleware');

router.route('/getTeam')
    .get( team.getTeam)
    
router.route('/createTeam')
    .post( team.makeTeam)

router.route('/deleteTeam')
    .post(team.deleteTeam)  
router.route('/admin')
    .get(team.removeMember)     
router.route('/gettoken')
    .get(team.getTeamToken)
module.exports = router;