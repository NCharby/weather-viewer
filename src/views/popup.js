define([
	"text!../tpl/weather-now.html!strip",
	"text!../tpl/weather-past.html!strip",
	"handlebars",
	"chartist",
	"moment"
], function(tplNow, tplPast, Handlebars, Chartist, moment){

	//Using a regular old Backbone view here for simplicity
	//Marionette tries to manage too much sometimes. Mapbox will
	//remove the el from the Dom, we just need to clean up the 
	//bindings.
	var nowData = Backbone.View.extend({
		template: Handlebars.compile(tplNow),
		initialize: function(lngLat){
			this.model = App.Services.Forecast;
			this.model.getCurrent(lngLat)
				.then(function(){
					this.render();
				}.bind(this))
		},		
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.trigger('render');
		}
	});

	var pastData = Backbone.View.extend({
		template: Handlebars.compile(tplPast),
		initialize: function(lngLat){
			App.Services.Forecast.getPast(lngLat)
				.then(function(collection){
					this.collection = collection;
					this.render();
				}.bind(this))
		},
		render: function(){
			this.$el.html(this.template());
			this.trigger('render');
			_.defer(function(){
				this.Chart = new Chartist.Line(this.$('canvas')[0], this.getChartData(),{
					width: "300px",
					height: "200px"
				});
				console.log(this.Chart)
			}.bind(this))
		},
		getChartData: function(){
			return {
				labels: _.map(this.collection.toJSON(), function(m){
					return moment.unix(m.currently.time).format("HH");
				}),
				series: [ _.map(this.collection.toJSON(), function(m){
					return m.currently.temperature;
				})]
			}
		}
	});

	return Backbone.View.extend({
		className: "container-fluid",
		initialize: function(opts){

			// destroy has the context of the MapBox Popup normally.
			_.bindAll(this, "destroy");
			//setup subviews
			this.CurrentWeather = new nowData(opts.lngLat)
			this.PastWeather = new pastData(opts.lngLat)
			//decoupling views. I expect current will finish first, but you never know.
			this.CurrentWeather.on('render', this.renderCurrent, this);
			this.PastWeather.on('render', this.renderPast, this)
		},
		renderCurrent: function(){
			this.$el.append(this.CurrentWeather.$el);
		},
		renderPast: function(){
			this.$el.append(this.PastWeather.$el);
		},
		destroy: function(){
			this.stopListening();
		}

	})
})