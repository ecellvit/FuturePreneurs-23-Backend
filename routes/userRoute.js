const express = require('express');
const router = express.Router();
const team = require('../controllers/team/team');
const auth = require('../middleware/authmiddleware');
const userController = require('../controllers/user/userController');

router.route('/hasFilledDetails')
    .patch(userController.hasFilledDetails)
router.route('/leaveTeam/:teamId')
    .post(auth, userController.leaveTeam)
