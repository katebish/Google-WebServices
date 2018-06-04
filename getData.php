<?php
    $lat = $_GET["lat"];
    $lng = $_GET["lng"];
	
	//Define the URL

    $BASE_URL = "https://api.sunrise-sunset.org/";
	
	$request = 'json?lat='.$lat.'&lng='.$lng;
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

