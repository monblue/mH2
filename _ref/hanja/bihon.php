﻿<?
$source = <<<_TEXT_
성실(誠實)한 마음과 튼튼한 몸으로, 學問과 技術을 배우고 익히며, 성실(誠實)하자 
타고난 저마다의 소질(素質)을 開發하고, 우리의 處地를 躍進의 발판으로 삼아, 
創造의 힘과 開拓의 精神을 기른다. 
국민교육헌장(國民敎育憲章) 
- 國民 敎育 헌장(憲章) 中 - 
_TEXT_;

$hangul = 
'['. 
'\x{1100}-\x{11FF}'.    // 한글 자모 (Hangul Jamo) 
'\x{3130}-\x{318F}'.    // 호환용 한글 자모 (Hangul Compatibility Jamo) 
'\x{AC00}-\x{D7AF}'.     // 한글 소리 마디 (Hangul Syllables) 
']'; 

$hanja = 
'['. 
'\x{2FF0}-\x{2FFF}'.    // 한자 생김꼴 지시 부호 (Ideographic Description characters) 
'\x{31C0}-\x{31EF}'.    // 한중일 한자 획 (CJK Strokes) 
'\x{3400}-\x{4DBF}'.    // 한중일 통합 한자 확장-A (CJK Unified Ideographs Extension A) 
'\x{4E00}-\x{9FBF}'.    // 한중일 통합 한자 (CJK Unified Ideographs) 
'\x{F900}-\x{FAFF}'.    // 한중일 호환용 한자 (    CJK Compatibility Ideographs) 
'\x{20000}-\x{2A6DF}'.    // 한중일 통합 한자 확장-B (CJK Unified Ideographs Extension B) 
'\x{2F800}-\x{2FA1F}'.    // 한중일 호환용 한자 보충 (CJK Compatibility Ideographs Supplement) 
']'; 

$head = '('; 
$tail = ')'; 

preg_match_all('/'.$hangul.'+'.preg_quote($head).$hanja.'+'.preg_quote($tail).'/u',$source,$matches); 
$change = array(); 
foreach ( $matches[0] as $row ) {
	echo $row."<BR>";
	$change[$row] = reset(explode($head,$row)); 
}

$source = strtr($source,$change); 

echo $source;
?>