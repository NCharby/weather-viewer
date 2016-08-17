define([
	"views/header",
	"jquery",
	"underscore",
	"backbone.marionette",
	"handlebars",
	"bootstrap"
], function(headerView, $, _, Marionette, Handelbars, Bootstrap){

	//Do some overrides for my sanity
	Marionette.TemplateCache.prototype.compileTemplate = function(n, t) {
        return Handelbars.compile(n, t)
    };
    //kinda goofy thing in Marionette, you have to set this location yourself.
    Marionette.Behaviors.behaviorsLookup = function() {
        return App.Behaviors
    };

    /**
	 * App.Settings
	 * Top-level things that we can use around the app. Meant for things like user data and connection strings
	 * @type {Backbone.Model}
	 */
    var _settings = Backbone.Model.extend({
    	//seperating settings up by [domain]:[key] sets a precident for thinking about things in groups
    	//Also, you can listen for things like "change:apikey" without know what api key changed
    	defaults: {
    		"apikey:forecast": false,
    		"apikey:mapbox": false
    	}
    });

    /**
     * App.Router
     * Pretty basic Backbone.Router implimentation. Uses Require to go get views, add them as regions
     */
    var _router = Backbone.Router.extend({
    	routes: {
    		"": 		"index",
    		"help": 	"/help"
    	},
    	initialize: function(){

    	},
    	index: function(url){
    		require(['views/map'], function(view){
    			App.addRegions({
    				Map: new view(url)
    			})
    		});
    	},
    	help: function(){
    		//example code for having multip routes
    		//I don't want to get into this, as I'd have to setup an actual server
    	}
    });

    
    /**
     * Core Application object definition. 
     * 
     */
    var app = Marionette.Application.extend({
    	initialize: function(options){

    	},
    	regions: { //setup the a container for the header
    		HeaderRegion: '.nav-header'
    	},
    	Settings: new _settings,
    	Router: new _router
    });


	
	//Yes it's a global, but let me defend it. 
	//Having ONE application wrapper global simplifies things later.
	//We can easily access parts of the App like the Router or a Utilities object.
	//We can debug more easily without having to throw in a bunch of console.logs
	//We get one cosy place to bolt on major additions later
    App = new app;
    App.on('start', function(){
		//Load our 'bootstrapped' data
		//Doing much with this is out of scope for this quick project
		App.Settings.set('userinfo', window.userinfo);
		App.Settings.set('apikey:forecast', window.apikey.forcast);
		App.Settings.set('apikey:mapbox', window.apikey.mapbox);

		App.Behaviors = App.Behaviors || {};

		//everthing is ready, show the header
		App.getRegion('HeaderRegion').show(new headerView({model: App.Settings}))
		//fire up the Backbone router, will trigger views
		Backbone.history.start();
	});

	return App;
})