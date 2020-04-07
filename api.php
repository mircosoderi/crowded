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
if(!(crypt($_SESSION['token'], $_REQUEST['k']) == $_REQUEST['k'])){
   header("HTTP/1.1 401 Unauthorized"); die();
}
header("Access-Control-Allow-Origin: http://localhost:8000");
$pvtdb = json_decode(file_get_contents("pvt/db.json"),true);
$link = mysqli_connect($pvtdb["host"],$pvtdb["user"],$pvtdb["pass"],$pvtdb["dbnm"]);
try {
	if($_GET["ids"]) {
		$out = []; $out["counts"] = []; $out["max"] = "0";
		$ids = "";
		foreach(explode(",",$_GET["ids"]) as $iid) {			
			if((strpos($iid, "node-") === 0 || strpos($iid, "way-") === 0 || strpos($iid, "relation-") === 0) && ctype_digit(substr($iid,1+strpos($iid,"-")))  ) {
				$ids.="'$iid',";
			}
			else {
				header("HTTP/1.0 400 Bad Request"); die();
			}
		}
		$ids = substr($ids,0,strlen($ids)-1);
		$stmt = mysqli_prepare($link,"SELECT oid, count(1) count FROM realtime where oid in ($ids) and upd > ? group by oid");
		mysqli_stmt_bind_param($stmt, 'i', strtotime("-24 hours") );
		if(mysqli_stmt_execute($stmt)) {			
			mysqli_stmt_bind_result($stmt, $id, $count);
			while (mysqli_stmt_fetch($stmt)) {
				$out["counts"][] = array("id" => "$id", "count" => "$count");				
				if($count > $out["max"]) $out["max"] = "$count";
			}
			echo(json_encode($out,JSON_PRETTY_PRINT));
		}
		else {
			header("HTTP/1.0 500 Internal Server Error");
		}
	}
	else if(!$_POST["id"]) {
		$expireCheckFrom = null;
		$expireCheckTo = null;
		try {
			$qry = mysqli_query($link, "SELECT max(upd) thelast FROM realtime"); 			
			while($row = mysqli_fetch_assoc($qry)) {
				$expireCheckFrom = $row["thelast"];
			}					
			$expireCheckFrom = $expireCheckFrom-60*60*24;
			$expireCheckTo = time()-60*60*24;
		}
		catch(Exception $pre) {}		
		$stmt = mysqli_prepare($link,"INSERT INTO realtime(lat,lon,oid,upd) VALUES (?,?,?,UNIX_TIMESTAMP())");
		mysqli_stmt_bind_param($stmt, 'iis', $_POST["lat"], $_POST["lon"], $_POST["oid"]);
		if(mysqli_stmt_execute($stmt)) {
			$newuserid = mysqli_insert_id($link); 
			echo($newuserid);
			try {								
				$stmtc = mysqli_prepare($link, "INSERT INTO contacts(a,b,oid,lat,lon,timestamp) select ?, id, oid, ?, ?, UNIX_TIMESTAMP() FROM realtime WHERE oid = ? and upd > ? and id <> ? ");
				mysqli_stmt_bind_param($stmtc, 'iiisii', $newuserid, $_POST["lat"], $_POST["lon"], $_POST["oid"], strtotime("-24 hours"), $newuserid);
				mysqli_stmt_execute($stmtc);				
				$newPeople = 1;
				$stmtlp = mysqli_prepare($link,"SELECT people FROM trend WHERE oid = ? and timestamp = ( SELECT max(timestamp) FROM trend WHERE oid = ? )");
				mysqli_stmt_bind_param($stmtlp, 'ss', $_POST["oid"], $_POST["oid"] );
				if(mysqli_stmt_execute($stmtlp)) {			
					mysqli_stmt_bind_result($stmtlp, $people);
					while (mysqli_stmt_fetch($stmtlp)) {
						$newPeople = $people+1;
					}
				}
				$stmtip = mysqli_prepare($link,"INSERT INTO trend(oid, timestamp, people) VALUES (?,UNIX_TIMESTAMP(),?)");
				mysqli_stmt_bind_param($stmtip, 'si', $_POST["oid"], $newPeople);
				mysqli_stmt_execute($stmtip);				
				$expPlaces = [];
				$stmteclr = mysqli_prepare($link,"SELECT oid FROM realtime WHERE upd BETWEEN ? and ?");
				mysqli_stmt_bind_param($stmteclr, 'ii', $expireCheckFrom, $expireCheckTo);
				if(mysqli_stmt_execute($stmteclr)) {			
					mysqli_stmt_bind_result($stmteclr, $expPlace);
					while (mysqli_stmt_fetch($stmteclr)) {
						$expPlaces[] = $expPlace;							
					}
				}
				foreach($expPlaces as $expPlace) {
					$newPeopleExpPlace = null;
					$stmtlpep = mysqli_prepare($link,"SELECT people FROM trend WHERE oid = ? order by timestamp desc limit 1");							
					mysqli_stmt_bind_param($stmtlpep, 's', $expPlace );							
					if(mysqli_stmt_execute($stmtlpep)) {																											
						mysqli_stmt_bind_result($stmtlpep, $oldpeople);
						while (mysqli_stmt_fetch($stmtlpep)) {									
							$newPeopleExpPlace = $oldpeople - 1;
						}
					}
					$stmtoipep = mysqli_prepare($link,"INSERT INTO trend(oid, timestamp, people) VALUES (?,UNIX_TIMESTAMP(),?)");
					mysqli_stmt_bind_param($stmtoipep, 'si', $expPlace, $newPeopleExpPlace);
					mysqli_stmt_execute($stmtoipep);
				}				
			}
			catch(Exception $m){}
		}
		else {
			header("HTTP/1.0 500 Internal Server Error");
		}
	}
	else {
		$oldPlace = null;
		$expireCheckTo = null;
		$expireCheckFrom = null;
		try {
			$stmtolp = mysqli_prepare($link,"SELECT oid FROM realtime WHERE id = ?");
			mysqli_stmt_bind_param($stmtolp, 'i', $_POST["id"]);
			if(mysqli_stmt_execute($stmtolp)) {			
				mysqli_stmt_bind_result($stmtolp, $oid);
				while (mysqli_stmt_fetch($stmtolp)) {
					$oldPlace = $oid;
				}
			}
			$qry = mysqli_query($link, "SELECT max(upd) thelast FROM realtime"); 			
			while($row = mysqli_fetch_assoc($qry)) {
				$expireCheckFrom = $row["thelast"];
			}					
			$expireCheckFrom = $expireCheckFrom-60*60*24;
			$expireCheckTo = time()-60*60*24;			
		}
		catch(Exception $eop) {}				
		$stmt = mysqli_prepare($link,"UPDATE realtime SET lat = ?, lon = ?, oid = ?, upd = UNIX_TIMESTAMP() WHERE id = ?");
		mysqli_stmt_bind_param($stmt, 'iisi', $_POST["lat"], $_POST["lon"], $_POST["oid"], $_POST["id"]);
		if(mysqli_stmt_execute($stmt)) {
			echo($_POST["id"]);					
			$stmtc = mysqli_prepare($link, "INSERT INTO contacts(a,b,oid,lat,lon,timestamp) select ?, id, oid, ?, ?, UNIX_TIMESTAMP() FROM realtime WHERE oid = ? and upd > ? and id <> ?");
			mysqli_stmt_bind_param($stmtc, 'iiisii', $_POST["id"], $_POST["lat"], $_POST["lon"], $_POST["oid"], strtotime("-24 hours"), $_POST["id"]);			
			mysqli_stmt_execute($stmtc);
			if($oldPlace != $_POST["oid"]) {
				try {
					$newPeople = 1;
					$stmtlp = mysqli_prepare($link,"SELECT people FROM trend WHERE oid = ? and timestamp = ( SELECT max(timestamp) FROM trend WHERE oid = ? )");
					mysqli_stmt_bind_param($stmtlp, 'ss', $_POST["oid"], $_POST["oid"] );
					if(mysqli_stmt_execute($stmtlp)) {			
						mysqli_stmt_bind_result($stmtlp, $people);
						while (mysqli_stmt_fetch($stmtlp)) {
							$newPeople = $people+1;
						}
					}
					$stmtip = mysqli_prepare($link,"INSERT INTO trend(oid, timestamp, people) VALUES (?,UNIX_TIMESTAMP(),?)");
					mysqli_stmt_bind_param($stmtip, 'si', $_POST["oid"], $newPeople);
					mysqli_stmt_execute($stmtip);
					$newPeopleOldPlace = null;
					$stmtlp = mysqli_prepare($link,"SELECT people FROM trend WHERE oid = ? and timestamp = ( SELECT max(timestamp) FROM trend WHERE oid = ? )");
					mysqli_stmt_bind_param($stmtlp, 'ss', $oldPlace, $oldPlace );
					if(mysqli_stmt_execute($stmtlp)) {			
						mysqli_stmt_bind_result($stmtlp, $oldpeople);
						while (mysqli_stmt_fetch($stmtlp)) {
							$newPeopleOldPlace = $oldpeople-1;
						}
					}
					$stmtoip = mysqli_prepare($link,"INSERT INTO trend(oid, timestamp, people) VALUES (?,UNIX_TIMESTAMP(),?)");
					mysqli_stmt_bind_param($stmtoip, 'si', $oldPlace, $newPeopleOldPlace);
					mysqli_stmt_execute($stmtoip);					
					$expPlaces = [];
					$stmteclr = mysqli_prepare($link,"SELECT oid FROM realtime WHERE upd BETWEEN ? and ?");
					mysqli_stmt_bind_param($stmteclr, 'ii', $expireCheckFrom, $expireCheckTo);
					if(mysqli_stmt_execute($stmteclr)) {			
						mysqli_stmt_bind_result($stmteclr, $expPlace);
						while (mysqli_stmt_fetch($stmteclr)) {
							$expPlaces[] = $expPlace;							
						}
					}
					foreach($expPlaces as $expPlace) {
						$newPeopleExpPlace = null;
						$stmtlpep = mysqli_prepare($link,"SELECT people FROM trend WHERE oid = ? order by timestamp desc limit 1");							
						mysqli_stmt_bind_param($stmtlpep, 's', $expPlace );							
						if(mysqli_stmt_execute($stmtlpep)) {																											
							mysqli_stmt_bind_result($stmtlpep, $oldpeople);
							while (mysqli_stmt_fetch($stmtlpep)) {									
								$newPeopleExpPlace = $oldpeople - 1;
							}
						}
						$stmtoipep = mysqli_prepare($link,"INSERT INTO trend(oid, timestamp, people) VALUES (?,UNIX_TIMESTAMP(),?)");
						mysqli_stmt_bind_param($stmtoipep, 'si', $expPlace, $newPeopleExpPlace);
						mysqli_stmt_execute($stmtoipep);
					}					
				}
				catch(Exception $m){ }
			}
		}
		else {
			header("HTTP/1.0 500 Internal Server Error");
		}
	}
}
catch(Exception $e)
{
	header("HTTP/1.0 500 Internal Server Error");
}
mysqli_close($link);
?>