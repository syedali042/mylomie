let express = require("express");
let app = express();
let cors = require("cors")
const passport = require("passport");
const ejs = require("ejs");
const helmet = require('helmet')
require("./config/passport")(passport);
//Setup ejs rendering
app.set("view engine", "ejs");
app.use(helmet())
//Setup Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

//Setup Routes
app.use("/", require("./app/routes/index.route.js"));

module.exports = app;
