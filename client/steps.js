
count = 0;

$( window ).load(function() { //Wait for window to load so DeviceOrientationEvent can work
	if (window.DeviceOrientationEvent) {
	  // Listen for the deviceorientation event and handle the raw data
	  window.addEventListener('deviceorientation', function(eventData) {

	    // alpha is the compass direction the device is facing in degrees
	    var dir = eventData.alpha

//Depending on the Compass Direction Angle an arrow will be pointing to the corrected direction and will be set as a session variable
	if(dir >= 348)
	  Session.set("arrowDirection", "/arrows/arrowNBW.png")
	else if(dir >= 337)
		Session.set("arrowDirection", "/arrows/arrowNNW.png")
	else if(dir >= 326)
		Session.set("arrowDirection", "/arrows/arrowNWBN.png")
	else if(dir >= 315)
	  Session.set("arrowDirection", "/arrows/arrowNW.png")
	else if(dir >= 303)
		Session.set("arrowDirection", "/arrows/arrowNWBW.png")
	else if(dir>= 292)
	  Session.set("arrowDirection", "/arrows/arrowWNW.png")
	else if(dir>= 281)
		Session.set("arrowDirection", "/arrows/arrowWBN.png")
	else if(dir>= 270)
		Session.set("arrowDirection", "/arrows/arrowW.png")
	else if(dir>= 258)
		Session.set("arrowDirection", "/arrows/arrowWBS.png")
	else if(dir>= 247)	
		Session.set("arrowDirection", "/arrows/arrowWSW.png")
	else if(dir>= 236)
		Session.set("arrowDirection", "/arrows/arrowSWBW.png")
	else if(dir>= 225)		
		Session.set("arrowDirection", "/arrows/arrowSW.png")
	else if(dir>= 213)
		Session.set("arrowDirection", "/arrows/arrowSWBS.png")
	else if(dir>= 202)
		Session.set("arrowDirection", "/arrows/arrowSSW.png")
	else if(dir>= 191)
		Session.set("arrowDirection", "/arrows/arrowSBW.png")
	else if(dir>= 180)
		Session.set("arrowDirection", "/arrows/arrowS.png")
	else if(dir>= 168)	
		Session.set("arrowDirection", "/arrows/arrowSBE.png")
	else if(dir>= 157)
		Session.set("arrowDirection", "/arrows/arrowSSE.png")
	else if(dir>= 146)
		Session.set("arrowDirection", "/arrows/arrowSEBS.png")
	else if(dir>= 135)
		Session.set("arrowDirection", "/arrows/arrowSE.png")
	else if(dir>= 123)
		Session.set("arrowDirection", "/arrows/arrowSEBE.png")
	else if(dir>= 112)
		Session.set("arrowDirection", "/arrows/arrowESE.png")
	else if(dir>= 101)
		Session.set("arrowDirection", "/arrows/arrowEBS.png")
	else if(dir>= 90)
		Session.set("arrowDirection", "/arrows/arrowE.png")
	else if(dir>= 78)
		Session.set("arrowDirection", "/arrows/arrowEBN.png")
	else if(dir>= 67)
		Session.set("arrowDirection", "/arrows/arrowENE.png")
	else if(dir>= 56)
		Session.set("arrowDirection", "/arrows/arrowNEBE.png")
	else if(dir>= 45)	
		Session.set("arrowDirection", "/arrows/arrowNE.png")
	else if(dir>= 33)	
		Session.set("arrowDirection", "/arrows/arrowNEBN.png")
	else if(dir>= 22)
		Session.set("arrowDirection", "/arrows/arrowNNE.png")
	else if(dir>= 11)
		Session.set("arrowDirection", "/arrows/arrowNBE.png")
	else
	  	Session.set("arrowDirection", "/arrows/arrowN.png")

	  }, false);
} 
});
  


