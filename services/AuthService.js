exports.init = init;
exports.storeUserMetaDataInTokenPayload = storeUserMetaDataInTokenPayload;
exports.updateUserMetaData = updateUserMetaData;

const supertokens = require("supertokens-node");
var Session = require("supertokens-node/recipe/session");
var EmailPassword = require("supertokens-node/recipe/emailpassword");
var UserMetadata = require("supertokens-node/recipe/usermetadata");

function init(){
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
        emailVerificationFeature: {
            mode: "REQUIRED"
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
                    let fieldsToExcludeInMetadata = ["email", "password"];
                    let userMetaData = formFields.reduce(function(theMetaData, inputField) {
                        if(inputField["id"]){
                            //Save the fields in metadata except the default fields(e.g. don't save email, password)
                            if(!fieldsToExcludeInMetadata.find((fieldToExclude) => fieldToExclude==inputField.id)){
                            theMetaData[inputField.id] = inputField["value"];
                            }
                        }
                        return theMetaData
                    }, {})
                    if(response.user && response.user.id){
                        // Update user metadata in the db
                        await updateUserMetaData(response.user.id, userMetaData);
                        // Get user metadata and store it in the token payload
                        await storeUserMetaDataInTokenPayload(response.session, response.user);
                    }
                }
                return response;
                },
                signInPOST: async function (input) {
                if (originalImplementation.signInPOST === undefined) {
                    throw Error("Should never come here");
                }
                // First we call the original implementation of signInPOST.
                let response = await originalImplementation.signInPOST(input);
                // Post sign in logic
                if (response.status === "OK") {
                    // Get user metadata and store it in the token payload
                    await storeUserMetaDataInTokenPayload(response.session, response.user);
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
        }), // initializes session features
        UserMetadata.init()
    ],
    telemetry: false
    });
}

/**
 * @summary Fetches user metadata and adds it to the access token payload
 * @description This enables easy access of frequntly needed user info at the frontend
 * @param {*} session 
 * @param {*} user 
 */
 async function storeUserMetaDataInTokenPayload(session, user) {
  let userMetaData = await UserMetadata.getUserMetadata(user.id);
  let currAccessTokenPayload = session.getAccessTokenPayload();
  console.debug("userDataInAccessToken: " + JSON.stringify(session.userDataInAccessToken));
  console.debug("currAccessTokenPayload: " + JSON.stringify(currAccessTokenPayload));
  let accessTokenPayloadWithMetadata = Object.assign({}, user, currAccessTokenPayload, userMetaData ? userMetaData.metadata : null);
  console.debug("accessTokenPayloadWithMetadata: " + JSON.stringify(accessTokenPayloadWithMetadata));
  await session.updateAccessTokenPayload(accessTokenPayloadWithMetadata);
  return accessTokenPayloadWithMetadata;
}

/**
 * Stores user metadata in the db
 * @param {String} userId 
 * @param {Object} userMetaData 
 */
async function updateUserMetaData(userId, userMetaData){
    await UserMetadata.updateUserMetadata(userId, userMetaData);
}