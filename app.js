const express = require('express');
const path = require('path');
const teamRoute = require('./routes/team');
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoute');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const cors = require("cors");

require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

// morgan.token("req-headers", function (req, res) {
//     return JSON.stringify(req.headers);
//   });
  
// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader("Access-Control-Allow-Origin", "*");

//     // Request methods you wish to allow
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );

//     // Request headers you wish to allow
//     res.setHeader("Access-Control-Allow-Headers", "*");

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader("Access-Control-Allow-Credentials", true);

//     // Pass to next layer of middleware
//     next();
// });

app.use(cors())


app.use('/api/team',teamRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);



module.exports = app;