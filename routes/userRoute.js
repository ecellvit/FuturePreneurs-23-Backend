const express = require('express');
const router = express.Router();
const team = require('../controllers/team/team');
const auth = require('../middleware/authmiddleware');
const userController = require('../controllers/user/userController');

router.route('/userDetails')
    .get(auth, userController.userDetails)

router.route('/fillUserDetails')
    .post(auth, userController.fillUserDetails)


router.route('/leaveTeam/:teamId')
    .post(auth, userController.leaveTeam)

module.exports = router;
