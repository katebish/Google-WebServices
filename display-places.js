var currentLat = null;
var currentLng = null;
var currentSun = null;
var towns_list = new Array();
var town_name_list = new Array();
var countListTowns = 0;

function Town(name, lat, lng, sun) {
        this.name = name;
        this.lat = lat;
		this.lng = lng;
		this.sun = sun;
}

function submit_town(){
    var town = document.getElementById("town-name").value;
    //Has town already been searched
    var isIn = false;
    for(var i = 0; i < towns_list.length; i++){
        if(town == towns_list[i].name){
			//if town has already been searched, extract info from the object and pass to display town on mpa function
            isIn = true;
			displayTown(towns_list[i].lat, towns_list[i].lng, towns_list[i].sun,8)
			deletePlaces();
            break;
        }
    }
    //If new town then check if valid
    if(isIn == false){
		var geocoder = new google.maps.Geocoder();
		var geocode_request = {
			address : town,
			region: 'NZ'
		}
		geocoder.geocode(geocode_request, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				location_latlng = results[0].geometry.location;
				currentLat = location_latlng.lat();
				currentLng = location_latlng.lng();
	
				//get sunrise and sunset data
				$.ajax("getData.php", {
					method: 'GET',
					data: {lat:currentLat,lng:currentLng},
					success: function(data){
						var myObj = JSON.parse(data);
						
						var sunrise = myObj.results.sunrise.slice(0,-2);
						var sunset = myObj.results.sunset.slice(0,-2);
						currentSun = "Sunrise: "+sunrise+" AM, "+"Sunset: "+sunset+" PM";
						
						//Add town to list of serached towns to be clicked
						TownListItem(town);
		
						//Store town to array of towns
						towns_list[countListTowns] = new Town(town, currentLat, currentLng, currentSun);
						countListTowns ++;
					
						//delete the places and display the town on the map
						deletePlaces();
						displayTown(currentLat, currentLng, currentSun,8);
						
					},
				});
				
			}
			else {
				alert("Not a valid location (please try again)");
			}
		});
		
    }
}

function deletePlaces(){
	var place_section = document.getElementById("place-monitor");
	place_section.innerHTML = "";
}



function displayTown(lat, lng, sun, zoom){
	//Create map				
	var map;
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: lat, lng: lng},
		zoom: zoom
	});
	if(zoom == 15){
		var marker = new google.maps.Marker({
          position: {lat: lat, lng: lng},
          map: map
        });
	}
	//Create sunrise and sunset
	var rise_set_div = document.getElementById("rise-set");
	rise_set_div.innerHTML = sun;

}

function searchPlaces(place){
	//get a list of places
	$.ajax("getDataPlaces.php", {
		method: 'GET',
		data: {lat:currentLat,lng:currentLng,placeType:place},
		success: function(data){
			var myObj = JSON.parse(data);
			var res = myObj.results;
			for(var i = 0; i < res.length; i++){
				var place_details = res[i].name + ", " + res[i].vicinity;
				var lat = res[i].geometry.location.lat;
				var lng = res[i].geometry.location.lng;
				//add each place and link to the UI
				PlaceListItem(place_details, lat, lng);
			}
							
		},
	});

}

//create a link and list item for each place
function PlaceListItem(place_details, lat, lng){
    var _ui = {
        list_of_places: null
    };
	var place_section = document.getElementById("place-monitor");
	_ui.list_of_places = document.createElement("ul");
	_ui.list_of_places.id = "places-list";
	place_section.appendChild(_ui.list_of_places);
	
	_ui.list_of_places.list_item = document.createElement("li");
	_ui.list_of_places.list_item_link = document.createElement("button");
	_ui.list_of_places.list_item_link.setAttribute("value",place_details);
	_ui.list_of_places.list_item_link.onclick = function(){
			displayTown(lat, lng, currentSun,15);
		}
    _ui.list_of_places.appendChild(_ui.list_of_places.list_item);
	_ui.list_of_places.list_item.appendChild(_ui.list_of_places.list_item_link);
    _ui.list_of_places.list_item_link.appendChild(document.createTextNode(place_details));
    
}

//Creates a new LI for a searched town
function TownListItem(town){
    var _ui = {
        list_of_towns: null
    };
	if(countListTowns == 0){
		var viewed_section = document.getElementById("viewed-monitor");
		viewed_section.appendChild(document.createTextNode("Towns Viewed:"));
		_ui.list_of_towns = document.createElement("ul");
		_ui.list_of_towns.id = "towns-list";
		viewed_section.appendChild(_ui.list_of_towns);
		createPlaceSearch();
	}
	_ui.list_of_towns = document.getElementById("towns-list");
	_ui.list_of_towns.list_item = document.createElement("li");
	_ui.list_of_towns.list_item_link = document.createElement("button");
	_ui.list_of_towns.list_item_link.setAttribute("value",town);
	_ui.list_of_towns.list_item_link.onclick = function(){
		for(var i = 0; i < towns_list.length; i++){
			if(this.value == towns_list[i].name){
				deletePlaces();
				displayTown(towns_list[i].lat,towns_list[i].lng,towns_list[i].sun,8);
				break;
			}
		}
	}
    _ui.list_of_towns.appendChild(_ui.list_of_towns.list_item);
	_ui.list_of_towns.list_item.appendChild(_ui.list_of_towns.list_item_link);
    _ui.list_of_towns.list_item_link.appendChild(document.createTextNode(town));
    
}

//once hte map is loaded creates the place search field
function createPlaceSearch(){
	var place_search = document.getElementById("place-search");
	
	var place_search_p = document.createElement("p");
	place_search_p.appendChild(document.createTextNode("Select a place of interest"));
	place_search.appendChild(place_search_p);
	
	var search_field = document.createElement("input");
	search_field.setAttribute("type","text");
	search_field.id = "place-name";
	place_search.appendChild(search_field);
	
	var search_submit = document.createElement("input");
	search_submit.setAttribute("type","button");
	search_submit.setAttribute("value","submit");
	search_submit.onclick = function(){
		var place = document.getElementById("place-name");
		searchPlaces(place.value);
	}
	place_search.appendChild(search_submit);

}

