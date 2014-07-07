<?php
function getFile($filename) {
		$fp = fopen($filename, "r"); 
		$returnValue = fread($fp, filesize($filename)); 
		fclose($fp);

		return $returnValue; 
}

//echo getFile('test1.txt'); 
$string = getFile('test1.txt');

$filename = 'test2.txt';
$fp = fopen($filename, "w");
fwrite($fp, $string); // will proccess /n as newline ...
fclose($fp);
?>
