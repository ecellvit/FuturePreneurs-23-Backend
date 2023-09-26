const express = require('express');
const router = express.Router();
const team = require('../controllers/team/team');
const auth = require('../middleware/authmiddleware');
router.route('/getTeam')
    .get(auth, team.getTeam)
router.route('/createTeam')
    .post(auth, team.makeTeam)

module.exports = router;