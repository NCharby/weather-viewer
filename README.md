#Weather Viewer

A fun example Backbone application using Mapbox and Forecast.io

##Set Up

You'll need [Node.js](https://nodejs.org/en/) installed.

`sudo apt install node-legacy`

You'll also need a basic HTTP server.

`sudo npm install http-server -g`


###Dependencies

All libraries are packed with [Bower](https://bower.io/) and [npm](https://www.npmjs.com/)

`sudo npm install -g bower`

With Bower and npm installed, you can run within the project:

`npm install && bower install` 

###Api Keys
I've built this as through there was a real middle teir in place to emit data onto the page. Api Keys are expected to hydrate the app. In `index.html` there is a script block that needs your help. 

Grab a [forecast.io](https://developer.forecast.io/) key and place it on `apikeys:forecast`

Do the same for a [Mapbox](https://www.mapbox.com/developers/) at `apikeys:mapbox`


###Running

Within the project root, run:

`http-server`

And go to 127.0.0.1:8080 in your browser

For Unit tests, go to http://127.0.0.1:8080/test/SpecRunner.html


*Enjoy* 