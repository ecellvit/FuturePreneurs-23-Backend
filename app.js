/*
const express = require('express');

const path = require('path');
const teamRoute = require('./routes/team');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authRoute = require('./routes/authRoutes');
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
/*
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "*");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

morgan.token("req-headers", function (req, res) {
    return JSON.stringify(req.headers);
});


process.env.NODE_ENV != "production" &&
    app.use(morgan(":method :url :status :req-headers"));
app.use(express.urlencoded({ extended: true }));

app.use('/api/team', teamRoute);
app.use('/api/auth', authRoute);


module.exports = app;
*/

const express = require('express');

const path = require('path');
const teamRoute = require('./routes/team');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//const authRoute = require('./routes/authRoutes');
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
/*
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "*");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

morgan.token("req-headers", function (req, res) {
    return JSON.stringify(req.headers);
});

process.env.NODE_ENV != "production" &&
    app.use(morgan(":method :url :status :req-headers"));
app.use(express.urlencoded({ extended: true }));

app.use('/api/team', teamRoute);

*/
app.use('/api/team',teamRoute);
//app.use('/api/auth', authRoute);


module.exports = app;