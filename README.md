# Web SaaS Starter Kit - Node.js, Express

## Boilerplate for a web app with common features that every SaaS(Software as a Service) needs

Every time, I wanted to build a new web app, I used to code everything from scratch. Login, signup, session management, email notifications, and whatnot. Eventually, when I had found the right tools and code for everything, I kept that as a starter template for myself so I wouldn't need to solve the challenges that I had already solved.

Am I the only person who needs these features for a new project? Or does everyone needs the same features in their web-based SaaS tool? Why not open-source this and let everyone bootstrap their projects with this template!

I hope, this saves some time and helps you invest your time and energy in making system design and programming decisions that are unique to your SaaS web app. Start a project a little ahead of the starting line, where some common features are already implemented and well tested.

## Features

- [x] Signup and signin
- [x] Session management
- [x] Reset password
- [x] Email notifications
- [ ] Events and queues
- [ ] Feature flagging
- [x] Single file to configure features(e.g. API keys, settings)

**Made to last long**

For most of these features, I have used other stable and well-maintained open-source projects. So you don't need to rely on me to keep this starter kit up-to-date(well, except updating once in a while, which I can certainly find time for).

**Get started**

- Clone this repo
- npm install
- Update the config for development (`config/development.env`)
- For email templates, we use [MJML](https://documentation.mjml.io/). To update them, update the `views/email-templates/**/html.mjml` file and export it to `html.ejs` in the same folder. For which you can either use editor plugins such as [vscode-mjml](https://documentation.mjml.io/) or [mjml](https://github.com/mjmlio/mjml) javascript library
- Make your changes to the code
- `npm start`


**Folder structure**

- `app.js` - The main file that spawns the server
- `routes` - You may call it controller as well. The purpose of this code is to route requests to appropriate service after validation
- `middleware` - Different routes want to apply some common logic before the request is processed e.g. "is this a request from an authenticated user?". This folder contains code for those common things you want to do before the request is processed.  If you know express, you know this already. If not, check `routes/auth.js` to see how you can call a middleware on a route.
- `services` - The purpose of this code is to make request to database or external APIs. Controllers(`routes`) and other services use the services available here
- `views` - Frontend html code. We use `ejs` here as the templating langugage
- `views/email-templates` - All the email templates written in `mjml` and then exported to `ejs`
- `public` - Frontend side assets including styles and javascript code
- `config` - The configurations, you'll likely want to change to suit your project

**Configuration**

- Update them at config/development.js or config/production.js
- SITE_DOMAIN_URL
- SITE_TITLE
- REPO_URL
- SUPERTOKENS_CORE_URI
- SUPERTOKENS_CORE_API_KEY

**Checklist for production deployment**

1. Update the config for production (`config/production.env`)
2. Make sure to run the server with NODE_ENV=production (e.g. `node app.js --prod`)

Made with awesome open-source projects 👉 express, cors, morgan, nodemailer, mjml, supertokens and more

## License - MIT
