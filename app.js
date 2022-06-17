var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//Configurations
let configFilePath =
  "./config/" + (process.env.NODE_ENV || "production") + ".env";
var envImportResult = require("dotenv").config({
  path: configFilePath
});
if (envImportResult.error) {
  throw envImportResult.error;
}

const config = envImportResult.parsed;
console.log("Configuration values, as found in " + configFilePath);
console.log(config);

//Auth related stuff(mostly via SuperTokens)
var cors = require("cors");
const supertokens = require("supertokens-node");
var {
  middleware,
  errorHandler
} = require("supertokens-node/framework/express");

var AuthService = require("./services/AuthService.js");

AuthService.init()

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var authRouter = require("./routes/auth");

var app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//AUTH(SuperTokens) related middleware
app.use(
  cors({
    origin: process.env.SITE_URL,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true
  })
);
app.use(middleware());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use(errorHandler());

var listener = app.listen(8080, async function () {
  var EmailService = require("./services/EmailService.js");
  await EmailService.init();
  EmailService.sendEmail(
    process.env.SITE_TITLE + " is up now", 
    { 
    to: process.env.ADMIN_EMAIL, 
    subject: process.env.SITE_TITLE + " is up now. Sending this email as you as you're the admin."
  })
  console.log("Listening on port " + listener.address().port);
});
