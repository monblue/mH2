<?php

header('Content-type: text/html; charset=utf-8');

require 'hanja_to_hangul.php';

$source = <<<_TEXT_
성실(誠實)한 마음과 튼튼한 몸으로, 학문(學問)과 기술(技術)을 배우고 익히며,
타고난 저마다의 素質을 開發하고, 우리의 處地를 躍進의 발판으로 삼아,
創造의 힘과 開拓의 精神을 기른다.
- 國民 敎育 憲章 中 -
_TEXT_;

$change1 = hanja_to_hangul($source);
$change2 = hanja_to_hangul($source,'ck');
$change3 = hanja_to_hangul($source,'kc','[',']');
$change4 = hanja_to_hangul($source,'ck','<span style="font-size:11px;">','</span>');

echo <<<_HTML_
<pre style="font-size:12px;"><b>원본</b>
{$source}<br />
<b>한자→한글</b>
{$change1}<br />
<b>한자→한자(한글)</b>
{$change2}<br />
<b>한자→한글[한자]</b>
{$change3}<br />
<b>한자→한자<span style="font-size:11px;">한글</span></b>
{$change4}</pre>
_HTML_;

?>
