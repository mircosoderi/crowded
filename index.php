<?php 
session_start();
$pvtapi = json_decode(file_get_contents("pvt/api.json"),true);
$hashed='';
$_SESSION['token'] = microtime(); 
if (defined("CRYPT_BLOWFISH") && CRYPT_BLOWFISH) {
    $salt = $pvtapi["salt"] . substr(md5(uniqid(mt_rand(), true)), 0, 22);
    $hashed = crypt($_SESSION['token'], $salt);
}
?>
<!DOCTYPE html>
<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
	
	*************************************************************
	*************************************************************
	This page is the result of a heavy rework that Mirco Soderi
	(see https://www.linkedin.com/in/mirco-soderi-3b470525/, 
	contact at mirco.soderi@gmail.com) has operated for the 
	purposes of the Crowded Zone project, moving from the sample 	
	index.html produced while getting started with Cordova, 
	(see https://cordova.apache.org/#getstarted). 
	*************************************************************
	*************************************************************
-->
<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: 'unsafe-eval'; style-src 'self' https://cdn.jsdelivr.net http://openlayers.org http://www.openlayers.org https://kit-free.fontawesome.com 'unsafe-inline'; media-src *; img-src 'self' http://*.tile.openstreetmap.org http://www.openlayers.org http://openlayers.org https://upload.wikimedia.org; script-src 'self' http://openlayers.org http://www.openlayers.org https://cdn.jsdelivr.net https://cdn.polyfill.io https://kit.fontawesome.com 'unsafe-inline' 'unsafe-eval'; connect-src http://www.crowded.zone https://raw.githubusercontent.com https://nominatim.openstreetmap.org https://overpass.kumi.systems ; font-src https://kit-free.fontawesome.com">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.2.1/css/ol.css" type="text/css">
        <link rel="stylesheet" type="text/css" href="css/index.css">		
		<script type="text/javascript" src="cordova.js"></script>
		<script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.2.1/build/ol.js"></script>
		<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList"></script>		
		<script src="https://kit.fontawesome.com/b2f09ac62b.js" crossorigin="anonymous"></script>		
		<script>tat = '<?=$hashed?>';</script>
		<script type="text/javascript" src="js/index.js"></script>
        <title>Crowded Zones</title>
    </head>
    <body>
		<div id="container">
			<div id="map" class="map"></div>
			<div id="footer"><table><tr>
				<td style="background-color:white; color:black; padding-left:0px; padding-right:0px;"><a style="background-color:white; color:black; border: thick solid black; width:96.5%;" href="index.php" title="Now"><i class="fas fa-home"></i></a></td>
				<td><a href="trend.php" title="Trend"><i class="fas fa-chart-line"></i></a></td>			
				<td><a href="https://play.google.com/store/apps/details?id=zone.crowded.crowded" title="App"><i class="fab fa-google-play"></i></a></td>
				<td><a href="faq.php" title="FAQ"><i class="fas fa-question-circle"></i></a></td>		
				<td><a href="credits.php" title="Credits"><i class="fas fa-user-friends"></i></a></td>
			</tr></table></div>
		</div>		
    </body>
</html>