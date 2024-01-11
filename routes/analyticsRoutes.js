const express = require('express');
const router = express.Router();
const analytics = require('../controllers/analytics/analytics.js');

router.get('/getTeams', analytics.totalteams);

router.get('/getParticipants', analytics.noofparticipants);

module.exports = router;
