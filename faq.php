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
					document.getElementById("footer").getElementsByTagName("td").item(3).getElementsByTagName("a").item(0).style.width = "93%";
				}
			});
		</script>
        <title>Crowded Zones - FAQ</title>
    </head>
    <body>
		<div id="container">
		<div id="intro" class="intro">
			<?php if(strpos($_SERVER['HTTP_ACCEPT_LANGUAGE'],"it") === 0) { ?>
			<h1>A cosa serve?</h1>
			<p>A sapere quante persone ci sono in un posto, quante ce ne sono state in passato, e se hai condiviso spazi con persone contagiate.</p>
			<h1>Come fa a saperlo?</h1>
			<p>Sono le persone ad indicare dove si trovano, o dove stanno per andare. Non usa il GPS.</p>
			<h1>Ma se dico dove sono, lo sanno tutti lo stesso!</h1>
			<p>Sei identificato attraverso un numero. Gli altri utenti neppure lo vedono. L'amministratore s&igrave;, ma &egrave; un numero.</p>
			<h1>Ma quando sono a casa...</h1>
			<p>Beh, puoi sempre parcheggiare il tuo omino in mezzo al mare, o in mezzo a una foresta. Non sto scherzando.</p>
			<h1>Ma se segui i miei spostamenti...</h1>
			<p>La storia degli spostamenti del singolo individuo non viene memorizzata. Viene memorizzato il numero delle persone.</p>
			<h1>Come indico dove mi trovo?</h1>
			<p>Apri la <a href="index.php" title="Now">mappa principale <i class="fas fa-home"></i></a>, premi o clicca sul luogo dove ti trovi (o dove stai andando), e scegli il nome dalla lista.</p>	
			<h1>Perch&eacute; non lo trova? Eppure ho premuto proprio nel mezzo!</h1>
			<p>Prova sul bordo, vedrai che lo trova.</p>
			<h1>Cosa succede se dimentico il mio omino in un posto?</h1>
			<p>Dopo un giorno che &egrave; l&igrave; sbianca, e non viene pi&ugrave; contato.</p>
			<h1>Come vedo quante persone ci sono in un posto in questo momento?</h1>
			<p>Clicca o premi sulla <a href="index.php" title="Now">mappa principale <i class="fas fa-home"></i></a>, apparirà una lista dei luoghi nelle vicinanze, ognuno con il numero di persone.</p>
			<h1>Posso sapere quante persone erano in un posto ieri?</h1>
			<p>S&igrave;, vai sulla <a href="trend.php" title="Trend">mappa dei trend <i class="fas fa-chart-line"></i></a>, e clicca o premi sul posto che ti interessa.</p>
			<h1>Come so se sono stato a contatto con persone contagiate?</h1>
			<p>Sulla <a href="index.php" title="Now">mappa principale <i class="fas fa-home"></i></a> appare una barra con scritto COVID-19. Premendola vedi giorno e orario. Premendo ancora vedi il luogo.</p>
			<h1>Come fa a saperlo?</h1>
			<p>Il sistema registra i contatti tra persone (numeri), con luogo e orario. Se un'autorit&agrave; immette i codici numerici degli infetti, il sistema fa le sue deduzioni.</p>
			<h1>Qual'&egrave; il mio codice?</h1>
			<p>Guarda in alto a sinistra nella <a href="index.php" title="Now">mappa principale <i class="fas fa-home"></i></a>. &Egrave; scritto in verticale.</p>
			<h1>Che app leggera! Ma cosa fa?</h1>
			<p>Apre la <a href="index.php" title="Now">mappa principale <i class="fas fa-home"></i></a> nel browser, evitando di aprire altri tab se &egrave; gi&agrave; aperta in uno. Tutto qui.</p>
			<h1>OK ma se volessi sapere...</h1>
			<p>Unisciti al <a href="https://t.me/crowdedapp" title="Crowded Telegram">canale Telegram</a>. C'&egrave; anche un gruppo di discussione.</p>
			<h1>Ma io non ho Telegram!</h1>
			<p>Male. Molto male. Va bene via, puoi scrivere a <a href="mailto:mirco.soderi@gmail.com" title="Mirco Soderi">questa</a> e-mail.</p>
			<?php } else { ?>
			<script>document.write(t(`<h1>What purpose does it serve?</h1>
			<p>To know how many people are in one place at now, how many have been there in the past, and if you have shared spaces with infected people.</p>
			<h1>How does it know?</h1>
			<p>They are the people who indicate where they are, or where they are going. It does not use GPS.</p>
			<h1>But if I say where I am, everyone knows it all the same.</h1>
			<p>You are identified by a number. Users don't see it. The admin yes, but it's a number.</p>
			<h1>But when I'm home ...</h1>
			<p>Well, you can always park your marker in the middle of the sea, or in the middle of a forest. I'm not kidding.</p>
			<h1>But if you follow my movements...</h1>
			<p>The history of your movements is not stored. The history of the amount of people per place is stored instead.</p>
			<h1>How do I indicate where I am?</h1>
			<p>Tap or click the main map <a href="index.php" title="Now"><i class="fas fa-home"></i></a> on the place where you are, or where you are going, and pick the place from the list.</p>	
			<h1>Why can't it find it? Yet I pressed right in the middle!</h1>
			<p>Here it is, try on the edge.</p>
			<h1>What if I forget my marker in a place?</h1>
			<p>After a day that it is still, it bleaches, and it is no longer counted.</p>
			<h1>How do I see how many people are in one place?</h1>
			<p>Clicking on the <a href="index.php" title="Now">main map<i class="fas fa-home"></i></a>, a list of places in the surrounding area appears, each with the number of people.</p>
			<h1>Can I know how many people were in a place yesterday?</h1>
			<p>In the <a href="trend.php" title="Trend">map of trends <i class="fas fa-chart-line"></i></a>, click or tap on the place, and pick it from the list. An interactive diagram will display.</p>
			<h1>How do I know if I have been in contact with infected people?</h1>
			<p>A bar appears in the <a href="index.php" title="Now">main map <i class="fas fa-home"></i></a> with COVID-19 written. Push on it to see day and time. Push again to see where.</p>
			<h1>How does it know?</h1>
			<p>The system records contacts between people (numbers), with place and time. If an authority enters the numeric codes of infected people, the system makes its deductions.</p>
			<h1>What is my code?</h1>
			<p>Look at the top left of the <a href="index.php" title="Now">main map <i class="fas fa-home"></i></a>. It is written vertically.</p>
			<h1>What a light app! What does it do?</h1>
			<p>It simply opens the <a href="index.php" title="Now">main map<i class="fas fa-home"></i></a> in your browser, avoiding to open new tabs if the map is already loaded in one of them. Nothing more.</p>
			<h1>Okay, but if I wanted to know...</h1>
			<p>Join the <a href="https://t.me/crowdedapp" title="Crowded Telegram">Telegram channel</a>, and its related discussion group.</p>
			<h1>But I don't have Telegram!</h1>
			<p>What a bad thing. Okay away, you can write to <a href="mailto:mirco.soderi@gmail.com" title="Mirco Soderi">this</a> e-mail.</p>`));</script>
			<?php } ?>
		</div>
		<div id="footer"><table><tr>
			<td><a href="index.php" title="Now"><i class="fas fa-home"></i></a></td>
			<td><a href="trend.php" title="Trend"><i class="fas fa-chart-line"></i></a></td>			
			<td><a href="https://play.google.com/store/apps/details?id=zone.crowded.crowded" title="App"><i class="fab fa-google-play"></i></a></td>
			<td style="background-color:white; color:black; padding-left:0px; padding-right:0px;"><a style="background-color:white; color:black; border: thick solid black; width:96.5%;" href="faq.php" title="FAQ"><i class="fas fa-question-circle"></i></a></td>		
			<td><a href="credits.php" title="Credits"><i class="fas fa-user-friends"></i></a></td>
		</tr></table></div>
		</div>
    </body>
</html>