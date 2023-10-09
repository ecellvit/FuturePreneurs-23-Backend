const mongoose = require('mongoose');
const path = require('path');
const app = require('./app');
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

mongoose.connect(process.env.db_url, {
    useNewUrlParser: true, useUnifiedTopology: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Connected");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
})
