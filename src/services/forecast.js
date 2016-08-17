define([

], function(){

	return Backbone.Model.extend({
		initialize: function(){
			if(!App.Settings.get('apikey:forecast')){
				throw new Error("No Forecast.io key present")
			}
		}
	})

})