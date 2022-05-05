var express = require("express");

//AUTH related - Supertokens
const getSessionInfo = require("../middleware/authenticate").getSessionInfo;

var router = express.Router();

/* GET users profile */
router.get("/profile", function (req, res, next) {
  res.render("user/profile", { title: process.env.SITE_TITLE });
});

/**
 * Dashboard for particular user
 * If the user is not logged in, it redirects to auth screen
 */
router.get(
  "/dashboard",
  getSessionInfo({ sessionRequired: true }),
  async function (req, res) {
    console.log("Verifying session...");
    if (req.session) {
      console.log(req.session.getUserId());
      res.render("user/dashboard", { title: process.env.SITE_TITLE });
    } else {
      res.redirect("/auth");
    }
  }
);

module.exports = router;
