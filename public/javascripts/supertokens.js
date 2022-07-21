/**
 * Supertokens library related functions for authentication purpose
 */
supertokens.init({
  appInfo: {
    appName: "...",
    apiDomain:
      "http://localhost:8080" /**Change it to your website domain where this project is deployed */,
    apiBasePath: "/api",
    onHandleEvent: (context) => {
      console.log("SuperTokens event received");
      if (context.action === "UNAUTHORISED") {
        console.log("Unauthorized access");
        alert("You are logged out. Will redirect to login screen.");
        window.location.replace("/auth?redirectToPath=" + location.pathname);
        // called when the user doesn't have a valid session but made a request that requires one
        // NOTE: This event can fire multiple times

        if (context.sessionExpiredOrRevoked) {
          // the sessionExpiredOrRevoked property is set to true if the current call cleared the session from storage
          // this happens only once, even if multiple tabs sharing the same session are open, making it useful for analytics purposes
        }
      }
    }
  },
    recipeList: [
        supertokensSession.init(),
        supertokensEmailPassword.init({
          emailVerificationFeature: {
            mode: "REQUIRED"
          }
        })
    ],
});
// loginCheck();
// async function loginCheck(){
//   let isLoggedIn = await supertokens.doesSessionExist();
//   if(!isLoggedIn){
//     window.location.replace('/auth?redirectToPath=/user/profile');
//   } else {
//     let payload = await supertokens.getAccessTokenPayloadSecurely();
//     console.log(payload);
//   }
// }

async function logout() {
  await supertokensSession.signOut();
  window.location.replace("/auth");
}

if (location.hash && location.hash == "#try_refresh_token") {
  doRefresh();
}

async function doRefresh() {
  DOM.Loader.show("Refreshing access token...");
  console.log("Going to refresh token now");
  if (await supertokensSession.attemptRefreshingSession()) {
    // post session refreshing, we reload the page. This will
    // send the new access token to the server, and then
    // getServerSideProps will succeed

    if (location.search) {
      let redirectPage = new URLSearchParams(location.search).get(
        "redirectToPath"
      );
      if (redirectPage) {
        return window.location.replace(redirectPage);
      }
    }
    DOM.Loader.hide();
    location.hash = "";
    location.reload();
  } else {
    // the user's session has expired. So we redirect
    // them to the login page
    DOM.Loader.hide();
    window.location.replace("/auth?redirectToPath=" + location.pathname);
  }
}