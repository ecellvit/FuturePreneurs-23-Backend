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
const team = require('../controllers/team/team.js');
const auth = require('../middleware/authmiddleware');

router.route('/getTeam')
    .get(auth, team.getTeam)
    
router.route('/createTeam')
    .post( auth, team.makeTeam)

router.route('/deleteTeam')
    .post(auth, team.deleteTeam)  
router.route('/admin')
    .get(auth, team.removeMember)     
router.route('/gettoken')
    .get(auth, team.getTeamToken)
module.exports = router;