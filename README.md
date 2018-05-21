# Houston Book Link [![Build Status](https://travis-ci.org/rmoscowitz/houston-book-link.svg?branch=master)](https://travis-ci.org/rmoscowitz/houston-book-link)
See our [Houston Hackathon](https://houstonhackathon5.devpost.com/submissions) submission.

## Technology stack
* Node script to scrape Overdrive APIs for library entities (/server/extractor)
* Postgres to store scraped library entries from Overdrive
* Node express server to expose endpoints for use by front-end
* [CreateReactApp](https://github.com/facebookincubator/create-react-app) for React front-end, with Bootstrap & ionicons

## To serve application
* Get your Overdrive API credentials
    * If you want to work with Houston libraries, ask the current maintainer for them
* Set the `OVERDRIVE_CLIENT_SECRET` and `OVERDRIVE_CLIENT_ID` environment variables
* Checkout and navigate into the repo
* Install node from https://nodejs.org/en/download/
* Install postgres (`brew install postgres` for mac users)
* Create the database with `createdb postgres`
* Run `npm install` to get dependencies
* Run `npm run build-backend` then `npm run migrate` then `npm run run-seeds` to set up your database schema
* Run `npm run extractor` to populate your database with books from Overdrive
* Run `npm start` to start up Node express server and serve front-end

## Contributing
* Please make changes in feature branches and submit a pull request to master.
* New contributors welcome!

![Houston Book Link logo](https://raw.githubusercontent.com/rmoscowitz/houston-book-link/master/src/images/logo3.png)
