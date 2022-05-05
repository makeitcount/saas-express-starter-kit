var express = require("express");

// const verifySession = require("supertokens-node/recipe/session/framework/express")
//   .verifySession;

var router = express.Router();

/* GET signup/signin page */
router.get("/", function (req, res, next) {
  res.render("auth", { title: "Signup or signin |" + process.env.SITE_TITLE });
});

router.get("/logout", async function (req, res) {
  if (req.session) {
    // This will delete the session from the db and from the frontend (cookies)
    console.log("Logging out " + JSON.stringify(req.session));
    await req.session.revokeSession();
  }
  res.redirect("/auth");
});

module.exports = router;
