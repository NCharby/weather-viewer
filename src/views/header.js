define([
	"text!../tpl/header.html!strip",
	"jquery",
	"underscore",
	"backbone.marionette"
], function(tplHeader, $, _, Marionette){
	/**
	 * Minimal code to get a view showing up
	 * @type {Marionette.ItemView}
	 */
	return Marionette.ItemView.extend({
		tagName: 'nav',
		className: "navbar navbar-inverse",
		template: tplHeader
	})

})