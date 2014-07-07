<?
	$string = "학문(學問)";
	$token ="(";
	$pos = strpos($string, $token);
	$string = substr($string, $pos+1);
	$string = substr($string, 0, -1);
	echo $string;
?>