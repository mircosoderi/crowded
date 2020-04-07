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
        storage = window.localStorage;
		popup = null;
		lbl = null;
		currl = [];
		idst = "closed";
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
		var infMarker = new ol.source.Vector();
		var inficon = new ol.style.Icon({
			anchor: [0.5, 0.5],
			anchorXUnits: "fraction",
			anchorYUnits: "fraction",
			src: "img/covidicon.png"
		});										
		var infMarkers = new ol.layer.Vector({
			source: infMarker,
			style: new ol.style.Style({
				image: inficon
			})
		});		
		var myMarker = new ol.source.Vector();
		var icon = new ol.style.Icon({
			anchor: [0.5, 0.5],
			anchorXUnits: "fraction",
			anchorYUnits: "fraction",
			src: "img/noun_street_view_1208725c.png"
		});
		var mapCenter = ol.proj.transform( [1224277,5423872], 'EPSG:3857', 'EPSG:4326');
		if(storage.getItem("id")) {
			myMarker.addFeature(new ol.Feature({
				geometry: new ol.geom.Point([parseFloat(storage.getItem("lon")),parseFloat(storage.getItem("lat"))])
			}));
			if(parseInt(storage.getItem("upd")) < Date.now()/1000-86400) {
				icon = new ol.style.Icon({
					anchor: [0.5, 0.5],
					anchorXUnits: "fraction",
					anchorYUnits: "fraction",
					src: "img/noun_street_view_1208725w.png"
				});
			}
		}
		else {
			myMarker.addFeature(new ol.Feature({
				geometry: new ol.geom.Point([1224277,5423872])
			}));
		}
		var myMarkers = new ol.layer.Vector({
			source: myMarker,
			style: new ol.style.Style({
				image: icon
			})
		});
		if(storage.getItem("id")) {
			mapCenter = ol.proj.transform( [parseFloat(storage.getItem("lon")),parseFloat(storage.getItem("lat"))], 'EPSG:3857', 'EPSG:4326');
		}
		var myView = new ol.View(
			{  
				center: ol.proj.fromLonLat(mapCenter), 
				zoom: 12 
			}
		);		
		var map = new ol.Map ( 
			{
				target: "map",
				layers: [ myTile, myMarkers, currSelLayer, infMarkers ],
				view: myView
			} 
		);
		map.on('click', function(evt){
			if(popup) {
				popup.style.display="none";
				if(currSelVect) currSelVect.clear();
				if(currl) cleanCurrl();
			}
			if(document.getElementById("favTitle") && document.getElementById("favTitle").style.display != "none") {
				hideFavorites();
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
								if(popup) {
									popup.style.display="none";
									if(currSelVect) currSelVect.clear();
									if(currl) cleanCurrl();
								}
								if(p.id) {
									var yhttp = new XMLHttpRequest();
									yhttp.open("POST", "api.php", true);
									yhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
									yhttp.onreadystatechange = function() {
										if (this.readyState == 4 && this.status == 200) {
											if(!storage.getItem("id")) {
												storage.setItem("id",this.responseText);
											}
											storage.setItem("lon",evt.coordinate[0]);
											storage.setItem("lat",evt.coordinate[1]);
											storage.setItem("x",evt.pixel[0]);
											storage.setItem("y",evt.pixel[1]);
											storage.setItem("oid",p.id);
											storage.setItem("onm",p.childNodes[0].innerHTML);
											storage.setItem("upd", Math.floor(Date.now() / 1000));
											var favorites = storage.getItem("fav");
											try { if(favorites) favorites = JSON.parse(favorites); } catch(ee) {}
											if(!favorites) favorites = [];
											var cleanedFavorites = [];
											favorites.forEach(function(aFav){ if(aFav.oid != p.id) cleanedFavorites.push(aFav); }); 
											favorites = cleanedFavorites;
											var sliceSize = 10;
											if(window.mobileAndTabletcheck()) sliceSize = 5;
											favorites = [{
												"lon": evt.coordinate[0],
												"lat": evt.coordinate[1],
												"x": evt.pixel[0],
												"y": evt.pixel[1],
												"oid": p.id,
												"onm": p.childNodes[0].innerHTML,
												"upd": Math.floor(Date.now() / 1000)
											}].concat(favorites).slice(0,sliceSize);
											storage.setItem("fav",JSON.stringify(favorites));
											map.removeLayer(myMarkers);
											icon = new ol.style.Icon({
												anchor: [0.5, 0.5],
												anchorXUnits: "fraction",
												anchorYUnits: "fraction",
												src: "img/noun_street_view_1208725c.png"
											});										
											myMarkers = new ol.layer.Vector({
												source: myMarker,
												style: new ol.style.Style({
													image: icon
												})
											});
											map.addLayer(myMarkers);
											myMarker.clear();								
											myMarker.addFeature(new ol.Feature({
												geometry: new ol.geom.Point(evt.coordinate),
											}));										
										}
										if (this.readyState == 4 && this.status != 200) { 
											document.body.style.backgroundColor="red";
											setTimeout(function(){location.reload();},1000);
										}
									};											
									yhttp.send("lon="+parseInt(evt.coordinate[0])+"&lat="+parseInt(evt.coordinate[1])+"&oid="+p.id+(storage.getItem("id")?"&id="+storage.getItem("id"):"")+"&k="+tat);								
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
			if(document.getElementById("favTitle") && document.getElementById("favTitle").style.display != "none") {
				hideFavorites();
			}
		});
		if(storage.getItem("fav")) {
			var favDiv = document.createElement("div");
			favDiv.className="favIcon";			
			favDiv.innerHTML = "<span style=\"float:left;\">&#x2B50;</span><span id=\"favTitle\" class=\"favOn\" style=\"display:none;\">"+t("Recent places")+"</span>";
			setTimeout(function(){document.getElementById("container").appendChild(favDiv);},1000);
			favDiv.onclick=function(){
				if(popup) {
					popup.style.display="none";
					if(currSelVect) currSelVect.clear();
					if(currl) cleanCurrl();
				}
				if(document.getElementById("favTitle").style.display == "none") {
					var wp = favDiv.offsetWidth;
					document.getElementById("favTitle").style.display = "inline";					
					var favorites = JSON.parse(storage.getItem("fav"));
					favorites.forEach(function(place){
						var pPlace = document.createElement("p");
						pPlace.className = "favPlace favOn";
						if(window.mobileAndTabletcheck()) { pPlace.style.fontSize="smaller"; }
						const d = new Date(1000*parseInt(place.upd));
						const fopt = {
						  weekday: 'short', day: '2-digit', month: 'short', 
						  hour: 'numeric', minute: 'numeric', hour12: false
						};
						const dtf = new Intl.DateTimeFormat('it', fopt);
						pPlace.innerHTML = dtf.format(d)+" "+place.onm;
						pPlace.onclick=function(){
							var pyhttp = new XMLHttpRequest();
							pyhttp.open("POST", "api.php", true);
							pyhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							pyhttp.onreadystatechange = function() {
								if (this.readyState == 4 && this.status == 200) {
									if(!storage.getItem("id")) {
										storage.setItem("id",this.responseText);
									}
									storage.setItem("lon",place.lon);
									storage.setItem("lat",place.lat);
									storage.setItem("x",place.x);
									storage.setItem("y",place.y);
									storage.setItem("oid",place.oid);
									storage.setItem("onm",place.onm); 
									storage.setItem("upd", Math.floor(Date.now() / 1000));
									var favorites = storage.getItem("fav");
									try { if(favorites) favorites = JSON.parse(favorites); } catch(ee) {}
									if(!favorites) favorites = [];
									var cleanedFavorites = [];
									favorites.forEach(function(aFav){ if(aFav.oid != place.oid) cleanedFavorites.push(aFav); }); 
									favorites = cleanedFavorites;
									var sliceSize = 10;
									if(window.mobileAndTabletcheck()) sliceSize = 5;
									favorites = [{
										"lon": place.lon,
										"lat": place.lat,
										"x": place.x,
										"y": place.y,
										"oid": place.oid,
										"onm": place.onm, 
										"upd": Math.floor(Date.now() / 1000)
									}].concat(favorites).slice(0,sliceSize);
									storage.setItem("fav",JSON.stringify(favorites));
									var newView = new ol.View({
										center: [ place.lon, place.lat ], 
										zoom: map.getView().getZoom() 
									});
									map.setView(newView);
									map.removeLayer(myMarkers);
									icon = new ol.style.Icon({
										anchor: [0.5, 0.5],
										anchorXUnits: "fraction",
										anchorYUnits: "fraction",
										src: "img/noun_street_view_1208725c.png"
									});										
									myMarkers = new ol.layer.Vector({
										source: myMarker,
										style: new ol.style.Style({
											image: icon
										})
									});
									map.addLayer(myMarkers);
									myMarker.clear();								
									myMarker.addFeature(new ol.Feature({
										geometry: new ol.geom.Point([place.lon,place.lat]),
									}));										
								}
								if (this.readyState == 4 && this.status != 200) { 
									document.body.style.backgroundColor="red";
									setTimeout(function(){location.reload();},1000);
								}
							};											
							pyhttp.send("lon="+parseInt(place.lon)+"&lat="+parseInt(place.lat)+"&oid="+place.oid+(storage.getItem("id")?"&id="+storage.getItem("id"):"")+"&k="+tat);														
						};
						favDiv.appendChild(pPlace);
					});
					var wa = favDiv.offsetWidth;
					var wd = wa-wp;
					if(document.getElementById("infDiv")) {
						document.getElementById("infDiv").style.left = (94+wd)+"px";
						document.getElementById("infDiv").style.width = (document.getElementById("infDiv").offsetWidth-wd-24)+"px";
					}
					if(window.mobileAndTabletcheck()) {
						setTimeout(function(){recurr(0);},1000);
					}
				}
				else {
					Array.prototype.forEach.call(document.getElementsByClassName("favOn"), function(el) { 
						el.style.display="none";
					});
					if(document.getElementById("infDiv")) {
						document.getElementById("infDiv").style.left = "94px";
						document.getElementById("infDiv").style.width = (document.getElementById("container").offsetWidth-120)+"px";
					}					
				}
			};
		}
		if(storage.getItem("id")) {			
			var idDiv = document.createElement("div");
			idDiv.className = "idDiv";
			idDiv.innerHTML = storage.getItem("id");
			if(window.mobileAndTabletcheck()) {
				idDiv.style.top = "65px";
				idDiv.style.left = "7px";
				idDiv.style.padding = "8px";
			}
			document.getElementById("container").appendChild(idDiv);
			var xhttpv = new XMLHttpRequest();						
			xhttpv.open("GET", "virusapi.php?id="+storage.getItem("id")+"&k="+tat, true);												
			xhttpv.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var mustDisplay = false;
					JSON.parse(xhttpv.responseText).forEach(function(infection){
						mustDisplay = true;						
					});
					if(mustDisplay) {
						var infDiv = document.createElement("div");
						infDiv.className = "infIcon";		
						infDiv.id = "infDiv";
						infDiv.style.width = (document.getElementById("container").offsetWidth-120)+"px";
						infDiv.innerHTML = "<span id=\"infTitle\" onclick=\"if(idst == 'opened') { idst='closed!'; for(m=0;m<document.getElementById('infDiv').getElementsByTagName('p').length;m++){document.getElementById('infDiv').getElementsByTagName('p').item(m).style.display='none';} }\">COVID-19</span><i style=\"float:right; color: #ffc83d ; margin:2px;\" class=\"fas fa-window-close\" onclick=\"if(idst == 'opened') { idst='closed!'; for(m=0;m<document.getElementById('infDiv').getElementsByTagName('p').length;m++){document.getElementById('infDiv').getElementsByTagName('p').item(m).style.display='none';} } else { document.getElementById('infDiv').style.display='none';}\"></i>";
						setTimeout(function(){ if(document.getElementById("infDiv")) document.getElementById("container").removeChild(document.getElementById("infDiv")); document.getElementById("container").appendChild(infDiv);},2000);		
						infDiv.onclick = function() {
							storage.setItem("lastInfectionCheck",Date.now());
							if(popup) {
								popup.style.display="none";
							}
							if(idst == "closed!") {
								idst = "closed";
								if(infMarker) infMarker.clear();
							}
							else if(idst == "closed") {
								idst = "opened";			
								var ixhttpv = new XMLHttpRequest();						
								ixhttpv.open("GET", "virusapi.php?id="+storage.getItem("id")+"&k="+tat, true);												
								ixhttpv.onreadystatechange = function() {
									if (this.readyState == 4 && this.status == 200) {					
										JSON.parse(ixhttpv.responseText).forEach(function(infection){
											var pInf = document.createElement("p");
											pInf.className = "infDate infOn";
											if(window.mobileAndTabletcheck()) { pInf.style.fontSize="smaller"; }
											const id = new Date(1000*infection.timestamp);
											const iopt = {
											  weekday: 'short', day: '2-digit', month: 'short', 
											  hour: 'numeric', minute: 'numeric', hour12: false
											};
											const idt = new Intl.DateTimeFormat('it', iopt);
											pInf.innerHTML = idt.format(id);
											pInf.onclick=function(){
												map.removeLayer(infMarkers);
												inficon = new ol.style.Icon({
													anchor: [0.5, 0.5],
													anchorXUnits: "fraction",
													anchorYUnits: "fraction",
													src: "img/covidicon.png"
												});										
												infMarkers = new ol.layer.Vector({
													source: infMarker,
													style: new ol.style.Style({
														image: inficon
													})
												});
												map.addLayer(infMarkers);
												infMarker.clear();	
												infMarker.addFeature(new ol.Feature({
													geometry: new ol.geom.Point([infection.lon,infection.lat]),
												}));			
												var infView = new ol.View(
													{  
														center: [infection.lon,infection.lat], 
														zoom: map.getView().getZoom() 
													}
												);	
												map.setView(infView);
												Array.prototype.forEach.call(document.getElementsByClassName("infOn"), function(el) { 
													el.style.fontWeight = "normal";
												});
												pInf.style.fontWeight = "bold";
											};											
											infDiv.appendChild(pInf);
										});
										if(window.mobileAndTabletcheck()) {
											setTimeout(function(){infrecurr(0);},1000);
										}
									}
									if (this.readyState == 4 && this.status != 200) {
										document.body.style.backgroundColor="red";
										setTimeout(function(){location.reload();},1000);
									}									
								}									
								ixhttpv.send();												
							}
						};
					}				
				}
				if (this.readyState == 4 && this.status != 200) {
					document.body.style.backgroundColor="red";
					setTimeout(function(){location.reload();},1000);
				}
			};
			xhttpv.send();
		}	
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
		description = t(tags["man_made"].replace(/_/g, ' ').replace(/undefined/g, '').replace(/yes/g, '').trim())+" "+(tags["name"]?"&quot;"+tags["name"]+"&quot;":"");
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
function hideFavorites() {
	Array.prototype.forEach.call(document.getElementsByClassName("favOn"), function(el) { 
		el.style.display="none";
	});		
}
function recurr(c) {
	if(c > 0) document.getElementsByClassName("favPlace").item(c-1).style.opacity = "1";
	if(c < document.getElementsByClassName("favPlace").length) {
		document.getElementsByClassName("favPlace").item(c).style.opacity = "0.5";	
		var x = setTimeout(function(){recurr(c+1);},150);
	}
}
function infrecurr(c) {
	if(c > 0) document.getElementsByClassName("infDate").item(c-1).style.opacity = "1";
	if(c < document.getElementsByClassName("infDate").length) {
		document.getElementsByClassName("infDate").item(c).style.opacity = "0.5";	
		var x = setTimeout(function(){infrecurr(c+1);},150);
	}
}
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