Template.steps.helpers({
	routeStartStop: function() {
		return Session.get("routeStartStop");
	},
	estimate:function() {
		console.log(Session.get("routeDist"));
		if (Session.get("routeToTake")[0][0] == "Y") {
				return "no walking needed"
		}
		else {
				if (Session.get("routeDist") == "" || Session.get("routeDist")== null || Session.get("routeDist") == undefined || Session.get("routeDist") == NaN) {
				return "";
			}
			else {
	
					return "about "+Math.ceil(Session.get("routeDist")*0.02)+ " minutes of walking";
				
				
			}
		}

		return "about "+Math.ceil(Session.get("routeDist")*0.02)+ " minutes of walking";
	},
	stepMapOptions: function() {
		if (GoogleMaps.loaded()) {
			//console.log(Session.get("currentLocation").x,Session.get("currentLocation").y);
			return {
				center: new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y),
				zoom:17
			};
		}
	},
	step: function() {
		return Session.get("step");
	},
	current: function() {
		return Session.get("currentLocation");
	},
});

Template.steps.events({
	"click #refreshMap" : function(event) {
		event.preventDefault();
		if (count < (route.length - 2)){
			count ++;
			console.log(count);
			// getStepDescription(route);
			// if (count != 0) {
			// 	routesForStep[count - 1].setOptions({strokeColor: '#000000'});
			// }
			
			// routesForStep[count].setOptions({strokeColor: '#00FFFF'});
			Session.set("countRefresh", count);
			console.log(Session.get("countRefresh"));
			
				
		} else {
			alert("You reached your destination.");
			//count --;
		}

	},
	"click #previousMap" : function(event) {
		event.preventDefault();
		if (count > 0){
			count --;
			console.log(count);
			// getStepDescription(route);
			// if (count != route.length) {
			// 	routesForStep[count + 1].setOptions({strokeColor: '#000000'});
			// }
			
			// routesForStep[count].setOptions({strokeColor: '#00FFFF'});
			Session.set("countPrev", count);
			console.log(Session.get("countPrev"));
		} else {
			alert("You are at the first step.");
			//count ++;
		}

	},
	"click #recalMap": function(event){
		event.preventDefault();
		count = 0;
		//console.log("count in recal: " + count);
		for(var i = 0; i<route.length - 1; i++){
			routesForStep[count].setOptions({strokeColor: '#00FFFF'});
			console.log("change route back to black");
		}

		Session.set("current","(" + Session.get("currentLocation").x + ", " + Session.get("currentLocation").y + ")");
		var navFrom = Session.get("current");
		var navTo = Session.get("destination");

		route = getRoute(navFrom, navTo);
		startstop = findId(route[0]);
		laststop = findId(route[route.length - 1]);
			//middlestop = findId(route[count]);

		Session.set("routeForStep", route);
		Session.set("countForStep", count);
		
		getStepDescription(route);

	}
});

