<?php

// 비혼의 조그만 세상 (http://dreamphp.com/) by 悲魂(비혼)

//header('Content-type: text/html; charset=utf-8');

require 'hanja_to_hangul2.php';
/*
$source = <<<_TEXT_
성실(誠實)한 마음과 튼튼한 몸으로, 學問과 技術을 배우고 익히며, 성실(誠實)하자
타고난 저마다의 소질(素質)을 開發하고, 우리의 處地를 躍進의 발판으로 삼아,
創造의 힘과 開拓의 精神을 기른다.
국민교육헌장(國民敎育憲章) 
국민교육헌장(國民敎育憲章) 
국민교육헌장(國民敎育憲章) 
- 國民 敎育 헌장(憲章) 中 -
_TEXT_;
*/

function getFile($filename) {
		$fp = fopen($filename, "r"); 
		$returnValue = fread($fp, filesize($filename)); 
		fclose($fp);

		return $returnValue; 
}

//echo getFile('test1.txt'); 
$source = getFile('test1.txt');

$result = modifyHanja($source,'kc','(',')');

echo <<<_HTML_
<pre>
{$result}</pre>
_HTML_;


$filename = 'test2.txt';
$fp = fopen($filename, "w");
fwrite($fp, $result); // will proccess /n as newline ...
fclose($fp);

/*
echo <<<_HTML_
<pre>
{$change3}</pre>
_HTML_;
*/
?>