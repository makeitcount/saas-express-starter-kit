# Web SaaS Starter Kit - Node.js, Express

## Boilerplate for a web app with common features that every SaaS(Software as a Service) needs

Every time, I wanted to build a new web app, I used to code everything from scratch. Login, signup, session management, email notifications, and whatnot. Eventually, when I had found the right tools and code for everything, I kept that as a starter template for myself so I wouldn't need to solve the challenges that I had already solved.

Am I the only person who needs these features for a new project? Or does everyone needs the same features in their web-based SaaS tool? Why not open-source this and let everyone bootstrap their projects with this template!

I hope, this saves some time and helps you invest your time and energy in making system design and programming decisions that are unique to your SaaS web app. Start a project a little ahead of the starting line, where some common features are already implemented and well tested.

## Features

- [x] Signup and signin
- [x] Session management
- [ ] Reset password
- [ ] Email notifications
- [ ] Feature flagging
- [x] Single file to configure features(e.g. API keys, settings)

**Made to last long**

For most of these features, I have used other stable and well-maintained open-source projects. So you don't need to rely on me to keep this starter kit up-to-date(well, except updating once in a while, which I can certainly find time for).

**Get started**

- Clone this repo
- npm install
- Update the config for development (`config/development.env`)
- Make your changes to the code
- `npm start`

**Configuration**

- Update them at config/development.js or config/production.js
- SITE_DOMAIN_URL
- SITE_TITLE
- REPO_URL
- SUPERTOKENS_CORE_URI
- SUPERTOKENS_CORE_API_KEY

**Folder structure**

- `app.js` at the root is the main file that spawns express server
- `views` contains all the frontend html code. We use ejs here as templating langugage.
- public contains all the frontend side assets including styles and javascript code
- routes contains all the business logic for different routes
- config contains the configurations. Change them for your usage.

**Checklist for production deployment**

1. Update the config for production (config/production.env)
2. Make sure to run the server with NODE_ENV=production (e.g. node app.js --prod)

Made with awesome open-source projects 👉 express, cors, morgan, supertokens and more

## License - MIT