Template.steps.rendered = function () {
	Session.set("pageTitle","Directions");
	Session.set("navigateFrom","")
	Session.set("navigateTo","");
	
	if ($(window).width() > 768) {
		$(".page-header").prepend("<a href='#' id='returnToList' class='back'><span class='glyphicon glyphicon-menu-left'></span></a>");
	}
	
	
	//graph = new Graph(Map.findOne());


	route = Session.get("routeForStep");
	console.log("route: " + route);
	console.log("route length: " + route.length);
	startstop = findId(route[0]);

	//nextstop = findId(route[count]);

	laststop = findId(route[route.length - 1]);
	console.log("startstop:" + startstop.x + "," + startstop.y);
	console.log("laststop:" + laststop.x + "," + laststop.y);
	//middlestop = findId(route[count]);
	
	getStepDescription(route);	

	GoogleMaps.load();
	GoogleMaps.ready('stepMap',function(map){
		autoNextStepRadius = new google.maps.Circle({
			center: new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y),
		   	  radius: 2.5,
		      strokeColor: '#FF0000',
			  strokeOpacity: 0.8,
			  strokeWeight: 2,
			  fillColor: '#FF0000',
			  fillOpacity: 0.35,
		    map: map.instance
		});
		marker1 = new google.maps.Marker({
			position: new google.maps.LatLng(startstop.x,startstop.y),
			icon: '/GoogleMapsMarkers/green_MarkerA.png',
			map: map.instance
		});
		marker2 = new google.maps.Marker({
			position: new google.maps.LatLng(laststop.x,laststop.y),
			icon: '/GoogleMapsMarkers/red_MarkerB.png',
			map:map.instance
		});
		markerCurrent = new google.maps.Marker({
			position: new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y),
			icon: Session.get("arrowDirection"), //Here directional arrow
			map:map.instance
		});

		Tracker.autorun(function() {
			console.log("in the autorun for routesForStep : " + Session.get("routeForStep"));
			route = Session.get("routeForStep");
			if (route.length == 1){
				//console.log("test google map ready");
				deleteRoutes(routesForStep);
				//console.log("delete route");

				var theLatLngRecal = new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y);
				map.instance.setCenter(theLatLngRecal);
				markerCurrent.setPosition(theLatLngRecal);
				var theLatLng1 = new google.maps.LatLng(startstop.x,startstop.y);
				marker1.setPosition(theLatLng1);
				var theLatLng2 = new google.maps.LatLng(laststop.x,laststop.y);
				marker2.setPosition(theLatLng2);

				// alert("you are at your destination");
			} else {

				//console.log("test google map ready");
				deleteRoutes(routesForStep);
				routesForStep = [];
				//console.log("delete route");

				var theLatLngRecal = new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y);
				map.instance.setCenter(theLatLngRecal);
				markerCurrent.setPosition(theLatLngRecal);
				var theLatLng1 = new google.maps.LatLng(startstop.x,startstop.y);
				marker1.setPosition(theLatLng1);
				var theLatLng2 = new google.maps.LatLng(laststop.x,laststop.y);
				marker2.setPosition(theLatLng2);

				
				for(var j = 0; j<route.length - 1; j++){
					if (j != count){
						addRoutes(route[j],route[j+1],'stepMap', map,'#000000',routesForStep);
						console.log("draw route");
					} else {
						addRoutes(route[j],route[j+1],'stepMap', map,'#00FFFF',routesForStep);;
					}

				}

			// 	if (count == 0) {
			// // 	console.log("ready to add blue route: " + Session.get("countForStep"));
			// 		console.log("count before blue: " + count);
			//  		routesForStep[count].setOptions({strokeColor: '#00FFFF'});
			//  		//console.log("added blue route");
			//  		//count ++;
			// 	}
			}	

		})

		Tracker.autorun(function() {
			console.log("in the autorun now for countRefresh:" + Session.get("countRefresh"));
			var countRefresh = Session.get("countRefresh");
			getStepDescription(route);
			// if (countRefresh != 0 && routesForStep != []) {
			// 	routesForStep[countRefresh - 1].setOptions({strokeColor: '#000000'});
			// }
			
			// routesForStep[countRefresh].setOptions({strokeColor: '#00FFFF'});
			deleteRoutes(routesForStep);
			routesForStep = [];
			for(var j = 0; j<route.length - 1; j++){
				if (j != countRefresh){
					addRoutes(route[j],route[j+1],'stepMap', map,'#000000',routesForStep);
					console.log("draw route");
				} else {
					addRoutes(route[j],route[j+1],'stepMap', map,'#00FFFF',routesForStep);;
				}

			}
		})


		Tracker.autorun(function() {
			console.log("in the autorun now for countPrev:" + Session.get("countPrev"));
			var countPrev = Session.get("countPrev");
			getStepDescription(route);
			// if (countPrev != route.length && routesForStep != []) {
			// 	routesForStep[countPrev + 1].setOptions({strokeColor: '#000000'});
			// }
			
			// routesForStep[countPrev].setOptions({strokeColor: '#00FFFF'});
			deleteRoutes(routesForStep);
			routesForStep = [];
			for(var j = 0; j<route.length - 1; j++){
				if (j != countPrev){
					addRoutes(route[j],route[j+1],'stepMap', map,'#000000',routesForStep);
					console.log("draw route");
				} else {
					addRoutes(route[j],route[j+1],'stepMap', map,'#00FFFF',routesForStep);;
				}

			}
		})



		// 	if (count == 1) {
		// // 	console.log("ready to add blue route: " + Session.get("countForStep"));
		//  		routesForStep[count - 1].setOptions({strokeColor: '#00FFFF'});
		//  	//console.log("added blue route");
		// 	}

		Tracker.autorun(function() {
			//console.log("currentLocation changes");
			var theLatLng = new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y);
			map.instance.setCenter(theLatLng);
			markerCurrent.setPosition(theLatLng);
			markerCurrent.setIcon(Session.get("arrowDirection"));
			console.log(getNextStep())
			// console.log(GeoJSON.pointDistance(Session.get("currentLocation").x ,Session.get("currentLocation").y))
			//wanna know if we should go next step
			//checks first two points at beginning and draws line
			//check proximity of point to slope




			 //Resets the icon so that we can get a different directional
				// console.log("set center: " + middlestop.x + "," + middlestop.y);
				// var theLatLngMiddle = new google.maps.LatLng(middlestop.x,middlestop.y);
				// map.instance.setCenter(theLatLngMiddle);
			//console.log("test run autorun in rendered");


			// nextstop = findId(route[count]);
			// if (autoNextStep(nextstop) == true) {
			// 	if (count < (route.length - 2)){
			// 		count ++;
			// 		//console.log("count:" + count);
			// 		//Session.set("countForStep", count);
			// 		getStepDescription(route);
			// 			//middlestop = findId(route[count]);
			// 		if (count != 0) {
			// 			routesForStep[count - 1].setOptions({strokeColor: '#000000'});
			// 		}
					
			// 		routesForStep[count].setOptions({strokeColor: '#00FFFF'});
							
			// 	} else {
			// 		alert("You reached your destination.");
			// 		//count --;
			// 	}

			// }

		})

	});



};

