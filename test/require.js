require.config({

	paths: {
		'jasmine': './lib/jasmine-2.4.1/jasmine',
      	'jasmine-html': './lib/jasmine-2.4.1/jasmine-html',
      	'jasmine-boot': './lib/jasmine-2.4.1/boot',
		jquery: '../bower_components/jquery/dist/jquery.min',
		backbone: "../bower_components/backbone/backbone-min",
		underscore: "../bower_components/underscore/underscore-min",
		"backbone.marionette": "../bower_components/backbone.marionette/lib/backbone.marionette.min",
		handlebars: "../bower_components/handlebars/handlebars.min",
		text: "../bower_components/text/text",
		moment: "../bower_components/moment/min/moment.min",
		bootstrap: "../bower_components/bootstrap/dist/js/bootstrap.min",
		chartist: "../bower_components/chartist/dist/chartist.min"
	},
	shim: {
		'jasmine-html': {
	      deps : ['jasmine']
	    },
	    'jasmine-boot': {
	      deps : ['jasmine', 'jasmine-html']
	    },
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
	    tpl: ["text"],
	    bootstrap: { 
	    	"deps": ['jquery'] 
	    }
	}

});


require(['jasmine-boot'], function () {
  require(['../src/services/tests/forecast.test'], function(){
    //trigger Jasmine
    window.onload();
  })
});