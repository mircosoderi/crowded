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
		<script>
			function t(txt) {
				try {
					var thttp = new XMLHttpRequest();									
					thttp.open("GET", "translate/index.php?t="+encodeURIComponent(txt)+"&k=<?=$hashed?>", false);		
					thttp.send();
					if(thttp.status == 200) {
						return thttp.responseText;
					}
					else {
						return txt;
					}
				}
				catch(e) {
					return txt;
				}
			}
			window.mobileAndTabletcheck = function() {
			  var check = false;
			  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			  return check;
			};
			document.addEventListener("DOMContentLoaded", function(){
			  	if(window.mobileAndTabletcheck()) {
					document.getElementById("footer").getElementsByTagName("td").item(4).getElementsByTagName("a").item(0).style.width = "93%";
				}
			});
		</script>
        <title>Crowded Zones - Credits</title>
    </head>
    <body>
		<div id="container">
		<div id="intro" class="intro">
			<?php if(strpos($_SERVER['HTTP_ACCEPT_LANGUAGE'],"it-IT")  === 0) { ?>
			<h1>Mirco Soderi</h1>
			<p>L'idea, il progetto, lo sviluppo, la promozione ed il finanziamento di questo progetto sono a cura di <a href="https://www.linkedin.com/in/mirco-soderi-3b470525/" title="Mirco Soderi">Mirco Soderi</a>.</p>
			<h1>Open Street Map</h1>
			<p>crowded.zone utilizza le mappe di <a href="https://www.openstreetmap.org/" title="Open Street Map">Open Street Map</a>, sia per quanto riguarda la grafica, che per quanto riguarda i dati.</p>
			<h1>Kumi Systems</h1>
			<p>La ricerca dei luoghi nelle vicinanze di un punto &egrave; eseguita da <a href="https://www.kumi.systems/" title="Kumi Systems">Kumi Systems</a> attraverso la <a href="https://overpass.kumi.systems/" title="Kumi Systems Overpass API">Overpass API</a>.</p>
			<h1>Anil</h1>
			<p>Il segnaposto che indica la tua ultima posizione registrata &egrave; la <a href="https://thenounproject.com/term/you-are-here/1208725/" title="street view by Anil from the Noun Project">street view icon prodotta da Anil per il Noun Project</a>.</p>
			<h1>D&aacute;vid Gladi&scaron;, SK</h1>
			<p>La nuvoletta nell'icona del gruppo di discussione Telegram &egrave; la <a href="https://thenounproject.com/search/?q=chat&i=742168" title="chat by D&aacute;vid Gladi&scaron;, SK  from the Noun Project">chat icon prodotta da D&aacute;vid Gladi&scaron;, SK  per il Noun Project</a>.</p>
			<h1>Apache Cordova</h1>
			<p>crowded.zone &egrave; nato come progetto <a href="https://cordova.apache.org/" title="Apache Cordova">Cordova</a>, per poi divenire un'applicazione Web, pi&ugrave; comoda da aprire utilizzando l'app.</p> 
			<?php } else { ?>
			<script>document.write(t(`<h1>Mirco Soderi</h1>
			<p>The idea, design, development, promotion, and funding of this project are by <a href="https://www.linkedin.com/in/mirco-soderi-3b470525/" title="Mirco Soderi">Mirco Soderi</a>.</p>
			<h1>Open Street Map</h1>
			<p>All maps used in crowded.zone, including tiles and features, are from <a href="https://www.openstreetmap.org/" title="Open Street Map">Open Street Map</a>.</p>
			<h1>Kumi Systems</h1>
			<p>The search of places around a point is by <a href="https://www.kumi.systems/" title="Kumi Systems">Kumi Systems</a> through their <a href="https://overpass.kumi.systems/" title="Kumi Systems Overpass API">Overpass API</a>.</p>
			<h1>Anil</h1>
			<p>The marker of your last registered position is the <a href="https://thenounproject.com/term/you-are-here/1208725/" title="street view by Anil from the Noun Project">street view icon by Anil from the Noun Project</a>.</p>
			<h1>D&aacute;vid Gladi&scaron;, SK</h1>
			<p>The cloud in the icon of the Telegram group is the <a href="https://thenounproject.com/search/?q=chat&i=742168" title="chat by D&aacute;vid Gladi&scaron;, SK  from the Noun Project">chat by D&aacute;vid Gladi&scaron;, SK  from the Noun Project</a>.</p>
			<h1>Apache Cordova</h1>
			<p>crowded.zone started as a <a href="https://cordova.apache.org/" title="Apache Cordova">Cordova</a> project, but it now is a Web app, with an Android app that opens it.</p>`)); </script>
			<?php } ?>
		</div>
		<div id="footer"><table><tr>
			<td><a href="index.php" title="Now"><i class="fas fa-home"></i></a></td>
			<td><a href="trend.php" title="Trend"><i class="fas fa-chart-line"></i></a></td>			
			<td><a href="https://play.google.com/store/apps/details?id=zone.crowded.crowded" title="App"><i class="fab fa-google-play"></i></a></td>
			<td><a href="faq.php" title="FAQ"><i class="fas fa-question-circle"></i></a></td>		
			<td style="background-color:white; color:black; padding-left:0px; padding-right:0px;"><a style="background-color:white; color:black; border: thick solid black; width:96.5%;" href="credits.php" title="Credits"><i class="fas fa-user-friends"></i></a></td>
			</tr>
		</table></div>
		</div>
    </body>
</html>