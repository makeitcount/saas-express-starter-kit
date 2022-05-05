const { refreshSession } = require("supertokens-node/recipe/session");
const Session = require("supertokens-node/recipe/session");

exports.getSessionInfo = getSessionInfo;

/**
 * A middleware to verify session and add a session object to req. for further use
 * @param {*} options { sessionRequired: false }
 */
function getSessionInfo(options) {
  return async function (req, res, next) {
    try {
      // getSession will do session verification for us
      req.session = await Session.getSession(req, res);
      console.log(
        "Has valid session. Check req.session in your route handlers for more info"
      );
      next();
    } catch (err) {
      if (err.type === Session.Error.TRY_REFRESH_TOKEN) {
        // in this case, the session is still valid, only the access token has expired.
        // The refresh token is not sent to this route as it's tied to the /api/auth/session/refresh API paths.
        // So we must send a "signal" to the frontend which will then call the
        // refresh API and reload the page.
        if (req.headers["content-type"] === "application/json") {
          return res.status(401).send({
            statusCode: "TRY_REFRESH_TOKEN",
            statusMessage: "Please refresh token"
          });
        } else {
          if (options && options.sessionRequired) {
            //Adding a signal for frontend to refresh token
            // req.params.auth_error = "token_expired";
            console.log("Token expired");
            // await Session.refreshSession(req, res);
            // next();
            res.redirect(
              "/auth" +
                "?redirectToPath=" +
                req.originalUrl +
                "#try_refresh_token"
            );
          } else {
            return next({
              statusCode: "TRY_REFRESH_TOKEN",
              statusMessage: "Please refresh token"
            });
          }
        }
        // or return {fromSupertokens: 'needs-refresh'} in case of getInitialProps
      } else if (err.type === Session.Error.UNAUTHORISED) {
        // user is logged out. Since this is for a protected route,
        // we can simple send an empty prop object. Alternatively,
        // you can pass anything else you would like here.
        if (req.headers["content-type"] === "application/json") {
          return res
            .status(403)
            .send({ statusMessage: "Unauthrorized. Login again." });
        } else {
          if (options && options.sessionRequired) {
            return res.redirect("/auth");
          } else {
            return next({
              statusCode: "UNAUTHORIZED",
              statusMessage: "Unauthorized user. Login to authenticate."
            });
          }
        }
        // or return {} in case of getInitialProps
      } else {
        throw err;
      }
    }
    console.log("Session verified at: ", Date.now());
    next();
  };
}
