const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const approvalStatusTypes = {
    REJECTED: 0,
    APPROVED: 1,
};

const errorCodes = {
    UNKNOWN_ERROR: 0,
    EXCEPTION: 1,
    INPUT_PARAMS_INVALID: 2,
    INVALID_TOKEN: 3,
    USER_NAME_EXIXTS: 4,
    INVALID_URL: 5,
    TEAM_NAME_EXISTS: 6,
    USER_HAS_PENDING_REQUESTS: 7, //user shouldnot have pending requests to create team
    INVALID_TEAM_ID: 8,
    INVALID_USERID_FOR_TEAMID: 9, //userId not related to given team id
    USER_IS_LEADER: 10,
    INVALID_USERID_FOR_TEAMID_OR_USER_NOT_LEADER: 11, // //userId not related to given team id or user ia leader
    REQUEST_ALREADY_SENT: 12,
    INVALID_TEAM_TOKEN: 13,
    MAX_QUESTIONS_REACHED: 14,
    NOT_ADMIN: 15,
    SAME_EXISTING_TEAMNAME: 16,
    INVALID_OPERATION: 17,
    BALANCE_EXCEEDED: 18,
    ITEMS_LIMIT_REACHED: 19,
    TEAM_NUMBER_EXISTS: 20,
    AMOUNT_EXCEEDED: 21,
    CITY_NOT_FOUND: 22,
    INVALID_TEAM_NAME: 23,
    INVALID_INVESTMENT: 24,
    ROUND_ONE_NOT_STARTED: 25,
    ROUND_ONE_NOT_ENDED: 26,
    ROUND_TWO_NOT_STARTED: 27,
    INDUSTRY_ALREADY_ASSIGNED: 28

};

const balance = 5000;

const objectIdLength = 24;
const industries = 6;
const cities = 10;

module.exports = {
    approvalStatusTypes,
    errorCodes,
    objectIdLength,
    balance,
    objectIdLength,
    industries,
    cities
    // SESConfig,
};
