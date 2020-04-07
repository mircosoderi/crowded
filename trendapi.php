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
	$stmt = mysqli_prepare($link,"SELECT timestamp, people FROM trend WHERE oid = ?");
	mysqli_stmt_bind_param($stmt, 's', $_GET["id"] );
	if(mysqli_stmt_execute($stmt)) {			
		mysqli_stmt_bind_result($stmt, $timestamp, $people);
		while (mysqli_stmt_fetch($stmt)) {
			$data[] = [ "x" => date("c",$timestamp), "y" => $people ];
		}
	}
}
catch(Exception $e) {}
mysqli_close($link);
echo(json_encode($data));
?>