var express = require("express");

//AUTH related - Supertokens
const getSessionInfo = require("../middleware/authenticate").getSessionInfo;

var router = express.Router();

var authService = require("../services/authService.js");

/* GET users profile */
router.get("/profile", getSessionInfo({ sessionRequired: true }), async function (req, res) {
  console.debug("Getting user profile...");
  if(!req.session){
    return res.redirect("/auth?redirectToPath="+req.path);
  }
  res.render("user/profile", { user: req.user, title: process.env.SITE_TITLE });
});

router.post("/profile", getSessionInfo({ sessionRequired: true }), async function (req, res) {
  console.debug("Updating user profile...");
  if(!req.session){
    return res.redirect("/auth?redirectToPath="+req.path);
  }
  let newProfileData = req.body;
  // Remove fields that are not part of UserMetaData
  delete newProfileData["email"];
  // Update the stored user metadata
  await authService.updateUserMetaData(req.session.userId, newProfileData);
  // Use the new user metadata in the access token
  req.user = await authService.storeUserMetaDataInTokenPayload(req.session, req.user);
  res.render("user/profile", { user: req.user, title: process.env.SITE_TITLE });
});

/**
 * Dashboard for particular user
 * If the user is not logged in, it redirects to auth screen
 */
router.get(
  "/dashboard",
  getSessionInfo({ sessionRequired: true }),
  async function (req, res) {
    console.debug("Verifying session...");
    if (req.session) {
      console.log(req.session.getUserId());
      res.render("user/dashboard", { user: req.user, title: process.env.SITE_TITLE });
    } else {
      res.redirect("/auth");
    }
  }
);

module.exports = router;
