Control your hydroponics green house using a Raspberry PI via the Browser using NodeJS, Socket.IO and pi-gpio and MongoDB.

# Requirements #

Install the latest node.js on your Raspbian:

https://github.com/joyent/node/wiki/installing-node.js-via-package-manager


Install GPIO Admin, to allow users other than root to access the GPIO:

https://github.com/quick2wire/quick2wire-gpio-admin

## Install Dependencies ##

To install dependencies, issue:

npm install

## Configuration ##

To configure the application change utils/config.js.

## Start application ##

To start the application, issue:

npm start

Or:

nodejs index.js

Navigate to your Raspberry PI IP and port to view the application.

## Developer notes ##

index.js - Provides a basic NodeJS module. See documentation for details.

start.sh - Provides a basic shell script to run the application in background.

start.sh - Provides a basic shell script to gracefully stop the nodejs application.

