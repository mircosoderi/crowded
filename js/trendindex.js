/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *	
 * *************************************************************
 * *************************************************************
 * This page is the result of a heavy rework that Mirco Soderi
 * (see https://www.linkedin.com/in/mirco-soderi-3b470525/, 
 * contact at mirco.soderi@gmail.com) has operated for the 
 * purposes of the Crowded Zone project, moving from the sample 	
 * index.js produced while getting started with Cordova, 
 * (see https://cordova.apache.org/#getstarted). 
 * *************************************************************
 * *************************************************************
 */
 
var app = {
    initialize: function() {
		popup = null;
		lbl = null;
		currl = [];
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {			
		if(window.mobileAndTabletcheck()) {
			document.getElementById("footer").getElementsByTagName("td").item(0).getElementsByTagName("a").item(0).style.width = "93%";
		}
		var myTile = new ol.layer.Tile(
			{ 
				source: new ol.source.OSM({
					crossOrigin: null
				}) 
			}
		);
		var currSelVect = new ol.source.Vector();
		var currSelImage = new ol.style.Circle({
			radius: 5,
			stroke: new ol.style.Stroke({
			  color: 'black',
			  width: 2
			})
		});
		var currSelLayer = new ol.layer.Vector({
			source: currSelVect,
			style: new ol.style.Style({
				image: currSelImage
			})
		});
		var mapCenter = ol.proj.transform( [1224277,5423872], 'EPSG:3857', 'EPSG:4326');
		var url = new URL(location.href);
		var x = url.searchParams.get("x");
		var z = url.searchParams.get("z");
		if(x) mapCenter = ol.proj.transform( x.split(","), 'EPSG:3857', 'EPSG:4326');
		var zoom = 12;
		if(z) zoom = z;
		var myView = new ol.View(
			{  
				center: ol.proj.fromLonLat(mapCenter), 
				zoom: zoom
			}
		);		
		var map = new ol.Map ( 
			{
				target: "map",
				layers: [ myTile, currSelLayer ],
				view: myView
			} 
		);
		map.on('click', function(evt){
			if(popup) {
				popup.style.display="none";
				if(currSelVect) currSelVect.clear();
				if(currl) cleanCurrl();				
			}
			document.getElementById("map").style.opacity="0.5";
			var coords = ol.proj.transform(evt.coordinate,'EPSG:3857','EPSG:4326');				
			var xhttp = new XMLHttpRequest();						
			var bbox = (parseFloat(coords[1])-0.00005)+","+(parseFloat(coords[0])-0.00005)+","+(parseFloat(coords[1])+0.00005)+","+(parseFloat(coords[0])+0.00005);		
			var bigBbox = (parseFloat(coords[1])-0.0005)+","+(parseFloat(coords[0])-0.0005)+","+(parseFloat(coords[1])+0.0005)+","+(parseFloat(coords[0])+0.0005);		
			xhttp.open("GET", "https://overpass.kumi.systems/api/interpreter?data=[timeout:10];(node("+bbox+")[\"addr:housenumber\"];node("+bbox+")[\"power\"];way("+bbox+")[\"power\"];node("+bbox+")[\"natural\"];node("+bbox+")[\"amenity\"];node("+bbox+")[\"place\"];node("+bbox+")[\"shop\"];node("+bbox+")[\"public_transport\"];node("+bbox+")[\"railway\"];way("+bbox+")[\"railway\"];node("+bbox+")[\"tourism\"];way("+bbox+")[\"tourism\"];node("+bbox+")[\"man_made\"];way("+bbox+")[\"landuse\"];relation("+bbox+")[\"landuse\"];way("+bbox+")[\"natural\"];relation("+bbox+")[\"natural\"];way("+bbox+")[\"building\"];relation("+bbox+")[\"building\"];way("+bbox+")[\"amenity\"];node("+bbox+")[\"leisure\"];way("+bbox+")[\"leisure\"];relation("+bbox+")[\"leisure\"];way("+bbox+")[\"highway\"];node("+bbox+")[\"highway\"];way("+bbox+")[\"waterway\"];way("+bbox+")[\"aeroway\"];way("+bbox+")[\"bridge\"];way("+bbox+")[\"bicycle\"];way("+bigBbox+")[\"leisure\"=\"beach_resort\"];);(._;>;);out;", true);												
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var xmlp = new DOMParser();
					var xmlDoc = xmlp.parseFromString(this.responseText,"text/xml");
					var elements = xmlDoc.documentElement.children;
					var ids = [];
					if(popup) {
						try { document.body.removeChild(popup); } catch(e){}
						popup = null;
						if(currSelVect) currSelVect.clear();
						if(currl) cleanCurrl();
					}					
					popup = document.createElement("div");
					popup.style.maxHeight="300px";
					popup.style.overflow="scroll";
					Array.prototype.forEach.call(elements, function(item) {
						var description = null;
						if(item.getElementsByTagName("tag").length > 0) {
							description = buildDescription(item.getElementsByTagName("tag"));
						}			
						if(description) {
							ids.push(item.nodeName+"-"+item.getAttribute("id"));							
							var p = document.createElement("p");
							p.id=item.nodeName+"-"+item.getAttribute("id");
							p.className="element";
							var s1 = document.createElement("span");
							var s2 = document.createElement("span");
							s1.style.paddingRight = "8px";							
							s2.style.float = "right";
							s2.style.borderLeft = "thin solid black";
							s2.style.paddingLeft = "8px";
							p.appendChild(s1); p.appendChild(s2);
							s1.innerHTML = description;
							s2.innerHTML = "0";							
							var mobile = false;
							if(!window.mobileAndTabletcheck()) {
								p.onmouseover = function() {
									currSelVect.clear();
									if(item.nodeName == "node") {									
										var currSelCoord = ol.proj.transform( [parseFloat(item.getAttribute("lon")),parseFloat(item.getAttribute("lat"))], 'EPSG:4326','EPSG:3857');
										currSelVect.addFeature(new ol.Feature({
											geometry: new ol.geom.Point(currSelCoord)
										}));
									}
									else if(item.nodeName == "way") {
										var nds = item.getElementsByTagName("nd");
										for(let nd of nds) {
											var currSelCoord = ol.proj.transform( [parseFloat(xmlDoc.getElementById(nd.getAttribute("ref")).getAttribute("lon")),parseFloat(xmlDoc.getElementById(nd.getAttribute("ref")).getAttribute("lat"))], 'EPSG:4326','EPSG:3857');											
											currSelVect.addFeature(new ol.Feature({
												geometry: new ol.geom.Point(currSelCoord)
											}));
										}
									}
									else if(item.nodeName == "relation") {
										var ways = item.querySelectorAll('member[type="way"][role="outer"]');
										for(let way of ways) {
											var nds = xmlDoc.getElementById(way.getAttribute("ref")).getElementsByTagName("nd");
											for(let nd of nds) {
												var currSelCoord = ol.proj.transform( [parseFloat(xmlDoc.getElementById(nd.getAttribute("ref")).getAttribute("lon")),parseFloat(xmlDoc.getElementById(nd.getAttribute("ref")).getAttribute("lat"))], 'EPSG:4326','EPSG:3857');												
												currSelVect.addFeature(new ol.Feature({
													geometry: new ol.geom.Point(currSelCoord)
												}));
											}
										}
									}
								};	
								p.onmouseout = function() {							
									if(currSelVect) currSelVect.clear();
								}
							}
							else {
								var color = getRandomColor();
								p.style.border = "thick solid "+color;
								p.style.backgroundImage = "linear-gradient("+color+", white, "+color+")";
								var currVect = new ol.source.Vector();
								var currImage = new ol.style.Circle({
									radius: 10,
									stroke: new ol.style.Stroke({
									  color: color,
									  width: 2
									})
								});
								var currLayer = new ol.layer.Vector({
									source: currVect,
									style: new ol.style.Style({
										image: currImage
									})
								});
								currl.push(currLayer);
								map.addLayer(currLayer);								
								if(item.nodeName == "node") {									
									var currSelCoord = ol.proj.transform( [parseFloat(item.getAttribute("lon")),parseFloat(item.getAttribute("lat"))], 'EPSG:4326','EPSG:3857');
									currVect.addFeature(new ol.Feature({
										geometry: new ol.geom.Point(currSelCoord)
									}));
								}
								else if(item.nodeName == "way") {
									var nds = item.getElementsByTagName("nd");
									for(let nd of nds) {
										var currSelCoord = ol.proj.transform( [parseFloat(xmlDoc.getElementById(nd.getAttribute("ref")).getAttribute("lon")),parseFloat(xmlDoc.getElementById(nd.getAttribute("ref")).getAttribute("lat"))], 'EPSG:4326','EPSG:3857');
										currVect.addFeature(new ol.Feature({
											geometry: new ol.geom.Point(currSelCoord)
										}));
									}
								}
								else if(item.nodeName == "relation") {
									var ways = item.querySelectorAll('member[type="way"][role="outer"]');
									for(let way of ways) {
										var nds = xmlDoc.getElementById(way.getAttribute("ref")).getElementsByTagName("nd");
										for(let nd of nds) {
											var currSelCoord = ol.proj.transform( [parseFloat(xmlDoc.getElementById(nd.getAttribute("ref")).getAttribute("lon")),parseFloat(xmlDoc.getElementById(nd.getAttribute("ref")).getAttribute("lat"))], 'EPSG:4326','EPSG:3857');
											currVect.addFeature(new ol.Feature({
												geometry: new ol.geom.Point(currSelCoord)
											}));
										}
									}
								}
							}
							p.onclick=function(){ 							
								document.getElementById("map").style.opacity = "0.5";
								if(popup) {
									popup.style.display="none";
									if(currSelVect) currSelVect.clear();
									if(currl) cleanCurrl();
								}
								if(p.id) {
									var yhttp = new XMLHttpRequest();
									yhttp.open("GET", "trendapi.php?id="+p.id+"&k="+tat, true);
									yhttp.onreadystatechange = function() {
										if (this.readyState == 4 && this.status == 200) {
											var h = document.getElementById("map").offsetHeight;
											var w = document.getElementById("map").offsetWidth;
											document.getElementById("map").style.display = "none";
											document.getElementById("canvas").style.height = h+"px";
											document.getElementById("canvas").style.width = w+"px";
											document.getElementById("canvas").style.display = "inline";
											var color = Chart.helpers.color;
											var config = {
												type: 'line',
												data: {
													datasets: [{
														label: p.getElementsByTagName("span").item(0).innerHTML,
														backgroundColor: p.style.borderColor,
														borderColor: p.style.borderColor,
														fill: true,
														data: JSON.parse(yhttp.responseText),
													}]
												},
												options: {
													responsive: true,
													title: {
														display: false,
														text: ''
													},
													scales: {
														xAxes: [{
															type: 'time',
															display: true,
															scaleLabel: {
																display: true,
																labelString: 'Date'
															},
															ticks: {
																major: {
																	fontStyle: 'bold',
																	fontColor: p.style.borderColor
																}
															}
														}],
														yAxes: [{
															display: true,
															scaleLabel: {
																display: true,
																labelString: t('People')
															}
														}]
													},													
													plugins: {
														zoom: {															
															pan: {																
																enabled: true,
																mode: 'x',

																rangeMin: {
																	x: null,
																	y: null
																},
																rangeMax: {
																	x: null,
																	y: null
																},
																speed: 20,
																threshold: 10,
															},
															zoom: {
																enabled: true,
																drag: false,
																mode: 'x',
																rangeMin: {
																	x: null,
																	y: null
																},
																rangeMax: {
																	x: null,
																	y: null
																},
																speed: 0.1,
																sensitivity: 3,
															}
														}
													}
												}												
											};
											var ctx = document.getElementById('canvas').getContext('2d');
											window.myLine = new Chart(ctx, config);		
											var closediv = document.createElement("div");
											closediv.className="closeChart";
											closediv.style.left=(w-33)+"px";
											closediv.style.color = p.style.borderColor;
											closediv.innerHTML = "<i class=\"fas fa-window-close\"></i>";	
											closediv.onclick=function(){
												location.href="trend.php?x="+map.getView().getCenter()+"&z="+map.getView().getZoom();
											};
											document.getElementById("container").appendChild(closediv);
										}
										if (this.readyState == 4 && this.status != 200) { 
											document.body.style.backgroundColor="red";
											setTimeout(function(){location.reload();},1000);
										}
									};											
									yhttp.send();								
								}								
							};
							popup.appendChild(p);
						}
					});	
					if(popup.childNodes.length > 0) {												
						var chttp = new XMLHttpRequest();						
						chttp.open("GET", "api.php?ids="+ids.join()+"&k="+tat, true);
						chttp.onreadystatechange = function() {
							if (this.readyState == 4 && this.status == 200) {								
								popup.style.position="absolute";
								popup.style.top = (evt.pixel[1]+parseInt(parseFloat(window.innerHeight)*0.15) )+"px";
								popup.style.left = ( evt.pixel[0]+parseInt(parseFloat(window.innerWidth)*0.15) ) +"px";
								popup.style.zIndex = "100";
								popup.style.border="thin solid black";
								var missp = document.createElement("p"); 
								missp.className="missing";
								missp.innerHTML = t("Missing place? Hit on the edge!");
								missp.style.color="gray";
								missp.style.textAlign="center";
								missp.style.backgroundColor="white";
								missp.style.cursor="pointer";
								missp.onclick=function(){
									if(popup){
										popup.style.display="none";
										if(currSelVect) currSelVect.clear();
										if(currl) cleanCurrl();
									}
								};
								popup.appendChild(missp);
								document.body.appendChild(popup);
								var j = JSON.parse(this.responseText);								
								j.counts.forEach(function(o){
									document.getElementById(o.id).childNodes[1].innerHTML = o.count;	
									document.getElementById(o.id).childNodes[1].style.width = (8*j.max.length)+"px";
								});
								document.getElementById("map").style.opacity = "1";									
							}
							if (this.readyState == 4 && this.status != 200) { 
								document.body.style.backgroundColor="red";
								setTimeout(function(){location.reload();},1000);
							}
						};
						chttp.send();
					}
					else { 					
						var nothing = document.createElement("p");
						nothing.className="missing";
						nothing.innerHTML=t("In the middle of nowhere!");
						var color = "black";
						nothing.style.border = "thick solid "+color;
						nothing.style.backgroundImage = "linear-gradient("+color+", white, "+color+")";
						nothing.style.cursor = "pointer";
						nothing.onclick=function(){
							if(popup){
								popup.style.display="none";
							}
						};
						popup.appendChild(nothing);
						var missp = document.createElement("p"); 
						missp.className="missing";
						missp.innerHTML = t("Missing place? Hit on the edge!");
						missp.style.color="gray";
						missp.style.textAlign="center";
						missp.style.backgroundColor="white";
						missp.style.cursor="pointer";
						missp.onclick=function(){
							if(popup){
								popup.style.display="none";
								if(currSelVect) currSelVect.clear();
								if(currl) cleanCurrl();
							}
						};
						popup.style.position="absolute";
						popup.style.top = (evt.pixel[1]+parseInt(parseFloat(window.innerHeight)*0.15) )+"px";
						popup.style.left = ( evt.pixel[0]+parseInt(parseFloat(window.innerWidth)*0.15) ) +"px";
						popup.style.zIndex = "100";
						popup.style.border="thin solid black";
						popup.appendChild(missp);
						document.body.appendChild(popup);								
						document.getElementById("map").style.opacity = "1";					
					}
				}
				if (this.readyState == 4 && this.status != 200) { 
					document.body.style.backgroundColor="red";
					setTimeout(function(){location.reload();},1000);
				}
			}
			xhttp.send();			

		});
		map.on('movestart', function(evt){
			if(popup) {
				popup.style.display="none";
				if(currSelVect) currSelVect.clear();
				if(currl) cleanCurrl();							
			}
		});
    }
};
app.initialize();
function buildDescription(xtags) {
	var tags = []; for(let xtag of xtags) { tags[xtag.getAttribute("k")] = xtag.getAttribute("v"); };
	var description = null;
	if(tags["landuse"]) {
		if(["farmland","forest","grass","meadow","orchard","farmyard","vineyard","reservoir","cemetery","allotments","basin","quarry","construction","village_green","brownfield","recreation_ground","garages","greenhouse_horticulture","military","logging","greenfield","religious","landfill","plant_nursery","aquaculture","farm","greenery","salt_pond","churchyard","school","static_caravan","plantation","flowerbed","traffic_island","reservoir_watershed"].includes(tags["landuse"])) {
			if(tags["name"]) description = tags["name"];
			else { 
				description = "Nameless "+tags["landuse"];
				if(["construction","military","religious"].includes(tags["landuse"])) description = description + " area";
				description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
			}
		}
	}
	if(tags["building"]) {
		if(tags["name"]) {
			description = tags["name"];
		}
		else if(["yes", "residential","detached","industrial","commercial","service","civic","public"].includes(tags["building"])) {
			description = "Nameless " + tags["building"]+" building";
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());			
		}
		else if(tags["building"] == "construction") {
			description = t("Nameless building under construction");
		}
		else {
			description = "Nameless " + tags["building"];
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
		}
	}
	if(tags["leisure"]) {
		if(tags["name"]) description = tags["name"];
		else {
			description = "Nameless "+tags["leisure"];		
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
		}
	}
	if(tags["addr:housenumber"]) {
		var addr = "";
		if(tags["addr:housenumber"]) addr = addr+tags["addr:housenumber"]+", ";
		if(tags["addr:street"]) addr = addr+tags["addr:street"]+", ";
		if(tags["addr:place"]) addr = addr+tags["addr:place"]+", ";
		if(tags["addr:postcode"]) addr = addr+tags["addr:postcode"]+", ";
		if(tags["addr:suburb"]) addr = addr+tags["addr:suburb"]+", ";
		if(tags["addr:hamlet"]) addr = addr+tags["addr:hamlet"]+", ";
		if(tags["addr:city"]) addr = addr+tags["addr:city"]+", ";
		if(tags["addr:municipality"]) addr = addr+tags["addr:municipality"]+", ";
		if(tags["addr:subdistrict"]) addr = addr+tags["addr:subdistrict"]+", ";
		if(tags["addr:district"]) addr = addr+tags["addr:district"]+", ";
		if(tags["addr:province"]) addr = addr+tags["addr:province"]+", ";
		if(tags["addr:state"]) addr = addr+tags["addr:state"]+", ";
		if(tags["addr:country"]) addr = addr+tags["addr:country"]+", ";
		if(tags["name"]) addr = addr+(tags["name"]?tags["name"]:"")+", ";
		description = addr.substring(0,addr.length-2);
	}
	if(tags["power"]) {
		description = t(("Power "+tags["power"]).replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim())+" "+(tags["name"]?"&quot;"+tags["name"]+"&quot;":"");
	}
	if(tags["natural"]) {
		if(tags["name"]) description = tags["name"]; 
		else {
			description = "Nameless " + tags["natural"];
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
		}
	}
	if(tags["amenity"]) {
		if(tags["name"]) description = tags["name"]; 
		else {
			description = "Nameless "+tags["amenity"];
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
		}
	}
	if(tags["place"]) {
		if(tags["name"]) description = tags["name"]; 
		else {
			description = "Nameless " + tags["place"];
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
		}
	}
	if(tags["shop"]) {
		if(tags["name"]) description = tags["name"]; 
		else {
			description = "Nameless " + tags["shop"]+" shop ";
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
		}
	}
	if(tags["public_transport"]) {
		description = t(("Public transport "+tags["public_transport"]).replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim())+" "+(tags["name"]?"&quot;"+tags["name"]+"&quot;":"");
	}
	if(tags["railway"]) {
		description = t(("Railway "+tags["railway"]).replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim())+" "+(tags["name"]?"&quot;"+tags["name"]+"&quot;":"");
	}
	if(tags["tourism"]) {
		if(tags["name"]) description = tags["name"];
		else {
			description = "Nameless " + tags["tourism"];
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
		}
	}
	if(tags["man_made"]) {
		description = t(tags["mad_made"].replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim())+" "+(tags["name"]?"&quot;"+tags["name"]+"&quot;":"");
	}
	if(tags["highway"]) {
		if(tags["name"]) {
			description = tags["name"];
		}
		else {
			if(["residential","service","track","unclassified","primary","secondary","tertiary"].includes(tags["highway"])) {
				description = "Unnamed " + tags["highway"]+" road" + " " + (tags["service"]?", "+tags["service"]:"");
				description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
			}
			else {
				description = tags["highway"]+ (tags["service"]?", "+tags["service"]:"");
				description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());				
			}
		}
	}
	if(tags["waterway"]) {
		if(tags["name"]) description = tags["name"];
		else {
			description = "Nameless " + tags["waterway"];
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
		}
	}
	if(tags["aeroway"]) {
		if(tags["name"]) description = tags["name"];
		else {
			description = "Nameless " + tags["aeroway"];
			description = t(description.replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim());
		}
	}
	if(tags["bridge"]) {
		if(["viaduct","boardwalk","aqueduct","low_water_crossing","cantilever"].includes(tags["bridge"])) {
			description = t(tags["bridge"].replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim())+" "+(tags["name"]?"&quot;"+tags["name"]+"&quot;":"");
		}
		else if(tags["bridge"] == "abandoned") {
			description = t((tags["bridge"]+" bridge").replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim()) + " "+(tags["name"]?"&quot;"+tags["name"]+"&quot;":"");
		}
	}
	if(tags["bicycle"] == "designated") {
			description = t("cycleway");
	}
	return description;	
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function cleanCurrl() {
	for(let l of currl) {
		try { l.getSource().clear(); map.removeLayer(l); } catch(e) {}
	}
	currl = [];
}
window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
function t(txt) {
	try {
		var thttp = new XMLHttpRequest();									
		thttp.open("GET", "translate/index.php?t="+encodeURIComponent(txt)+"&k="+tat, false);		
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