<?php 
session_start();
if(!(crypt($_SESSION['token'], $_GET['k']) == $_GET['k'])){
   header("HTTP/1.1 401 Unauthorized"); die();
}
header("Access-Control-Allow-Origin: http://www.crowded.zone");
require 'vendor/autoload.php';
use Google\Cloud\Translate\V3\TranslationServiceClient;
putenv('GOOGLE_APPLICATION_CREDENTIALS=/var/www/vhosts/crowded.zone/httpdocs/translate/auth/API-Project-37a6c5bc097f.json');	
function cmp($a, $b)
{
    if ($a[1] == $b[1]) {
        return 0;
    }
    return ($b[1] < $a[1]) ? -1 : 1;
}
try {
	$sl = [];
	$translation = null;
	foreach(explode(",",$_SERVER['HTTP_ACCEPT_LANGUAGE']) as $l) {
		$lq = explode(";",$l);
		$lq[0] = trim($lq[0]);
		if(count($lq) == 1) $lq[]=1;
		else $lq[1] = substr(trim($lq[1]),2);
		$sl[] = $lq;
	}
	usort($sl, "cmp");
	if(stripos($sl[0][0],"en") !== false) {
		echo($_GET["t"]);
		die();
	}
	$link = mysqli_connect("localhost","cz_db_adm","30QiVxwA7IO&","admin_cz");
	try {
		mysqli_set_charset("utf8");
		$lid = null;
		$stmt = mysqli_prepare($link,"SELECT id from literals where text = ?");
		mysqli_stmt_bind_param($stmt, 's', $_GET["t"]);
		if(mysqli_stmt_execute($stmt)) {			
			mysqli_stmt_bind_result($stmt, $rlid);
			while (mysqli_stmt_fetch($stmt)) { $lid = $rlid; }
		}
		else {
			echo($_GET["t"]); 
			die();
		}
		if(empty($lid)) {
			$stmt2 = mysqli_prepare($link,"INSERT INTO literals(text) values(?)");
			mysqli_stmt_bind_param($stmt2, 's', $_GET["t"]);
			if(mysqli_stmt_execute($stmt2)) {
				$lid = mysqli_insert_id($link);
			}
			else {
				echo($_GET["t"]); 
				die();
			}
		}		
		$stmt3 = mysqli_prepare($link,"SELECT translation from translations where literal_id = ? and lang = ?");
		mysqli_stmt_bind_param($stmt3, 'is', $lid, $sl[0][0] );
		if(mysqli_stmt_execute($stmt3)) {		
			mysqli_stmt_bind_result($stmt3, $rtranslation);
			while (mysqli_stmt_fetch($stmt3)) { $translation = $rtranslation; }
		}
		else {
			echo($_GET["t"]); 
			die();
		}
		if(!empty($translation)) {
			echo($translation);
			die();
		}
		else 
		{					
			try {						
				$client = new TranslationServiceClient([
					'projectId' => 'api-project-1006364337840'
				]);
				$response = $client->translateText(
					[$_GET["t"]],
					$sl[0][0],
					TranslationServiceClient::locationName('api-project-1006364337840', 'global')
				);
				foreach ($response->getTranslations() as $key => $translation) {					
					$translation = $translation->getTranslatedText();
				}
			} catch(Exception $e) { 
				echo($_GET["t"]); 
				$stmt4bis = mysqli_prepare($link,"INSERT INTO translations(literal_id,lang,translation) values(?,?,?)");
				mysqli_stmt_bind_param($stmt4bis, 'iss', $lid, $sl[0][0], $_GET["t"]);
				mysqli_stmt_execute($stmt4bis); 			
				die(); 
			}
			if(!empty($translation)) {
				$stmt4 = mysqli_prepare($link,"INSERT INTO translations(literal_id,lang,translation) values(?,?,?)");
				mysqli_stmt_bind_param($stmt4, 'iss', $lid, $sl[0][0], $translation);
				mysqli_stmt_execute($stmt4); 				
			}
		}
	}
	catch(Exception $dbe) {
		echo($_GET["t"]); 
		die();
	}
	mysqli_close($link);
	echo($translation);
}
catch(Exception $ge) {
	echo($_GET["t"]); 
	die();
}
?>