define([
	
], function(){

	return Backbone.Model.extend({
		initialize: function(){
			if(!App.Settings.get('apikeys').forecast){
				throw new Error("No Forecast.io key present")
			}
		},
		baseUrl: "https://api.forecast.io/forecast/" + App.Settings.get('apikeys').forecast + "/",

		getCurrent: function(){
			return $.ajax({

			})
		},

		getPast: function(){

		}
	})

})