require.config({
	basePath: '/src',
	paths: {
		jquery: '../bower_components/jquery/dist/jquery.min',
		backbone: "../bower_components/backbone/backbone-min",
		underscore: "../bower_components/underscore/underscore-min",
		"backbone.marionette": "../bower_components/backbone.marionette/lib/backbone.marionette.min",
		text: "../bower_components/text/text"
	},
	shim: {
		underscore: {
	      	exports: "_"
	    },
	    backbone: {
	      	deps: ["jquery", "underscore"],
	      	exports: "Backbone"
	    },
	    marionette: {
	      deps: ["backbone"],
	      exports: "Marionette"
	    },
	    tpl: ["text"]
	}

});

/**
 * App startup. Load bootstrapped data, fire the App start.
 */
require([
	"app"	
], function(App){
	//This would be a good place to pass in start-up options too.
	App.start();
});