define([
	"../services/forecast",
	"./popup"
], function(Forecast, detailsPopup){

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

			//init the service
			App.setService('Forecast', Forecast);
			//Wait to do anything until the settings object has a location to start at
			App.Settings.on('userlocation:ready', function(){
				this.Map = this.initMap(App.Settings.get('apikeys').mapbox);
				//bind popup action
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
			}, this);

			//Ask App.Settings to get a location so we can start
        	App.Settings.setUserLocation();
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
    			center: [ 
    				App.Settings.get('userlocation').lng,
    				App.Settings.get('userlocation').lat 
    			],
    			zoom: 5
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
			var View = new detailsPopup(evt);

			this.Popup = new mapboxgl.Popup()
				.setLngLat(evt.lngLat)
				.setDOMContent(View.el)
				.addTo(this.Map);
			//clean up the view when the popup closes
			this.Popup.on('close', View.destroy)

		},

		getPopupHTML: function(){

		},

		onGeocoderResult: function(evt){

		}
	})
})