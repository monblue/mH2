<?php

// 비혼의 조그만 세상 (http://dreamphp.com/) by 悲魂(비혼)
// 한국역사정보통합시스템 (http://www.koreanhistory.or.kr/) 자료실 > [기초자료]한자음가사전
/*음변경
金	금	김
金	금
不	불	부
不	불
復	복	부
復	복
串	관

한글 유니코드 범위
0xAc00 ~ 0xD7A3

//12593~12686 초,중,종  성 한글  ㄱ~ .ㅣ 
//44032~55203 완성형 한글 ㄱ ~
*/
/*
echo '<xmp>'; 

$string = 'abc_한글! *비혼의&#128; 조그만 세상* ^-^);;;'; 
echo $string."\n"; 

$han = '[\xb0-\xc8][\xa1-\xfe]'; // 
$ann = '[a-zA-Z0-9]'; // 영문숫자 
$sym = '[\s,.\/<>?;\':"\[\]{}`\-=\\~!@#$%\^&*()_+|]'; // 특수문자 

$pattern = '/'.$han.'|'.$ann.'|'.$sym.'/'; 

preg_match_all($pattern,$string,$matches); 
$string = implode('',$matches[0]); 
echo $string."\n"; 

echo '</xmp>'; 
──────────────────────────────────────── 
abc_한글! *비혼의� 조그만 세상* ^-^);;; 
abc_한글! *비혼의 조그만 세상* ^-^);;;
========================================
쉽게 바꾸는 방법있을까요.. 

말하자면 앞첫글짜만 나뒤고 나머진 ○○ 

간단한 방법이 있을 것 같은데...  
안중현화박사 10-10-01 16:15 db에서  이름을 변수가 아닌 배열에 담아서 성을 제외한나머지 값은 ** 별표 처리,,db에서  이름을 변수가 아닌 배열에 담아서 성을 제외한나머지 값은 ** 별표 처리,, BiHon 10-10-01 17:34 PHP Function 게시판에 맞게 함수로 답변하자면… 

$name = '김예슬'; 
$name = preg_replace('/(.)(.*)$/ue',"'\\1'.str_repeat('○',mb_strlen('\\2','UTF-8'))",$name); 
echo $name; // 김○○ 

$name = '비혼의조그만세상'; 
$name = preg_replace('/(.)(.*)$/ue',"'\\1'.str_repeat('○',mb_strlen('\\2','UTF-8'))",$name); 
echo $name; // 비○○○○○○○
======================================
열검색해서 아래 함추 찾았는데 안되더군요. 

function containHangul($text) { 
    if ( preg_replace('/[^\x{ac00}-\x{d7af}]+/u', '', $text) ) { 
        return true; 
    } 

    return false; 
} 

표현식을 이렇게 바꾸니 잘 되네요.. 
    if(preg_match("/[\xA1-\xFE][\xA1-\xFE]/", $text)) { 

euc-kr서버 쓰는데 그래서 그런건가요?ㅋ 
정보차원에서 질문 드려염  
공대여자 10-08-08 11:47 |답글 예상하신 그래로인것 같네요. 
euc-kr과 utf-8(유니코드)의 한글 범위는 다릅니다. 
그래서 정규식 표현식도 다른거예요. 

서버가 euc-kr로 설정되어있어서 파일은 utf-8로 저장될 수 있습니다. 
즉, 위는 정확하게는 서버 쪽 설정이 아니라 파일쪽 인코딩 설정이 euc-kr이기 때문인것 같습니다.
*/


// 문자열, 옵션(k:한글,ck:한자한글,kc:한글한자), ck나 kc인 경우 뒤쪽 문자열에 감싸줄 문자
function modifyHanja($string,$option='k',$head='(',$tail=')') 
{
		//한글 패턴
		$hanguel = '[x{ac00}-\x{d7af}]';
		//한자 패턴
		$hanja = '[\x{2FF0}-\x{2FFF}\x{31C0}-\x{31EF}\x{3400}-\x{4DBF}\x{4E00}-\x{9FBF}\x{F900}-\x{FAFF}\x{20000}-\x{2A6DF}\x{2F800}-\x{2FA1F}]'; //한자
		
//		$head = '\'.$head;
//		$tail = '\'.$tail;

//	$cnt =  preg_match_all('/'.$hanguel.'+'.$head.$hanja.'+'.$tail.'/u', $string, $matches);
	$cnt =  preg_match_all('/'.$hanguel.'+\('.$hanja.'+\)/u', $string, $matches);
//	$cnt =  preg_match_all('/'.$han.'+/u',$string,$matches);

//	$cnt =  preg_match_all('/'.$hanja.'+/u',$string,$matches);
	// 한자가 없는 경우 문자열을 그대로 반환합니다.
	if ( !$cnt ) return $string;

	// 중복되는 값을 제거합니다. 
	$find = array_unique($matches[0]);

	foreach ($find as $old) {
		
		$token ="(";
		$pos = strpos($old, $token);
		$change[$old] = substr($old, $pos+1);
		$change[$old]= substr($change[$old], 0, -1);
	}
	
	// 변환 후 반환합니다.
	return strtr($string, $change);
}


?>