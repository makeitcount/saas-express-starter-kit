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

//Auth(via SuperTokens)
const supertokens = require("supertokens-node");
var Session = require("supertokens-node/recipe/session");
var EmailPassword = require("supertokens-node/recipe/emailpassword");
var cors = require("cors");
var {
  middleware,
  errorHandler
} = require("supertokens-node/framework/express");

supertokens.init({
  framework: "express",
  supertokens: {
    // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI: process.env.SUPERTOKENS_CORE_URI,
    apiKey: process.env.SUPERTOKENS_CORE_API_KEY
  },
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: "SuperTokensExpress",
    apiDomain: process.env.SITE_DOMAIN_URL,
    websiteDomain: process.env.SITE_DOMAIN_URL,
    apiBasePath: "/api",
    websiteBasePath: "/auth"
  },
  recipeList: [
    EmailPassword.init({
      signUpFeature: {
        formFields: [
          {
            id: "name",
            optional: true
          },
          {
            id: "password",
            /* Validation method to make sure password can be anything but min. 4 characters */
            validate: async (value) => {
              if (value && value.length >= 4) {
                return undefined; // means that there is no error
              }
              return "Password must be min. 4 characters";
            }
          }
        ]
      },
      override: {
        apis: (originalImplementation) => {
          return {
            ...originalImplementation,
            signUpPOST: async function (input) {
              if (originalImplementation.signUpPOST === undefined) {
                throw Error("Should never come here");
              }

              // First we call the original implementation of signUpPOST.
              let response = await originalImplementation.signUpPOST(input);

              // Post sign up response, we check if it was successful
              if (response.status === "OK") {
                // These are the input form fields values that the user used while signing up
                let formFields = input.formFields;
                console.log(JSON.stringify(formFields));
                //Here, we should store the custom field(name for this example) in db. Supertokens won't store custom fields.
              }
              return response;
            }
          };
        }
      }
    }), // initializes signin / sign up features
    Session.init({
      errorHandlers: {
        onUnauthorised: async (message, request, response) => {
          // TODO: Write your own logic and then send a 401 response to the frontend
          console.log(message);
        },
        onTokenTheftDetected: async (sessionHandle, userId, req, res) => {
          // TODO: Write your own logic and then send a 401 response to the frontend
          console.log(
            "Session theft detected for sessionHandle:" +
              sessionHandle +
              " userId:" +
              userId
          );
        }
      }
    }) // initializes session features
  ],
  telemetry: false
});

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

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
