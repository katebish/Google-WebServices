<?php
    $lat = $_GET["lat"];
    $lng = $_GET["lng"];
	$placeType = $_GET["placeType"];
	
	//Define the URL
    $BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/";
	$request = 'json?location='.$lat.','.$lng.'&radius=5000&type='.$placeType.'&key=AIzaSyD9SmLHJtVlkzomv2aAxa9Nvb3lmTSQfEw';
	$call = $BASE_URL . $request;
	
    //initialise the connection for the given URL
    $connection = curl_init($call);

    //configure the connection
    curl_setopt($connection, CURLOPT_RETURNTRANSFER, true);
	
    //make the request and get the response
    $response = curl_exec($connection);

    //close the connection
    curl_close($connection);

    //return the response
	
    echo $response;
	
	
	
?>