Template.steps.onCreated(function() {
	//Session.set("countForStep", count);
	count = 0;
	Session.set("countRefresh", count);
	Session.set("countPrev", count);
	routesForStep = [];
	graph = new Graph(Map.findOne());

});

// function autoNextStep(nextStop){
// 	var tfnext = false;
// 	var currentForAuto = Session.get("currentLocation");
// 	Meteor.call("distance", Session.get("currentLocation"), tfnext,
// 		function(error,data) {
// 			if (error) {
// 				console.log(error);
// 			}
// 			else {

// 				if (Session.get("unit") == "m"){
// 					if (Math.floor(data) < 2){
// 						tfnext = true;
// 					}
// 				} else {
// 					if ((Math.floor(data) / 3.28) < 2){
// 						tfnext = true;
// 					}
// 				}
// 			}
// 		});
// 	return tfnext;
// 	// Session.set("tfnext", tfnext);
// }

var currentStep = 0
function getNextStep() {
	steps = Session.get("route_points")
	if(currentStep < steps.length) {
		currentLocation = Session.get("currentLocation")
		firstStepPoint_1 = steps[currentStep]
		firstStepPoint_2 = steps[currentStep+1]
		distance = Math.abs((firstStepPoint_2.x - firstStepPoint_1.x)*(firstStepPoint_1.y- currentLocation.y)) - ((firstStepPoint_1.x - currentLocation.x) * (firstStepPoint_2.y - firstStepPoint_1.y))
		return distance;
	}
} 



function getStepDescription(route) {
	var r = [];
		
	if (route != null && route != undefined && route.length != 1) {
		var getToPath = "";
		
		//console.log(route);
		//if there's a getTo
		if (count == 0 && Intersections.findOne({"id":route[count]}).getTo != undefined) {
			getToPath += Intersections.findOne({"id":route[count]}).getTo;
		}
		
		var thePath = Paths.findOne({"start":route[count],"end":route[count+1]});
		r.push(getToPath + " " + thePath.description);
	
		
	} else if (route.length == 1){
		r.push("You have reached your destination!");
	} else {
		r.push("We don't seem to be able to find the routing data!");
	}
	
	Session.set("step",r);
	Session.set("listenTo",r);
}

