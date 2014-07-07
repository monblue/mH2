<?php
//header('Content-type: text/html; charset=utf-8');

require 'hanja_to_hangul2.php';

function getFile($filename) {
		$fp = fopen($filename, "r"); 
		$returnValue = fread($fp, filesize($filename)); 
		fclose($fp);

		return $returnValue; 
}

//입력
$source = getFile('bangyak1.txt');

$result = modifyHanja($source,'kc','(',')');

//출력
$filename = 'bangyak2.txt';
$fp = fopen($filename, "w");
fwrite($fp, $result); // will proccess /n as newline ...
fclose($fp);

?>