define([
	"../forecast"
], function(service){
	var apiKey = "a35c22c5e8404530d88d0fd5e07f6389"
	var Service = new service(apiKey)

	//test location
	var LngLat = {lng: -120.68287760937511, lat: 47.19502185465302}


	describe("baseUrl", function(){
		it("should be forecast.io url with apikey", function(){
			expect(Service.baseUrl).toBe("https://api.forecast.io/forecast/" + apiKey + "/");
		})
	})

	describe("getCurrent weather", function(){

		it("should come back with data", function(){
			spyOn($, "ajax").and.callThrough() //giving Spys a try
			Service.getCurrent(LngLat)
			expect($.ajax).toHaveBeenCalled()
			expect($.ajax.calls.mostRecent().args[0].success().attributes).toBeDefined()
		})
	})


	describe("getPast weather", function(){

		beforeEach(function(done){ //I'd normally test like this
			Service.getPast(LngLat)
				.then(function(d){
					this.data = d
					done()
				}.bind(this))
		})

		it("should come back with 24 hours of data", function(){
			expect(this.data.length).toBe(24)
		})

		it("should return a collection", function(){
			expect(this.data instanceof Backbone.Collection).toBeTruthy()
		})


	})


	describe("_requestWeather", function(){

		it("should do a jsonp and fire callback", function(){
			spyOn($, "ajax").and.callFake(function(o){
				o.success();
			})

			var callback = jasmine.createSpy();
			Service._requestWeather("https://api.forecast.io/forecast/a35c22c5e8404530d88d0fd5e07f6389/0,0", callback);
			expect(callback).toHaveBeenCalled()
		})
	})

})