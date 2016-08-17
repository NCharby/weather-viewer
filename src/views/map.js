define([
	"../services/forecast"
], function(Forecast){

	return Marionette.ItemView.extend({
		template: false,
		el: '.map.fullscreen',
		events: { //Hmmm... I bet I could shim mapboxgl with Backbone.Events....
		},
		initialize: function(params){
			//TODO Fallback for web gl
			if (!mapboxgl.supported()) {
    			alert("Uh Oh. Mapbox GL doesn't work in your browser!");
			}
			//set context of callbacks to this view - more useful
			_.bindAll(this, "onClick", "onGeocoderResult");

			this.Map = this.initMap(App.Settings.get('apikeys').mapbox);
			//this.Map.once('load', this.onMoveEnd); //fired on load. Do once
			this.Map.on("click", this.onClick);

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
		 * Start Mapbox! Sets the container to this element.
		 * @uses App.Settings 
		 * @param {string} The MapBox AccessToken
		 * @return {Object} A MapBox Map 
		 */
		initMap: function(token){
			mapboxgl.accessToken = token;
			return new mapboxgl.Map({
				container: this.$el[0],
				style: 'mapbox://styles/mapbox/streets-v9',
    			center: [App.Settings.get('userlocation').lat, App.Settings.get('userlocation').long],
    			zoom: 9
			});
		},
		/**
		 * Add the Geocoder extension to the MapBox instance 
		 * @return {Geocoder}
		 */
		initGeocoder: function(){
			var _geocoder = new mapboxgl.Geocoder();
			this.Map.addControl(_geocoder);
			return _geocoder;
		},

		onClick: function(evt){


			this.Popup = new mapboxgl.Popup()
				.setLngLat(evt.lngLat)
				.setHTML('<h1>hit</h1>')
				.addTo(this.Map);
		},

		getPopupHTML: function(){

		},

		onGeocoderResult: function(evt){

		}
	})
})