require.config({
	basePath: '/src',
	paths: {
		jquery: '../bower_components/jquery/dist/jquery.min',
		backbone: "../bower_components/backbone/backbone-min",
		underscore: "../bower_components/underscore/underscore-min",
		"backbone.marionette": "../bower_components/backbone.marionette/lib/backbone.marionette.min",
		handlebars: "../bower_components/handlebars/handlebars.min",
		//text: "../bower_components/text/text",
		moment: "../bower_components/moment/min/moment.min",
		bootstrap: "../bower_components/bootstrap/dist/js/bootstrap.min"
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
	    //tpl: ["text"],
	    bootstrap: { 
	    	"deps": ['jquery'] 
	    }
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

	//Load our 'bootstrapped' data
	//Clever way of grabbing everything that gets emitted out
    //would need extending if more objects hit the dom
	for( var b in window.bootstrap){
        App.Settings.set(b, window.bootstrap[b])
    };
});