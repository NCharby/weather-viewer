define([
	"moment"
], function(moment){

	//We need to custom sort function to put the returning weather hours in order
	var pastCollection =  Backbone.Collection.extend({
		comparator: function(m){
			return m.get("currently").time
		}
	})

	//to be honest, Backbone isn't good at getting this structure of data
	//Good thing we can shim in our own functionality
	return Backbone.Model.extend({
		initialize: function(){
			if(!App.Settings.get('apikeys').forecast){
				throw new Error("No Forecast.io key present")
			}
		},
		baseUrl: "https://api.forecast.io/forecast/" + App.Settings.get('apikeys').forecast + "/",
		/**
		 * Get the current weather for a point on the map
		 * @param  {object} lngLat the map pint from MapBox {lng, lat}
		 * @return {Promise} Jquery Ajax
		 */
		getCurrent: function(lngLat){
			var callback = function(data){
				this.set(data)
			}.bind(this);
			var url = this.baseUrl + lngLat.lat +','+ lngLat.lng + "?units=auto";
			return this._requestWeather(url, false, callback);
		},
		/**
		 * [getPast description]
		 * @param  {[type]} lngLat [description]
		 * @param  {[type]} time   [description]
		 * @return {[type]}        [description]
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
		 * [_requestWeather description]
		 * @param  {[type]}   url      [description]
		 * @param  {[type]}   time     [description]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		_requestWeather: function(url, time, callback){
			return $.ajax({
				url: url,
				dataType:'jsonp', //forgive me, I fought setting up a proxy for like 3 hours..
				success: callback
			})

		}
	})

})