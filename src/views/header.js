define([
	//I really wanted to do this with the text plugin, but I'm still avoiding setting up a server for CORS
	//"text!../tpl/header.html!strip",
	"jquery",
	"underscore",
	"backbone.marionette"
], function($, _, Marionette){
	/**
	 * Minimal code to get a view showing up
	 * @type {Marionette.ItemView}
	 */
	return Marionette.ItemView.extend({
		tagName: 'nav',
		className: "navbar navbar-inverse",
		template: $('#tpl-header').html()
	})

})