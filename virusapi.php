<?php
	
	/***********************************************************************
	Copyright 2020 Mirco Soderi

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
	************************************************************************/
	
session_start();
if(!(crypt($_SESSION['token'], $_GET['k']) == $_GET['k'])){
   header("HTTP/1.1 401 Unauthorized"); die();
}
$data = [];
$pvtdb = json_decode(file_get_contents("pvt/db.json"),true);
$link = mysqli_connect($pvtdb["host"],$pvtdb["user"],$pvtdb["pass"],$pvtdb["dbnm"]);
try {
	$stmt = mysqli_prepare($link,"SELECT c.a a, c.b b, c.oid, c.lat, c.lon, c.timestamp FROM contacts c, infected i where (  ( c.a = i.infected_id and c.b = ? ) or ( c.b = i.infected_id and c.a = ? ) ) and c.timestamp > i.timestamp - 60*60*24*14 order by c.timestamp desc limit 5");
	mysqli_stmt_bind_param($stmt, 'ii', $_GET["id"], $_GET["id"] );
	if(mysqli_stmt_execute($stmt)) {			
		mysqli_stmt_bind_result($stmt, $a, $b, $oid, $lat, $lon, $timestamp);
		while (mysqli_stmt_fetch($stmt)) {
			$data[] = [ "timestamp" => $timestamp, "oid" => $oid, "lat" => $lat, "lon" => $lon ];
		}
	}
}
catch(Exception $e) {}
mysqli_close($link);
echo(json_encode($data));
?>