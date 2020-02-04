mmm that's some good data
<?php
// Dumps JSON to datalog.txt, one object per line
	$headers = getallheaders();
	$json_str = file_get_contents('php://input');
	$json = json_decode($json_str, TRUE);
	$json->date = date("d.m.Y");
	$json->time = date("H:i:s");
	$json_str = json_encode($json);
	$file = fopen("datalog.txt","a"); // NB! "a" appends to the file, "w" overwrites the file
	fwrite($file, $json_str);
	fwrite($file, PHP_EOL); // end of line
	fclose($file);
?>