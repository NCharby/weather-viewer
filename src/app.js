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
        return Handelbars.compile(n, t);
    };
    //kinda goofy thing in Marionette, you have to set this location yourself.
    Marionette.Behaviors.behaviorsLookup = function() {
        return App.Behaviors;
    };

    /**
	 * App.Settings
	 * Top-level things that we can use around the app. Meant for things like user data and connection strings
	 * @type {Backbone.Model}
	 */
    var _settings = Backbone.Model.extend({
    	defaults: { //this is a nice way of noting what is expected here
    		"apikeys": false,
            "userinfo": false,
            "userlocation": false,
            "isLoggedIn": false,
            "userlocation": false
    	},
        /**
         * Set a start location for the user. 
         * @triggers 'userlocation:ready'
         * @returns {Backbone.Model} this
         */
        setUserLocation: function(){
            //Set the location in this order
            // - bootstrapped location (useful if we save that info in a profile, done by App start function)
            // - geolocation
            // - the Beruta Triangle
            //  
            //this gets a bit long-winded
            if(this.get('userlocation')){
                this.trigger('userlocation:ready', this.get('userlocation'));
                return this;
            }
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        this.set('userlocation', {
                            "lat":  position.coords.latitude,
                            "lng": position.coords.longitude
                        });
                        this.trigger('userlocation:ready', this.get('userlocation'));
                    }.bind(this),
                    function(e){ ///location failed
                        console.warn("Geolocation failed", e)
                        _geolocationFail(this);
                    }.bind(this)
                );

            } else {
                console.warn("Geococation Not supported");
                _geolocationFail(this)
            }

            function _geolocationFail(ctx){
                ctx.set('userlocation', {
                    "lat": 25.0000,
                    "lng": -71.0000
                });
                ctx.trigger('userlocation:ready', ctx.get('userlocation'));
            }
            return this;
        }
    });

    /**
     * App.Router
     * Pretty basic Backbone.Router implimentation. Uses Require to go get views, add them as regions
     */
    //TODO Could be in it's own file
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
    		//example code for having multiple routes
    	}
    });

    
    /**
     * Core Application object definition. 
     * 
     */
    var _app = Marionette.Application.extend({
    	initialize: function(options){

    	},
    	regions: { //setup a container for the header
    		HeaderRegion: '.nav-header'
    	},
    	Settings: new _settings,
    	Router: new _router,
        /**
         * Keep services on the App level. This lets us instaciate once if there 
         * are multiple consumers. 
         * @type {Object}
         */
        Services: {},
        /**
         * Add a Service to the App.Services object. Will return an instanciated 
         * if you've alread called this for a service. 
         * 
         * Experimental
         * @param name {string} What to reference the service by
         * @param service {function} The service definition
         * @param options {object} What to pass on instanciation
         */
        setService: function(name, service, options){
            //return the instanciated service if you've already done this
            _.each(this.Services, function(s, n){
                if(s instanceof service){
                    return s;
                }
                if(n.toLowerCase() === name.toLowerCase()){ //prevent case differences
                    throw new Error("setService: Whoa, name overlap")
                }
            });
            //safety first kids, this is core functionality
            //I'm sure I'm missing edge cases here
            if(_.isString('name') || typeof service === "function"){
                //set the thing
                return this.Services[name] = new service(options);                
            } else {
                throw new Error('Whoa, slow down there. setService expects better arguments than that.')
            }
            
        }
    });


	
	//Yes it's a global, but let me defend it. 
	//Having ONE application wrapper global simplifies things later.
	//We can easily access parts of the App like the Router or a Utilities object.
	//We can debug more easily without having to throw in a bunch of console.logs
	//We get one cosy place to bolt on major additions later
    App = new _app;
    App.on('start', function(){
		App.Behaviors = App.Behaviors || {};

		//everthing is ready, show the header
		App.getRegion('HeaderRegion').show(new headerView({model: App.Settings}))
		//fire up the Backbone router, will trigger views
		Backbone.history.start();
        
	});

	return App;
})