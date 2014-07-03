////list
//header state(치료상태) json
/*
var stateSet = [
    {"code":"진료대기", "sort":"10", "tpl":"WW", "view":"1", "sortKeys":[
        {"code":"JTIME", "name":"접수"}, {"code":"LAST", "name":"최종"}, {"code":"NAME", "name":"이름"}, {"code":"SEX", "name":"성별"}, {"code":"AGE", "name":"나이"}, 
        {"code":"JEJUCODE", "name":"제주"}]}, 
    {"code":"치료대기", "sort":"20", "tpl":"TB", "view":"0", "sortKeys":[
        {"code":"BTIME", "name":"입실"}, {"code":"JTIME", "name":"접수"}, {"code":"SEX", "name":"성별"}, {"code":"AGE", "name":"나이"}, 
        {"code":"JEJUCODE", "name":"제주"}, {"code":"JTIME", "name":"접수"}]},
    {"code":"치료베드", "sort":"25", "tpl":"TB", "view":"0", "sortKeys":[
        {"code":"BTIME", "name":"입실"}, {"code":"AGE", "name":"나이"}, {"code":"JEJUCODE", "name":"제주"}, {"code":"JTIME", "name":"접수"}]},
    {"code":"수납대기", "sort":"30", "tpl":"RW", "view":"1", "sortKeys":[
        {"code":"TOTAL", "name":"진료비"}, {"code":"JTIME", "name":"접수"}, {"code":"NAME", "name":"이름"}, {"code":"SEX", "name":"성별"}, {"code":"AGE", "name":"나이"}, {"code":"JEJUCODE", "name":"제주"}]},
    {"code":"보험환자", "sort":"40", "tpl":"RW", "view":"0", "sortKeys":[
        {"code":"TOTAL", "name":"진료비"}, {"code":"BONBU", "name":"본부금"}, {"code":"JTIME", "name":"접수"}, {"code":"SEX", "name":"성별"}, {"code":"AGE", "name":"나이"}]},
    {"code":"일반환자", "sort":"45", "tpl":"RW", "view":"0", "sortKeys":[
        {"code":"JTIME", "name":"접수"}]}, 
];
*/
var hM_STATE = [
    {"code":"진료대기", "sort":"10", "tpl":"WW", "view":"1", "sortkey":"JTIME"}, 
    {"code":"치료대기", "sort":"20", "tpl":"TB", "view":"0", "sortkey":"BNUM"}, 
    {"code":"치료베드", "sort":"25", "tpl":"TB", "view":"0", "sortkey":"BTIME"}, 
    {"code":"수납대기", "sort":"30", "tpl":"RW", "view":"1", "sortkey":"JTIME"}, 
    {"code":"보험환자", "sort":"40", "tpl":"RW", "view":"0", "sortkey":"BONBU"}, 
    {"code":"일반환자", "sort":"45", "tpl":"RW", "view":"0", "sortkey":"BONBU"}
];
/*
////chart
var txMain = [
{"group":"0", "txitems":[{"code":"10100","name":"초진","price":"11020"},{"code":"10200","name":"재진","price":"6960"}]},
{"group":"8", "tagType":"checkbox", "txitems":[{"code":"40400","name":"변증","price":"2390"}]},
{"group":"3", "txitems":[{"code":"40011","name":"경1","price":"2490"},{"code":"40012","name":"경2","price":"3740"},{"code":"40011002","name":"1(자락등)","price":"2990"},{"code":"40011006","name":"1(화침등)","price":"3740"},{"code":"40012002","name":"2(자락등)","price":"4240"},{"code":"40012006","name":"2(화침등)","price":"4990"},{"code":"40012004","name":"2(사암등)","price":"4990"}]},
{"group":"5", "txitems":[{"code":"40120","name":"분구침","price":"2180"},{"code":"40091","name":"전침","price":"3770"},{"code":"40100","name":"레이저","price":"2620"},{"code":"40092","name":"전자침","price":"3790"}]},
{"group":"4", "txitems":[{"code":"40030","name":"안와","price":"2750"},{"code":"40070","name":"척추","price":"2710"},{"code":"40060","name":"관절","price":"2600"},{"code":"40080","name":"투자","price":"4020"},{"code":"40040","name":"비강","price":"2750"},{"code":"40050","name":"복강","price":"2730"}]},
{"group":"6", "txitems":[{"code":"40304","name":"직접구","price":"5340"},{"code":"40306","name":"간접구","price":"2210"},{"code":"40305","name":"반흔구","price":"5570"},{"code":"40307","name":"기기구","price":"2040"}]},
{"group":"7", "txitems":[{"code":"40312","name":"습부1","price":"5310"},{"code":"40313","name":"습부2","price":"7970"},{"code":"40321","name":"유관법","price":"3310"},{"code":"40323","name":"주관법","price":"4090"},{"code":"40322","name":"섬관법","price":"3550"}]},
{"group":"9", "txitems":[{"code":"40700","name":"온열","price":"750"},{"code":"40701","name":"적외선","price":"750"},{"code":"40702","name":"한냉","price":"750"}],},
{"group":"15", "txitems":[{"code":"C00010000","name":"C가미작약탕","price":"936"},{"code":"C00020000","name":"C계지탕","price":"867"},{"code":"669600040","name":"가미소요산","price":"1865"},{"code":"669600080","name":"갈근탕","price":"2610"},{"code":"669600280","name":"구미강활탕","price":"1782"},{"code":"669600720","name":"반하백출천마탕","price":"1906"},{"code":"669600730","name":"반하사심탕","price":"2235"},{"code":"669600850","name":"보중익기탕","price":"1313"},{"code":"669600970","name":"삼소음","price":"1802"},{"code":"669601050","name":"생맥산","price":"1124"},{"code":"669601090","name":"소시호탕","price":"2458"},{"code":"669601120","name":"소청룡탕","price":"1331"},{"code":"669601380","name":"연교패독산","price":"2130"},{"code":"669601440","name":"오적산","price":"1728"},{"code":"669601560","name":"이중탕","price":"1564"},{"code":"669601580","name":"이진탕","price":"811"},{"code":"669601600","name":"인삼패독산","price":"2044"},{"code":"669601650","name":"자음강화탕","price":"1606"},{"code":"669601720","name":"조위승기탕","price":"868"},{"code":"669601860","name":"청상견통탕","price":"1766"},{"code":"669601970","name":"팔물탕","price":"3772"},{"code":"669601980","name":"평위산","price":"863"},{"code":"669602030","name":"향사평위산","price":"943"},{"code":"669602070","name":"형개연교탕","price":"1423"},{"code":"669602180","name":"황련해독탕","price":"1120"}],},
{"group":"77", "txitems":[{"code":"HBSU00001","name":"첩약","price":"150000"},{"code":"HBSU00002","name":"기타","price":"0"},{"code":"HBSU00003","name":"핫팩","price":"0"},{"code":"HBSU00004","name":"쿨팩","price":"0"},{"code":"HBSU00005","name":"적외선","price":"0"},{"code":"HBSU00006","name":"간섭파","price":"0"},{"code":"HBSU00007","name":"경근중주파요법","price":"3030"},{"code":"HBSU00008","name":"롤링베드","price":"0"},{"code":"HBSU00009","name":"트랙션","price":"0"},{"code":"HBSU00010","name":"맛사지","price":"0"},{"code":"HBSU00011","name":"아로마","price":"0"},{"code":"HBSU00012","name":"비보험(당귀수산1일)","price":"2000"},{"code":"HBSU00013","name":"비보험(당귀수산3일)","price":"6000"},{"code":"HBSU00014","name":"비보험(당귀수산2일)","price":"4000"},{"code":"HBSU00015","name":"한방파스","price":"4000"},{"code":"HBSU00016","name":"산제(1일)","price":"1500"},{"code":"HBSU00017","name":"산제(2일)","price":"3000"},{"code":"HBSU00018","name":"경근저주파요법","price":"3030"},{"code":"HBSU00019","name":"자운고","price":"5000"}],},
{"group":"88", "txitems":[{"code":"MM015","name":"온냉경락요법-경피경근온열요법 50%","price":"380"},{"code":"MM016","name":"온냉경락요법-경피적외선조사요법 50%","price":"380"},{"code":"MM017","name":"온냉경락요법-경피경근한냉요법 50%","price":"380"},{"code":"MM0201","name":"경근초음파요법","price":"1010"},{"code":"MM0202","name":"극초단파요법","price":"1010"},{"code":"MM0203","name":"초단파요법","price":"1010"},{"code":"MM051","name":"견인요법- 경추","price":"5470"},{"code":"MM052","name":"견인요법- 골반","price":"5450"},{"code":"MM070","name":"경근저주파요법(TENS)","price":"3030"},{"code":"MM080","name":"경근중주파요법(ICT)","price":"3030"},{"code":"MM085","name":"경맥레이져치료","price":"4890"},{"code":"mm101","name":"도인운동요법","price":"4030"},{"code":"MM170","name":"유속치료[1일당]","price":"2180"},{"code":"MM303","name":"상기도 증기흡입치료","price":"510"},{"code":"MM410","name":"수압팽창술","price":"18300"}]}
];
//"hasSub":"" => 필요한가?
//subItems는 change main value 시 동적 생성...
//"tagType":"select" => 생략 가능
//"tagType":"checkbox" => drop down or drop up 가능하도록 wrap....
//"isGasan": "0.15", 가산여부(15%)

//초기화
//치료 내역 population

var txSub = [
{"mainCode":"40011002", "subItems":[{"code":"1", "name":"자락"},{"code":"2", "name":"도침"},{"code":"3", "name":"산침"}]},
{"mainCode":"40011006", "subItems":[{"code":"3", "name":"화침"},{"code":"4", "name":"온침"}]},
{"mainCode":"40012002", "subItems":[{"code":"1", "name":"자락"},{"code":"2", "name":"도침"},{"code":"3", "name":"산침"}]},
{"mainCode":"40012006", "subItems":[{"code":"3", "name":"화침"},{"code":"4", "name":"온침"}]},
{"mainCode":"40012004", "subItems":[{"code":"5", "name":"사암"},{"code":"6", "name":"오행"},{"code":"7", "name":"체질"}]},
{"mainCode":"40120", "subItems":[{"code":"1", "name":"이침"},{"code":"2", "name":"두침"},{"code":"3", "name":"족침"},{"code":"4", "name":"수침"},{"code":"5", "name":"수지침"},{"code":"6", "name":"면침"},{"code":"7", "name":"비침"},{"code":"8", "name":"완과침"},{"code":"9", "name":"피내침"},{"code":"10", "name":"피부침"},{"code":"11", "name":"자석침"}]},
{"mainCode":"40313", "subItems":[{"code":"1", "name":"두흉"},{"code":"2", "name":"두요"},{"code":"3", "name":"두상"},{"code":"4", "name":"흉요"},{"code":"5", "name":"흉상"},{"code":"6", "name":"요하"},{"code":"7", "name":"두하"},{"code":"8", "name":"흉하"},{"code":"9", "name":"요상"},{"code":"10", "name":"상하"}]},
{"mainCode":"40030", "tagType":"checkbox", "subItems":[{"code":"ST001", "name":"승읍"},{"code":"BL001", "name":"정명"}]},
{"mainCode":"40070", "tagType":"checkbox", "subItems":[{"code":"GV008", "name":"근축"},{"code":"GV014", "name":"대추"},{"code":"GV004", "name":"명문"},{"code":"GV011", "name":"신도"},{"code":"GV012", "name":"신주"},{"code":"GV009", "name":"지양"},{"code":"GV006", "name":"척중"},{"code":"GV016", "name":"풍부"},{"code":"GV003", "name":"요양관"}]},
{"mainCode":"40060", "tagType":"checkbox", "subItems":[{"code":"LI015", "name":"견우"},{"code":"LI011", "name":"곡지"},{"code":"GB040", "name":"구허"},{"code":"SI010", "name":"노수"},{"code":"PC007", "name":"대릉"},{"code":"ST035", "name":"독비"},{"code":"GB003", "name":"상관"},{"code":"HT003", "name":"소해"},{"code":"LE201", "name":"슬안"},{"code":"BL062", "name":"신맥"},{"code":"LI005", "name":"양계"},{"code":"SI005", "name":"양곡"},{"code":"TE004", "name":"양지"},{"code":"KI006", "name":"조해"},{"code":"LR004", "name":"중봉"},{"code":"TE010", "name":"천정"},{"code":"ST007", "name":"하관"},{"code":"GB030", "name":"환도"}]},
{"mainCode":"40080", "tagType":"checkbox", "subItems":[{"code":"ST004\/ST006\/", "name":"지창\/협거"},{"code":"HN046\/GB008\/", "name":"태양\/솔곡"},{"code":"TE021\/SI019\/", "name":"이문\/청궁"},{"code":"PC006\/TE005\/", "name":"내관\/외관"},{"code":"LI004\/SI003\/", "name":"합곡\/후계"},{"code":"TE014\/HT001\/", "name":"견료\/극천"},{"code":"BL060\/KI003\/", "name":"곤륜\/태계"},{"code":"SP006\/GB039\/", "name":"삼음교\/현종"},]},
{"mainCode":"40040", "tagType":"checkbox", "subItems":[{"code":"HN160", "name":"내영향"}]},
{"mainCode":"40050", "tagType":"checkbox", "subItems":[{"code":"CV013", "name":"상완"},{"code":"CV012", "name":"중완"},{"code":"CV010", "name":"하완"},{"code":"CV006", "name":"기해"},{"code":"CV004", "name":"관원"},{"code":"CV003", "name":"중극"},{"code":"ST025", "name":"천추"},{"code":"SP015", "name":"대횡"}]}
];
*/

//특수침 등(checkbox)에서는 OPSC_BLOD, OPSC_BIGO2 등의 구분자를 '|'로 해야함??###########
//특수침은 '/'' 2개 단위로 자름?? or 역으로 비교??
var fillTx = [
{"group":"0", "OPSC_MOMM_ID":"10100"},
{"group":"3", "OPSC_MOMM_ID":"40011002", "OPSC_BLOD":"지창\/협거\/태양\/솔곡", "OPSC_BIGO2":"ST004\/ST006\/HN046\/GB008\/", "OPSC_BIGO5":"2"},
{"group":"4", "OPSC_MOMM_ID":"40070", "OPSC_BLOD":"대추\/근축", "OPSC_BIGO2":"GV014\/GV008\/"},
{"group":"7", "OPSC_MOMM_ID":"", "OPSC_ONE_AMT":"0.25", "OPSC_DAY":"3"}
]

/*

"CV006":"기해","CV004":"관원","CV003":"중극","ST025":"천추","SP015":"대횡"}}}
*/