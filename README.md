<h1 align="center">
    AcaGig
</h1>

<p align="center">
    <a href="https://codeclimate.com/github/jsonunger/AcaGig"><img src="https://codeclimate.com/github/jsonunger/AcaGig/badges/gpa.svg" /></a>
    <a href="https://codeclimate.com/github/jsonunger/AcaGig/coverage"><img src="https://codeclimate.com/github/jsonunger/AcaGig/badges/coverage.svg" /></a>
    <a href="https://travis-ci.org/jsonunger/AcaGig"><img src="https://travis-ci.org/jsonunger/AcaGig.svg?branch=master"></a>
    <a href="https://codeclimate.com/github/jsonunger/AcaGig"><img src="https://codeclimate.com/github/jsonunger/AcaGig/badges/issue_count.svg" /></a>
</p>

<p align="center">
<b><a href="#overview">Overview</a></b>
|
<b><a href="#local-setup">Local Setup</a></b>
|
<b><a href="#technologies">Technologies</a></b>
</p>

## Overview
***AcaGig*** is a cappella group organization and gig planning application, built with Node, Express, React, and Redux, among other tools.

There are three types of users: Leaders, Business Managers, Music Directors, and Members. Each user type has different abilities:
- Leaders can add and manage group members and member statuses *(active|inactive)*
- Business Managers manage gig requests and responses
- Music Directors manage repertoire and setlists for gigs
- Members can view repertoire, upcoming gigs, and reply to gig requests

## Local Setup
```bash
$ npm install
$ npm run db-init
```
The `db-init` npm script uses the `psql` CLI to create the database, so make sure you have the [PostgreSQL command line tools](https://www.postgresql.org/docs/9.2/static/app-psql.html) installed or you will encounter errors.

##### Authentication
In development, this application uses [***dotenv***](https://www.npmjs.com/package/dotenv) to add OAuth parameters for PassportJS.

If you do not care about Facebook or Google authentication, make sure to comment out the `if` block at line 10 in [`server/app/configure/authentication/index.js`](https://github.com/jsonunger/AcaGig/blob/master/server/app/configure/authentication/index.js#L10). Otherwise, follow the instructions to add the appropriate variables to your `.env` configuration file.

##### Seeding
You will want to seed the database in order to see anything in action in the app.

The seed script works with JSON files in the `seedFiles` directory, so if you would like to add your own information please do it there.

Once you have added any new data to the seed files, seed the database:
```bash
$ npm run seed
```

Once you have seeded the database, you are ready to visit the app.
```bash
$ npm start
```

Visit [localhost:8080](http://localhost:8080) to see the app in action.

## Technologies
#### Back End
This being a full stack JavaScript application, I used **Node** and **Express** for my server and api. The program also uses **PostgreSQL** for the database and works with the **Sequelize** ORM to manage models and relations.
#### Front End
I went with **React** for my view library, and utilized additional libraries **React-Router** for my routing, **Redux** and **React-Redux** for state management, and **Axios** for AJAX calls, among others.
#### Other Tools
In order to use ES6 syntax and even some ES7 syntax, I use **Babel** configured for ES2015, React, and Stage-0 implementations with additional plugins. For bundling purposes, I went with **Webpack**. In development, webpack middleware is built into the Express process.

## Author's Note
This application was developed on a Mac, and as such will possibly work differently locally on Linux or PC systems.
