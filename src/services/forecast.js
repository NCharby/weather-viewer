define([
	"app",
	"backbone",
	"moment"
], function(App, Backbone, moment){

	//We need to custom sort function to put the returning weather hours in order
	var pastCollection =  Backbone.Collection.extend({
		comparator: function(m){
			return m.get("currently").time
		}
	})

	//to be honest, Backbone isn't good at getting this structure of data
	//Good thing we can shim in our own functionality
	var _service = Backbone.Model.extend({
		initialize: function(key){
			if(!key){
				throw new Error("No Forecast.io key present")
			}
			this.apikKey = key;
			this.baseUrl = "https://api.forecast.io/forecast/" + this.apikKey + "/"; 
		},
		/**
		 * Get the current weather for a point on the map
		 * @param  {object} lngLat the map point from MapBox {lng, lat}
		 * @return {Promise} Jquery Ajax
		 */
		getCurrent: function(lngLat){
			var callback = function(data){
				return this.set(data)
			}.bind(this);
			var url = this.baseUrl + lngLat.lat +','+ lngLat.lng + "?units=auto";
			return this._requestWeather(url, callback);
		},
		/**
		 * @param  {object} lngLat lngLat the map point from MapBox {lng, lat}
		 * @return {Promise}
		 */
		getPast: function(lngLat){
			var dfd = $.Deferred();
			//counter for when all have finished
			var dataCollection = new pastCollection()

			for (var i = 0 ; i <= 23; i++) {
				var time = moment().subtract(i, "hours").format()
				var url = this.baseUrl + lngLat.lat +','+ lngLat.lng + ',' + time + "?units=auto";

				this._requestWeather(url, time)
					.then(function(d){
						dataCollection.add(d)
						if(dataCollection.length === 24){ //when all 24 are done, resolve
							dataCollection.sort() //put then in the right order
							dfd.resolve(dataCollection);
						}
					}, function(e){
						console.log("getPast failed: ", e);
					})

			}

			return dfd.promise();
		},
		/**
		 * @param  {string}   url      
		 * @param  {Function} callback 
		 * @return {Promise}            
		 */
		_requestWeather: function(url, callback){
			return $.ajax({
				url: url,
				dataType:'jsonp', //forgive me, I fought setting up a proxy for like 3 hours..
				success: callback
			})

		}
	})

	return _service;
})