var express = require("express");
var router = express.Router();
var envImportResult = require("dotenv").config({
  path: "./config/" + (process.env.NODE_ENV || "production") + ".env"
});
if (envImportResult.error) {
  throw envImportResult.error;
}
const configs = envImportResult.parsed;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: process.env.SITE_TITLE, configs: configs });
});

module.exports = router;
