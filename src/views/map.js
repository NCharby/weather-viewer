define([
	
], function(){

	return Marionette.ItemView.extend({
		template: false,
		el: '.map.fullscreen',
		events: { //Hmmm... I bet I could shim mapboxgl with Backbone.Events....
			"click": "onClick"
		},
		initialize: function(params){
			console.log(this)
			//TODO Fallback for web gl
			if (!mapboxgl.supported()) {
    			alert("Uh Oh. Mapbox GL doesn't work in your browser!");
			}

			this.Map = this.initMap(App.Settings.get('apikey:mapbox'));

			this.Map.on("moveend", this.onMoveEnd)


			//init the location search box
			this.Geocoder = this.initGeocoder();
			//coordinate events from the geocoder
			this.Geocoder.on('result', function(result){
				this.trigger('geocoder:result', result)
			}.bind(this));
			//TODO add error handling
			this.Geocoder.on('error', function(error){
				this.trigger('geocoder:result', error)
			}.bind(this));

		},
		/**
		 * [initMap description]
		 * @param {string} The MapBox AccessToken
		 * @return {Object} A MapBox Map 
		 */
		initMap: function(token){
			mapboxgl.accessToken = token;
			return new mapboxgl.Map({
				container: this.$el[0],
				style: 'mapbox://styles/mapbox/streets-v9',
    			center: [-74.50, 40],
    			zoom: 9
			});
		},

		initGeocoder: function(){
			var _geocoder = new mapboxgl.Geocoder();
			this.Map.addControl(_geocoder);
			return _geocoder;
		},

		onMoveEnd: function(evt){

		},

		onClick: function(evt){

		},

		onGeocoderResult: function(evt){

		}
	})
})