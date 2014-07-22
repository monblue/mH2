//////************************************************************************
////// 이름:	  ChartTx.js
////// 기능:	  moonHani Chart.ChartTx Module
//////************************************************************************
define(function (require) {
	//"use strict";
////===========================================================================
//// requires
////===========================================================================
//-----------------------------------------------------------------------------
// requires: libraries
//-----------------------------------------------------------------------------
	var $			= require('jquery');
	var _			= require('underscore');
	var Backbone	 = require('backbone');
	var MH		   = require('MH_utils');
	var GLOBAL	   = require('share/Global');
	var TxItems	   = require('share/TxItems');	//@@@txMain, txSub 정의...@@@@
	//var Chart		  = require('app/models/Chart');
//-----------------------------------------------------------------------------
// requires: models
//-----------------------------------------------------------------------------
  var Patient   = require('list/models/Patient');
//-----------------------------------------------------------------------------
// requires: views
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// requires: templates
//-----------------------------------------------------------------------------
	var headerTpl	= require('text!chart_tpl/ChartTxHeader.html');
	var bodyTpl	= require('text!chart_tpl/ChartTxBody.html');
  var optionsTpl = require('text!chart_tpl/ChartTx-Item-options.html');
	var subBIGO5Tpl	= require('text!chart_tpl/ChartTx-subBIGO5.html');
	var subBIGO2Tpl	= require('text!chart_tpl/ChartTx-subBIGO2.html');
	var curTxsTpl	= require('text!chart_tpl/ChartTx-curTxs.html');
	var prmAcusTpl	= require('text!chart_tpl/ChartTx-prmAcus.html');
  var prmTxsTpl  = require('text!chart_tpl/ChartTx-PrmTxs.html');
	var selAcuTpl	= require('text!chart_tpl/ChartTx-selAcu.html');

////===========================================================================
//// private properties
////===========================================================================
	var $chart	  = $('#chartSection');
	var UiId	  = 'chartTx';
	var panelOpts = {
			id: UiId,
			class: 'panel-success',
			append: '#chartSection'
		};


	var $panel = '';

  //var txMain = TxItems.txMain;
  //var txSub = TxItems.txSub;
	//@@@@load data
/*
var txMain = [{"group":"0","name":"진찰","gasan":"1","width":"150px","txitems":[{"code":"10100","name":"초진","price":"11310.0"},{"code":"10200","name":"재진","price":"7140.0"}]},{"group":"1","name":"할증","gasan":"1.15","width":"150px","txitems":[]},{"group":"2","name":"조제료","gasan":"1.15","width":"0px","txitems":[{"code":"30010","name":"조제료(1일분)","price":"330.0"},{"code":"30020","name":"조제료(2일분)","price":"410.0"},{"code":"30030","name":"조제료(3일분)","price":"480.0"},{"code":"30040","name":"조제료(4일분)","price":"560.0"},{"code":"30050","name":"조제료(5일분)","price":"630.0"},{"code":"30060","name":"조제료(6일분)","price":"710.0"},{"code":"30070","name":"조제료(7일분)","price":"780.0"},{"code":"30080","name":"조제료(8일분)","price":"860.0"},{"code":"30090","name":"조제료(9일분)","price":"940.0"},{"code":"30100","name":"조제료(10일분)","price":"1010.0"},{"code":"30110","name":"조제료(11일분)","price":"1090.0"},{"code":"30120","name":"조제료(12일분)","price":"1160.0"},{"code":"30130","name":"조제료(13일분)","price":"1240.0"},{"code":"30140","name":"조제료(14일분)","price":"1310.0"},{"code":"30150","name":"조제료(15일분)","price":"1390.0"},{"code":"30160","name":"조제료(16일분이상30일분까지)","price":"1610.0"},{"code":"30180","name":"조제료(31일분이상60일분까지)","price":"1990.0"},{"code":"30190","name":"조제료(61일분이상)","price":"2290.0"},{"code":"30200","name":"한방입원환자조제·복약지도료(1일당)","price":"330.0"}]},{"group":"3","name":"침1","gasan":"1.15","width":"400px","txitems":[{"code":"40011","name":"경1","price":"2560.0"},{"code":"40012","name":"경2","price":"3840.0"},{"code":"40011002","name":"1(자락등)","price":"3070.0"},{"code":"40011006","name":"1(화침등)","price":"3840.0"},{"code":"40012002","name":"2(자락등)","price":"4350.0"},{"code":"40012006","name":"2(화침등)","price":"5120.0"},{"code":"40012004","name":"2(사암등)","price":"5120.0"}]},{"group":"4","name":"특수","gasan":"1.15","width":"230px","txitems":[{"code":"40030","name":"안와","price":"2820.0"},{"code":"40070","name":"척추","price":"2780.0"},{"code":"40060","name":"관절","price":"2670.0"},{"code":"40080","name":"투자","price":"4130.0"},{"code":"40040","name":"비강","price":"2820.0"},{"code":"40050","name":"복강","price":"2800.0"}]},{"group":"5","name":"침2","gasan":"1.15","width":"220px","txitems":[{"code":"40120","name":"분구침","price":"2230.0"},{"code":"40091","name":"전침","price":"3870.0"},{"code":"40100","name":"레이저","price":"2680.0"},{"code":"40092","name":"전자침","price":"3890.0"}]},{"group":"6","name":"뜸구","gasan":"1.15","width":"150px","txitems":[{"code":"40304","name":"직접구","price":"5480.0"},{"code":"40306","name":"간접구","price":"2270.0"},{"code":"40305","name":"반흔구","price":"5720.0"},{"code":"40307","name":"기기구","price":"2090.0"}]},{"group":"7","name":"부항","gasan":"1.15","width":"200px","txitems":[{"code":"40312","name":"습부1","price":"5450.0"},{"code":"40313","name":"습부2","price":"8180.0"},{"code":"40321","name":"유관법","price":"3390.0"},{"code":"40323","name":"주관법","price":"4200.0"},{"code":"40322","name":"섬관법","price":"3640.0"}]},{"group":"8","name":"변증","gasan":"1.15","width":"150px","txitems":[{"code":"40400","name":"변증","price":"2450.0"}]},{"group":"9","name":"물리","gasan":"1.15","width":"150px","txitems":[{"code":"40700","name":"온열","price":"770.0"},{"code":"40701","name":"적외선","price":"770.0"},{"code":"40702","name":"한냉","price":"770.0"}]},{"group":"15","name":"보험약","gasan":"1","width":"500px","txitems":[{"code":"`C00010000","name":"C가미작약탕","price":"936.0"},{"code":"`C00020000","name":"C계지탕","price":"867.0"},{"code":"`C00030000","name":"C인삼2g","price":"1454.0"},{"code":"623003360","name":"기화구미강활탕","price":"1424.0"},{"code":"623003370","name":"기화삼소음","price":"1692.0"},{"code":"623003380","name":"기화소청룡탕","price":"1268.0"},{"code":"623003410","name":"기화갈근탕","price":"740.0"},{"code":"623003420","name":"기화향사평위산","price":"805.0"},{"code":"623003700","name":"기화이진탕","price":"707.0"},{"code":"623003920","name":"기화오적산","price":"1444.0"},{"code":"662703950","name":"한중궁하탕","price":"701.0"},{"code":"662704170","name":"한중이진탕","price":"707.0"},{"code":"662704380","name":"한중구미강활탕","price":"1424.0"},{"code":"662704390","name":"한중오적산","price":"1444.0"}]},{"group":"77","name":"비보","gasan":"1","width":"500px","txitems":[{"code":"HBSU00001","name":"첩약","price":"150000"},{"code":"HBSU00007","name":"경근중주파요법","price":"3030"},{"code":"HBSU00012","name":"비보험(당귀수산1일)","price":"2000"},{"code":"HBSU00013","name":"비보험(당귀수산3일)","price":"6000"},{"code":"HBSU00014","name":"비보험(당귀수산2일)","price":"4000"},{"code":"HBSU00015","name":"한방파스","price":"4000"},{"code":"HBSU00016","name":"산제(1일)","price":"1500"},{"code":"HBSU00017","name":"산제(2일)","price":"3000"},{"code":"HBSU00018","name":"경근저주파요법","price":"3030"},{"code":"HBSU00019","name":"자운고","price":"5000"},{"code":"HBSU00020","name":"첩약2","price":"180000"},{"code":"HBSU00021","name":"상담","price":"0"},{"code":"HBSU00022","name":"첩약3","price":"300000"},{"code":"HBSU00023","name":"약침(HN)","price":"5000"}]},{"group":"88","name":"자보","gasan":"1","width":"500px","txitems":[{"code":"49020","name":"경근저주파요법(TENS)","price":"3485"},{"code":"92010","name":"제일한방파프수(1매)","price":"383"}]}];

var txSub = [{"mainCode":"40011002","subItems":[{"OPSC_BIGO5":"0","name":"자락"},{"OPSC_BIGO5":"1","name":"도침"},{"OPSC_BIGO5":"2","name":"산침"}]},{"mainCode":"40011006","subItems":[{"OPSC_BIGO5":"3","name":"화침"},{"OPSC_BIGO5":"4","name":"온침"}]},{"mainCode":"40012002","subItems":[{"OPSC_BIGO5":"0","name":"자락"},{"OPSC_BIGO5":"1","name":"도침"},{"OPSC_BIGO5":"2","name":"산침"}]},{"mainCode":"40012006","subItems":[{"OPSC_BIGO5":"3","name":"화침"},{"OPSC_BIGO5":"4","name":"온침"}]},{"mainCode":"40012004","subItems":[{"OPSC_BIGO5":"5","name":"사암"},{"OPSC_BIGO5":"6","name":"오행"},{"OPSC_BIGO5":"7","name":"체질"}]},{"mainCode":"40120","subItems":[{"OPSC_BIGO5":"1","name":"이침"},{"OPSC_BIGO5":"2","name":"두침"},{"OPSC_BIGO5":"3","name":"족침"},{"OPSC_BIGO5":"4","name":"수침"},{"OPSC_BIGO5":"5","name":"수지침"},{"OPSC_BIGO5":"6","name":"면침"},{"OPSC_BIGO5":"7","name":"비침"},{"OPSC_BIGO5":"8","name":"완과침"},{"OPSC_BIGO5":"9","name":"피내침"},{"OPSC_BIGO5":"10","name":"피부침"},{"OPSC_BIGO5":"11","name":"자석침"}]},{"mainCode":"40313","subItems":[{"OPSC_BIGO5":"1","name":"두흉"},{"OPSC_BIGO5":"2","name":"두요"},{"OPSC_BIGO5":"3","name":"두상"},{"OPSC_BIGO5":"4","name":"흉요"},{"OPSC_BIGO5":"5","name":"흉상"},{"OPSC_BIGO5":"6","name":"요하"},{"OPSC_BIGO5":"7","name":"두하"},{"OPSC_BIGO5":"8","name":"흉하"},{"OPSC_BIGO5":"9","name":"요상"},{"OPSC_BIGO5":"10","name":"상하"}]},{"mainCode":"40030","subItems":[{"OPSC_BIGO2":"ST001\/","OPSC_BLOD":"승읍"},{"OPSC_BIGO2":"BL001\/","OPSC_BLOD":"정명"}]},{"mainCode":"40070","subItems":[{"OPSC_BIGO2":"GV008\/","OPSC_BLOD":"근축"},{"OPSC_BIGO2":"GV014\/","OPSC_BLOD":"대추"},{"OPSC_BIGO2":"GV004\/","OPSC_BLOD":"명문"},{"OPSC_BIGO2":"GV011\/","OPSC_BLOD":"신도"},{"OPSC_BIGO2":"GV012\/","OPSC_BLOD":"신주"},{"OPSC_BIGO2":"GV009\/","OPSC_BLOD":"지양"},{"OPSC_BIGO2":"GV006\/","OPSC_BLOD":"척중"},{"OPSC_BIGO2":"GV016\/","OPSC_BLOD":"풍부"},{"OPSC_BIGO2":"GV003\/","OPSC_BLOD":"요양관"}]},{"mainCode":"40060","subItems":[{"OPSC_BIGO2":"LI015\/","OPSC_BLOD":"견우"},{"OPSC_BIGO2":"LI011\/","OPSC_BLOD":"곡지"},{"OPSC_BIGO2":"GB040\/","OPSC_BLOD":"구허"},{"OPSC_BIGO2":"SI010\/","OPSC_BLOD":"노수"},{"OPSC_BIGO2":"PC007\/","OPSC_BLOD":"대릉"},{"OPSC_BIGO2":"ST035\/","OPSC_BLOD":"독비"},{"OPSC_BIGO2":"GB003\/","OPSC_BLOD":"상관"},{"OPSC_BIGO2":"HT003\/","OPSC_BLOD":"소해"},{"OPSC_BIGO2":"LE201\/","OPSC_BLOD":"슬안"},{"OPSC_BIGO2":"BL062\/","OPSC_BLOD":"신맥"},{"OPSC_BIGO2":"LI005\/","OPSC_BLOD":"양계"},{"OPSC_BIGO2":"SI005\/","OPSC_BLOD":"양곡"},{"OPSC_BIGO2":"TE004\/","OPSC_BLOD":"양지"},{"OPSC_BIGO2":"KI006\/","OPSC_BLOD":"조해"},{"OPSC_BIGO2":"LR004\/","OPSC_BLOD":"중봉"},{"OPSC_BIGO2":"TE010\/","OPSC_BLOD":"천정"},{"OPSC_BIGO2":"ST007\/","OPSC_BLOD":"하관"},{"OPSC_BIGO2":"GB030\/","OPSC_BLOD":"환도"}]},{"mainCode":"40080","subItems":[{"OPSC_BIGO2":"ST004\/ST006\/","OPSC_BLOD":"지창/협거"},{"OPSC_BIGO2":"HN046\/GB008\/","OPSC_BLOD":"태양/솔곡"},{"OPSC_BIGO2":"TE021\/SI019\/","OPSC_BLOD":"이문/청궁"},{"OPSC_BIGO2":"PC006\/TE005\/","OPSC_BLOD":"내관/외관"},{"OPSC_BIGO2":"LI004\/SI003\/","OPSC_BLOD":"합곡/후계"},{"OPSC_BIGO2":"TE014\/HT001\/","OPSC_BLOD":"견료/극천"},{"OPSC_BIGO2":"BL060\/KI003\/","OPSC_BLOD":"곤륜/태계"},{"OPSC_BIGO2":"SP006\/GB039\/","OPSC_BLOD":"삼음교/현종"}]},{"mainCode":"40040","subItems":[{"OPSC_BIGO2":"HN160\/","OPSC_BLOD":"내영향"}]},{"mainCode":"40050","subItems":[{"OPSC_BIGO2":"CV013\/","OPSC_BLOD":"상완"},{"OPSC_BIGO2":"CV012\/","OPSC_BLOD":"중완"},{"OPSC_BIGO2":"CV010\/","OPSC_BLOD":"하완"},{"OPSC_BIGO2":"CV006\/","OPSC_BLOD":"기해"},{"OPSC_BIGO2":"CV004\/","OPSC_BLOD":"관원"},{"OPSC_BIGO2":"CV003\/","OPSC_BLOD":"중극"},{"OPSC_BIGO2":"ST025\/","OPSC_BLOD":"천추"},{"OPSC_BIGO2":"SP015\/","OPSC_BLOD":"대횡"}]}];
*/

////===========================================================================
//// private methods
////===========================================================================
	//from txMain(client side)
	var _getGroup = function(mommId) {
			//return this._getGroupCS(mommId) || this._getGroupMY(mommId) || this._getGroupMS(mommId);
			return _getGroupCS(mommId) || _getGroupMY(mommId) || _getGroupMS(mommId);
		};

	var _getMommData = function(mommId) {
			//return this._getGroupCS(mommId) || this._getGroupMY(mommId) || this._getGroupMS(mommId);
			return _getMommDataMY(mommId) || _getMommDataMS(mommId);
		};

	//---------------------------------------------------------
	var _getGroupCS = function(mommId) {
			//비보험, 보험약
			if (mommId.substr(0,4) == 'HBSU') return '77';   //비보험 중복 가능
				if (mommId.substr(0,1) == '`' || mommId.substr(0,1) == '6' || mommId.charCodeAt(0) > 64) {
				   return '15';
			}

			var len = txMain.length;
			for (var i=0;i<len;i++) {
				//////console.log('txMain item', txMain[i]);
				var find = _.findWhere(txMain[i].txitems, {code:mommId.substr(0,5)});
				if (find) {
					//////console.log('find it!!', find);
					return txMain[i].group;
				}

			}
			return false;   //MYSQL -> MSSQL

		};

	var _getGroupMY = function(mommId) {
			////console.log('_getGroupMY is called');
		};

	var _getGroupMS = function(mommId) {
			////console.log('_getGroupMS is called');
		};




	var _getMommDataMY = function(mommId) {
			////console.log('_getMommDataMY is called');
			/*
			var rs = '';
			$.ajax({
				url: GLOBAL.get('_BASEURL') + 'API/chart/getMommDataMY/' + mommId,
				type: 'GET',
				async: false,
				success: function(res) {
					rs = res;
				}
			});
			return rs;
			*/
			return false;
		};


	var _getMommDataMS = function(mommId) {
			//////console.log('_getMommDataMS is called');
			var rs = '';
			$.ajax({
				//url: GLOBAL.get('_BASEURL') + 'API/chart/getMommDataMS/' + mommId,
				url: GLOBAL.get('_BASEURL') + 'getMommDataMS/' + mommId,
				type: 'GET',
				async: false,
				dataType: 'json',
				success: function(res) {
					////console.log('_getMommDataMS res', res);
					rs = res;
				}
			});
			return rs;
		};

	var _setGroup = function(data, arrGroup) { //group 설정
			var group = _getGroup(data.OPSC_MOMM_ID);

			if (!group) {
				//@@@@@@@@@alert('치료그룹을 찾을 수 없습니다.');
				//return false;
				var group = 99;
				//arrGroup.push(group);
				//data.group = group + '_' + count;
				var count = _.where(arrGroup, group).length;
				if (count < 1) {
					arrGroup.push(group);
					data.group = group;
				} else {
					arrGroup.push(group);
					data.group = group + '_' + count;
				}
			}

			//@@@일치항목 count -> if (count == 0) {} /else {group + '_' + count}
			var count = _.where(arrGroup, group).length;
			if (count < 1) {
				arrGroup.push(group);
				data.group = group;
			} else {
				arrGroup.push(group);
				data.group = group + '_' + count;
			}

			return data;
		};

	//@@@age, day에 의한 suffix 제거
	var _delSuffix = function(mommId) {
			if (mommId.length !== 8) {
				return mommId;
			}

			//var suf = mommId.substr(5,3);
			var tail = mommId.substr(7,1);
			var body = mommId.substr(0,5);
			//var delta = suf - suffix
			////console.log('body, tail', body, tail);

			if (tail == '0') {	//tail == '0'
				return body;
			} else {
				return body + '00' + tail;
			}
			/*
			if (delta == 0) {
				return body;
			} else {
				return body + delta + '';
			}
			*/
		};

	//@@@age, day에 의한 suffix 제거
	var _delSuffixOne = function(options) {
			var mommId = options.mommId;
			var type = options.type || 12;

			if (mommId.length !== 8) {
				return mommId;
			}

			var suffix = mommId.substr(5,3);
			var body = mommId.substr(0,5);
			var delta = 0;

			switch(type) {
			case '1':  //age
				delta = suffix - mommId.substr(5,1)*100;
				//_getDeltaSuffix(suffix, delta)
				if (!delta) {
					return body;
				} else {
					return body + addZero(delta, 3) + '';
				}
				break;
			case '2':  //day
				mommId = _delSuffix(mommId, '2');
				break;
			case '3':  //art
				mommId = _delSuffix(mommId, '3');
				break;
			case '12':  //age, day
				mommId = _delSuffix(mommId, '12');
				break;
			case '13':  //age, art
				mommId = _delSuffix(mommId, '13');
				break;
			case '23':  //day, art
				mommId = _delSuffix(mommId, '23');
				break;
			case '123':  //age, day, art
				mommId = _delSuffix(mommId, '123');
				break;
			}

/*

			var suf = mommId.substr(5,3);
			var tail = mommId.substr(7,1);
			var body = mommId.substr(0,5);
			//var delta = suf - suffix
			////console.log('body, tail', body, tail);

			if (tail == '0') {	//tail == '0'
				return body;
			} else {
				return body + '00' + tail;
			}
*/
		};

	var _addSuffixOne = function(mommId, suffix) {
			//mommId = mommId.toString();

			if (mommId.length === 5) {
				return '' + mommId + suffix;
			} else if (mommId.length === 8) {
				//return 0 + mommId + suffix;
				if (!suffix.substr(0,1)) {
					return '' + mommId.substr(0,5) + suffix.substr(0,1) + mommId.substr(6,2);
					//var txt2 = txt1.slice(0, 3) + "bar" + txt1.slice(3);
				} else if (!suffix.substr(1,1)) {
					return '' + mommId.substr(0,6) + suffix.substr(1,1) + mommId.substr(6,1);
					//var txt2 = txt1.slice(0, 3) + "bar" + txt1.slice(3);
				} else if (!suffix.substr(2,1)) {
					return '' + mommId.substr(0,7) + suffix.substr(2,1);
					//var txt2 = txt1.slice(0, 3) + "bar" + txt1.slice(3);
				}
			}
		};

	var _delSuffixOne = function(mommId, suffix) {
			//mommId = mommId.toString();

			if (mommId.length === 5) {
				return mommId;
			} else if (mommId.length === 8) {
				//return 0 + mommId + suffix;
				if (!suffix.substr(0,1)) {
					return '' + mommId.substr(0,5) + '0' + mommId.substr(6,2);
					//var txt2 = txt1.slice(0, 3) + "bar" + txt1.slice(3);
				} else if (!suffix.substr(1,1)) {
					return '' + mommId.substr(0,6) + '0' + mommId.substr(6,1);
					//var txt2 = txt1.slice(0, 3) + "bar" + txt1.slice(3);
				} else if (!suffix.substr(2,1)) {
					return '' + mommId.substr(0,7) + '0';
					//var txt2 = txt1.slice(0, 3) + "bar" + txt1.slice(3);
				}
			}
		};

	var _addSuffix1 = function(mommId, suffix) {
			var mommId = options.mommId;
			var suffix = options.suffix;
			//var type = options.type || 12;

			switch(suffix) {
			case '010':  //age
				mommId = _delSuffix(mommId, '1');
				break;
			case '050':  //day
				mommId = _delSuffix(mommId, '2');
				break;
			case '030':  //art
				mommId = _delSuffix(mommId, '3');
				break;
			case '12':  //age, day
			}

			if (mommId.length === 5) {
				return mommId + suffix + '';
			} else if (mommId.length === 8) {
				return mommId + suffix + 0;
			}
		};


/**
 *_calculateFee: 진료비, 본부금, 비보험 구하기
 * @caution: _RMSTATE(view state) change ->
 * @params: json array    jsonArr     [{price:,gasan:,OPSC_AMT:,OPSC_DAY:},{}]
 * @params: json    opts     {itype:,age:,hasEx:}
 * @return: integer   bonbu    본부금
 */
    var _calculateFee = function(jsonArr, opts) {
      var total = 0;
      var bibo = 0;
      var bonbu = 0;
      var chung = 0;
      _.each(jsonArr, function(item){
        if (item.group > 70) {  //비보험, 자보
          bibo += parseInt(item.price);
        } else {
          var amt = item.OPSC_AMT || 1;
          var day = item.OPSC_DAY || 1;

          //total += Math.round(parseInt(item.price)*parseFloat(item.gasan)*parseFloat(item.OPSC_AMT)*parseInt(item.OPSC_DAY));
          total += Math.round(parseInt(item.price)*parseFloat(item.gasan)*parseFloat(amt)*parseInt(day));
        }
      });
      //10원 미만 절삭
      total = Math.floor(total/10)*10;

      if (!opts.age) {
        var opts = {"hasEx":0,"age":0,"itype":"건보","jeju":""};
      }
      opts.total = total;

      bonbu = _calculateBonbu(opts); //opts = {"total":,"hasEx":,"age":,"itype":}
      chungu = total - bonbu;


      if (opts.jeju.length > 1) {
        return {"total":total, "bonbu":bonbu, "chungu":chungu, "bibo":bibo, "sunab":bibo};
      } else if (opts.itype == '자보') {
        return {"total":total, "bonbu":total, "chungu":total+bibo+bonbu, "bibo":bibo, "sunab":0};
      } else if (opts.itype == '보호1') { //@@@확인요(건강유지비)
        return {"total":total, "bonbu":total, "chungu":chungu, "bibo":bibo, "sunab": bonbu + bibo};
      } else {
        return {"total":total, "bonbu":bonbu, "chungu":chungu, "bibo":bibo, "sunab": bonbu + bibo};
      }

    };


/**
 * _calculateBibo: 비보험
 * @caution:
 * @params: json array    jsonArr     {total:,itype:,age:,hasEx}
 * @return: integer   bonbu    본부금
 */
    var _calculateBibo = function(jsonArr) {  //비보험 총액 json: 비보험 [{}]
      var bibo = 0;
      _.each(jsonArr, function(item){
        bibo += parseInt(item.price);
      });
      return bibo;
    };


/**
 * _calculateBonbu: 본부금 구하기(나이, 종별 감안) insu[ H: 건강보험, C: 자동차보험, .... ]######계산 공식이 바뀔 수도 있음
 * @caution: _RMSTATE(view state) change ->
 * @params: object    opts     @@@@{total:,itype:,age:,hasEx,patient:}
 * @return: integer   bonbu    본부금
 */
    var _calculateBonbu = function(opts) {
      var total = parseInt(opts.total) || 0;
      var itype = opts.itype || 'H';
      var age = parseInt(opts.age) || 64;
      var hasEx = parseInt(opts.hasEx) || 0;

      console.log('_calculateBonbu opts, total', opts, total);

      //@@@@@@@@@@@확인요...
      if (itype == '직장' || itype == '지역' || itype == '공교') {
        if (total < 1500) {
          return 0;
        } else if (total <= 15000 && age > 64) {
          return 1500;
        } else if (total <= 20000 && age > 64 && hasEx > 0){
          return 2100;
        } else {
          return Math.floor(total*0.3/100)*100; //100원 미만 절삭(floor:내림 / round:반올림 /ceil: 올림)
        }
      } else if (itype == '보호1' || itype == '보호2' || itype == '차상위1' || itype == '차상위2') {
        if (hasEx == 0) {
          return 1000;
        } else if (hasEx > 0) {
          return 1500;
        }
      } else if (itype == '차2장') {
        if (hasEx == 0) {
          return 250;
        } else if (hasEx > 0) {
          return 1250;
        }
      } else {
        return total;
      }

    };

  var _prmTxsData = function() {	//@@@@@@@@@@약속치료가 TXITEMS에 없는 경우... ERROR : Uncaught TypeError: Cannot read property 'name' of undefined
    var rs;
    var title = '';
    var items = [];
      $.ajax({
        //url: GLOBAL.get('_BASEURL') + 'API/chart/getPrmTxs',
        url: GLOBAL.get('_BASEURL') + 'getPrmTxs',
        type: 'get',
        async: false,
        //data: keyword,
        dataType: 'json',
        success: function(res) {
          //기본치료, 보험약1, 보험약2
          //setGroup
          //_getGroup = function(mommId)
          //_getMommData = function(mommId)
          //기본치료경혈, ...
          //기본치료투자, ...
          //기본치료...
          //BIGO2, BIGO5, ...
          //
          _.each(res, function(item) {
            if (item.Title != title) {
              title = item.Title;
              if (item.CLS == '기본치료') {
                var txItem = [_setTxItem({"mommId":item.Code})];
                items.push({title:title, txs:txItem});
              }/* else if (item.CLS == '보험약1' || item.CLS == '보험약2') {
                var txItem = [_setTxItem({"mommId":item.Code, "OPSC_AMT":item.CodeExp, "OPSC_DAY":item.CodeExp1})];
                items.push({title:title, txs:txItem});
              }*/

            } else {
              var tx = _.findWhere(items, {title:item.Title});

              if (item.CLS == '기본치료') {
                var txItem = _setTxItem({"mommId":item.Code});
                tx.txs.push(txItem);
              } else if (item.CLS == '보험약1' || item.CLS == '보험약2') {
                var txItem = _setTxItem({"mommId":item.Code, "OPSC_AMT":item.CodeExp, "OPSC_DAY":item.CodeExp1});
                tx.txs.push(txItem);
              } else if (item.CLS == '기본치료경혈') {
                var tx = _.findWhere(items, {title:item.Title});
                var txItem_ = _.findWhere(tx.txs, {group:'3'}); //@@@@@@@@
                txItem_.OPSC_BIGO2 = item.Code;
                //txAcu.OPSC_BLOD = _getAcus(item.Code);  //@@@@@@@@@@@@경혈코드로 경혈명(한글) 찾기!!!
                txItem_.OPSC_BLOD = '합곡/후계';  //@@@@@@@@@@@@경혈코드로 경혈명(한글) 찾기!!!
              } else if (item.CLS.search('자락관법이체') > -1) {  //기본치료 뒤의 글자로, group 찾고, BIGO2, BIGO5 결정후 변경
                var tx = _.findWhere(items, {title:item.Title});
                var txItem_ = _.findWhere(tx.txs, {group:'7'}); //@@@@@@@@
                txItem_.OPSC_BIGO5 = item.Code;
                /*
                안와/척추/관절/투자/비강/복강: 4 (item.Code.charCodeAt(0) > 64) OPSC_BIGO2
                자락관법이체: 7 (parseInt(item.Code) < 11) OPSC_BIGO5
                분구침: 5 OPSC_BIGO5
                자락도침외(자락/도침/산침/화침/사암/오행/체질): 3  OPSC_BIGO5
                */
                //var tx = _.findWhere(items, {title:item.Title});
              } else if (item.CLS.search('분구침') > -1) {
                var tx = _.findWhere(items, {title:item.Title});
                var txItem_ = _.findWhere(tx.txs, {group:'5'}); //@@@@@@@@
                txItem_.OPSC_BIGO5 = item.Code;
              } else if (item.CLS.search('자락도침외') > -1) {
                var tx = _.findWhere(items, {title:item.Title});
                var txItem_ = _.findWhere(tx.txs, {group:'3'}); //@@@@@@@@
                txItem_.OPSC_BIGO5 = item.Code;
              } else if (item.Code.charCodeAt(0) > 64) {
                var tx = _.findWhere(items, {title:item.Title});
                var txItem_ = _.findWhere(tx.txs, {group:'4'}); //@@@@@@@@
                txItem_.OPSC_BIGO2 = item.Code;
              }

            }
          });

        }
      });
    //return rs;
    //console.log('items', items);

    //items.push({title:title, txs:txItem});
    _.each(items, function(item){
      var fee = _calculateFee(item.txs, {});  //보험약 있는 경우, opts 항목(현재 차트 기준)
      item.total = fee.total;
      item.bonbu = fee.bonbu;
    });

    return items;
  };

  var _showPrmTxs = function(title, self) {
      var data = _prmTxsData();
      console.log('_showPrmTxsUI', data);
      $modal = MH.modal({title:title, body:_.template(prmTxsTpl)({data:data})});
      //console.log('response ', res);
      $modal.find('.modal-footer').remove();
      return $modal;
  };

  //var _prmTxsHandler = function($ui, self) {
  var _prmTxsHandler = function($ui, self) {

    $ui.find('.js-apply').on('click', function(e){
      e.stopPropagation();
      console.log('prmTxs apply!!!');
      //console.log('bodyView.collection', bodyView.collection.toJSON());
      //console.log('prmTxs apply items', $(e.target).parent().parent().find('.prmIxItems').html());
      _emptyTxs(bodyView.collection);
      $(e.target).parent().parent().find('.prmTxItems span').each(function(i){
        var tx = JSON.parse($(this).attr('mH-val'));
        var group = tx.group;
        tx = _.omit(tx, 'group');
        console.log(i, '-th tx', JSON.parse($(this).attr('mH-val')));
        bodyView.collection.get(group).set(tx);
        //bodyView.collection.get(group).render();
      });
      bodyView.calculateFee();

      //var items =
      //bodyView.collection.
      $ui.find('[data-dismiss="modal"]').trigger('click');
    });

  };

  var _setTxItem = function(opts) {
    var mommId = opts.mommId;
    var OPSC_AMT = opts.OPSC_AMT || 1.0;
    var OPSC_DAY = opts.OPSC_DAY || 1;
    var group = _getGroup(mommId);
    var myGroup = _.findWhere(txMain, {group:group});
    var gname = myGroup.name;

    var codeSet = _.findWhere(myGroup.txitems, {code:mommId});
                ////console.log('codeSet is', codeSet);
    var name = codeSet['name'];
    var price = codeSet['price'];
    var gasan = myGroup['gasan'];
                //this.set({OPSC_MOMM_ID:mommId, name:name, price:price, OPSC_BIGO5:'', OPSC_BIGO2:'', OPSC_BLOD:''});
                //this.set({name:name, price:price, OPSC_BIGO5:'', OPSC_BIGO2:'', OPSC_BLOD:''});
                //this.set({name:name, price:price, gasan:gasan, OPSC_ORDER:'--'});
    var txItem = {
                  group: group,
                  gname: gname,
                  OPSC_MOMM_ID:mommId,
                  OPSC_AMT: OPSC_AMT,
                  OPSC_DAY:OPSC_DAY,
                  OPSC_BIGO5: '',
                  OPSC_BIGO2: '',
                  OPSC_BLOD: '',
                  OPSC_ORDER: '',
                  //mommId_: null,
                  name:name,
                  gasan:gasan,
                  price:price
                };
    return txItem;
  }

  var _emptyTx = function(Tx) {
    console.log('emptyTx!!!');
    Tx.set({
            //OPSC_MOMM_ID: null,
            OPSC_MOMM_ID: '',
            OPSC_AMT: 1.0,
            OPSC_DAY: 1,
            OPSC_BIGO5: '',
            OPSC_BIGO2: '',
            OPSC_BLOD: '',
            OPSC_ORDER: '',
            //mommId_: null,
            name:'',
            gasan:1,
            price:0
          }); //@@@empty model
  };

  var _emptyTxs = function(Txs) {
    console.log('emptyTxs!!!');
    var group = _.pluck(txMain, 'group');
    for (var i=0;i<group.length;i++) {
      console.log(group[i], '-th group tx empty');
      _emptyTx(Txs.get(group[i]));
    }
    bodyView.calculateFee();
  };
////===========================================================================
//// OBJECTS
////===========================================================================
//-----------------------------------------------------------------------------
// OBJECTS:ChartTx
//-----------------------------------------------------------------------------
	var ChartTx = Backbone.Model.extend({
			idAttribute: 'group',

			defaults: {
				group: null,
				//group_: null,   //base Group
				OPSC_MOMM_ID: null,
				//mommId_: null,  //base mommId
				OPSC_AMT: 1.0,
				OPSC_DAY: 1,
				OPSC_BIGO5: '',
				OPSC_BIGO2: '',
				OPSC_BLOD: '',
				OPSC_ORDER: '--',
				name:'',
				//nick:'',
				//full:'',
				gasan:1,
				price:0
			},

			//fetch: 예전 데이터('_REFDATE'), save: 현재 데이터('_EDITDATE', '_LISTDATE')
			urlRoot: function() {
				//return GLOBAL.get('_BASEURL') + 'API/chart/ChartTxs/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE') + '/' + GLOBAL.get('_CURPTID');
				return GLOBAL.get('_BASEURL') + 'ChartTxs/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE') + '/' + GLOBAL.get('_CURPTID');
				//return GLOBAL.get('_BASEURL') + 'API/chart/ChartTxs/' + '20140416' + '/' + GLOBAL.get('_EDITDATE') + '/' + GLOBAL.get('_CURPTID');
			},

			parse: function(data) { //name, price 가져오기...
				////console.log('~~~~~~~~~data', data);
				/*@@@@@@@@@@@
				group: 할증에 의한 group 분기 / multi group / 제2침술 / 제2보험약
				할증에 대한 price 계산 분기: 계산식으로 대체(토요가산은??)
				multi group: group id -> group_# / UI 추가, 계산은 그대로(group)
				제2침술: UI 추가(how@@@@), 계산은 그대로
				제2보험약:  UI 추가, 계산은 그대로
				if ()
				*/
				var group = data.group;
				var mommId = data['OPSC_MOMM_ID'];

				if (group.indexOf('_')) {
					group = group.split('_')[0];
				}
				var myGroup = _.findWhere(txMain, {group:group});

				//get gasan
				data.gasan = myGroup['gasan'];

				//get name / price
				var codeSet = _.findWhere(myGroup.txitems, {code:mommId});
				////console.log('parse code is', codeSet);

				if (codeSet) {
					data.name = codeSet['name'];
					data.price = codeSet['price'];
				} else {
					var mommData = _getMommData(mommId);
					////console.log('mommData', mommData);
					data.name = mommData['name'];
					data.price = mommData['price'];
					//@@@@나이, 요일, 병원 등급별 분기 처리...
					////console.log('NOT defined OPSC_MOMM_ID!!! ask moonHani Call Center');
				}

			  return data;
			},

			initialize: function(){


			},
			// set 'OPSC_BIGO5', 'OPSC_BIGO2', 'OPSC_BLOD', 'name', 'price'
			setAttr: function(mommId) {
			//setAttr: function() {
				var group = this.get('group');
				//var mommId = this.get('OPSC_MOMM_ID');

				if (mommId) {
					////console.log('setAttr code exist!!!', mommId);
					var myGroup = _.findWhere(txMain, {group:group});

					var codeSet = _.findWhere(myGroup.txitems, {code:mommId});
					////console.log('codeSet is', codeSet);
					var name = codeSet['name'];
					var price = codeSet['price'];
          var gasan = myGroup['gasan'];
					//this.set({OPSC_MOMM_ID:mommId, name:name, price:price, OPSC_BIGO5:'', OPSC_BIGO2:'', OPSC_BLOD:''});
					//this.set({name:name, price:price, OPSC_BIGO5:'', OPSC_BIGO2:'', OPSC_BLOD:''});
					this.set({name:name, price:price, gasan:gasan, OPSC_ORDER:'--'});

					//Uncaught TypeError: Cannot read property 'subItems' of undefined
					var thisSub = _.findWhere(txSub, {mainCode:mommId});

					if (!thisSub) {
						this.set({OPSC_BIGO5:'', OPSC_BIGO2:'', OPSC_BLOD:''});
						this.set('OPSC_MOMM_ID', mommId);
						return;
					}


					if (thisSub) {
						var subItems = thisSub['subItems'];
						var subTypes = ['OPSC_BIGO5', 'OPSC_BIGO2', 'OPSC_BLOD'];

						if (subItems) {
							for(var i=0;i<subTypes.length;i++) {
								var subItem = subTypes[i];
								var subVal = subItems[0][subItem] || '';
								//console.log('subItem1', subItem, this.get(subItem), subVal);
								////console.log('subItems setAttr default...', subItem, subVal);
								this.set(subItem, subVal);
								//console.log('subItem2', subItem, this.get(subItem), subVal);
							}

						}

						this.set('OPSC_MOMM_ID', mommId);
					}

					//!!!OPSC_MOMM_ID를 마지막에 setting
					//this.listenTo(this.model, 'change:OPSC_MOMM_ID', this.changeMainTx);


				} else {
					//console.log('setAttr code not exist!!!');
					this.set({
						//OPSC_MOMM_ID: null,
						OPSC_MOMM_ID: '',
						OPSC_AMT: 1.0,
						OPSC_DAY: 1,
						OPSC_BIGO5: '',
						OPSC_BIGO2: '',
						OPSC_BLOD: '',
						OPSC_ORDER:'test',
						//mommId_: null,
						name:'',
						gasan:1,
						price:0
					});
				}

			},

			addSuffix: function(mommId, suffix) {
				if (mommId.length === 5) {
					return mommId + suffix + '';
				} else if (mommId.length === 8) {
					return mommId + suffix + 0;
				}
			},

			delSuffix: function(mommId, suffix) {
				if (mommId.length !== 8) {
					return false;
				}

				var suf = mommId.substr(5,3);
				var body = mommId.substr(0,5);
				var delta = suf - suffix

				if (delta == 0) {
					return body;
				} else {
					return body + delta + '';
				}
			},

			hasSuffix: function(mommId, suffix) {
				//mommId에 suffix를 붙일 수 있는지 확인
			},

			getSuffix: function(type) {
				if (GLOBAL.get('AGE') < 1) {
					return 100;
				} else if (GLOBAL.get('AGE') < 8) {
					return 800;
				}
				////time type은 collection에서 check or view에서 제어
				//type: age(100, 800) / time(010, 030, 050) / 경혈분기(2,4,6) 제2침술(7)
			},

		});

//-----------------------------------------------------------------------------
// OBJECTS:ChartTxs
//-----------------------------------------------------------------------------
	var ChartTxs = Backbone.Collection.extend({
			model: ChartTx,
			suffix: '', //할증 코드 저장@@@
			hasEx: 0,   //보험약 0: 없음, 1: 1개, 2: 2개

			url: function() {
				////console.log('url is!!!!!!!!!!!!!!!', GLOBAL.toJSON());
				//return GLOBAL.get('_BASEURL') + 'API/chart/ChartTxs/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE') + '/' + GLOBAL.get('_CURPTID');
				return GLOBAL.get('_BASEURL') + 'ChartTxs/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE') + '/' + GLOBAL.get('_CURPTID');
				//return GLOBAL.get('_BASEURL') + 'API/chart/ChartTxs/' + '20140416' + '/' + GLOBAL.get('_EDITDATE') + '/' + GLOBAL.get('_CURPTID');
			},

			parse: function(data) {
				////console.log('loaded data is', data);

				var arrGroup = [];
        //var len = data.length;
        var jin = {"OPSC_MOMM_ID":"10200","OPSC_ORDER":"재진진찰료","OPSC_BIGO2":"","OPSC_BLOD":"","OPSC_BIGO5":"","OPSC_AMT":"1.0","OPSC_DAY":"1"};


        var itype = '';
        var patient = bodyView.patient.toJSON();
        if (patient.ITYPE == '직장' || patient.ITYPE == '지역' || patient.ITYPE == '공교') {
          itype = '건보';
        }

        //초진 처리하는 case@@@@@@ 처음이거나 해녀, 4.3...@@@@@@@@@@ 한의원 사정에 따라 변경요
        if (patient.LAST > 40000 || (patient.LAST > 91 && (patient.JEJUCODE.length > 9 || itype != '건보'))) {
          jin = {"OPSC_MOMM_ID":"10100","OPSC_ORDER":"초진진찰료","OPSC_BIGO2":"","OPSC_BLOD":"","OPSC_BIGO5":"","OPSC_AMT":"1.0","OPSC_DAY":"1"};
        }

        console.log('this is parse area!! patient is ', GLOBAL.get('_CURPTID'), patient);
        data.push(jin);  ///@@@초진, 재진 삽입(API에서 진찰료를 제외하고 data fetch !!!)
				for(i in data) {
					//model group 설정(@@@추가된 group도 반환)
					data[i] = _setGroup(data[i], arrGroup);

					//@@@age, day에 의한 suffix 제거
					data[i].OPSC_MOMM_ID = _delSuffix(data[i].OPSC_MOMM_ID);

				}

				//@@@age, day에 의한 suffix 자동 생성(day suffix는 UI에 반영됨)
				//this.suffix = '';

				////console.log('collection is', data, arrGroup);
				//@@@arrGroup에서 '15'의 갯수를 찾아서 hasEx에 넣음!!!
				for(var i=0;i<arrGroup.length;i++) {
					if(arrGroup[i] == '15') {
						this.hasEx++;
					}
				}

				//console.log('this.hasEx ', this.hasEx);

				return data;
			},

			initialize: function() {
				//suffix가 변경되면 model들의 price만 변경 or true_id에 저장 -> calculateFee
				//save시에 OPSC_MOMM_ID 변경
				//_saveValidate(save시에는 OPSC_MOMM_ID값이 있는 항목들만 ajax)
				//this.listenTo(this.suffix, 'change', this.changeSuffix);
			},

			changeSuffix: function() {
				//age: 100, 600, 800 // day: 010, 030, 050
			},

			addSuffix: function(suffix) {
				var groups = [];
				switch(suffix) {
				case '010':
					//groups = ['0', '1', '3', '4', '5', '6', '7', '8'];
					groups = ['0']; //@@@@@@@@@@한의맥에서는 진찰료만 할증됨
					////console.log('addSuffix is called 1', groups);
					break;
				case '030':
					groups = ['0'];
					////console.log('addSuffix is called 1', groups);
					break;
				case '050':
					groups = ['0']; //@@@@@@@@@@한의맥에서는 진찰료만 할증됨
					//groups = ['0', '1', '3', '4', '5', '6', '7', '8'];
					////console.log('addSuffix is called 1', groups);
					break;
				default:
					groups = ['0'];
					////console.log('addSuffix is called 1', groups);
					break;
				}

				var self = this;

				//initPrice();	//@@@price 초기화
				_.each(['0', '1', '2', '3', '4', '7'], function(group){
					var model = self.get(group);
					var mommId = model.get('OPSC_MOMM_ID');
					if (mommId) {
						model.set('price', parseFloat(_getMommData(mommId)['price']));
					}
				});

				//delSuffix부터 실행시켜야 함!!!
				_.each(groups, function(group){
					//////console.log('addSuffix is called 2', self.get(group));
					var model = self.get(group);
					//////console.log('addSuffix is called 2 model', model.toJSON(), model.get('OPSC_MOMM_ID'));
					if (model.get('OPSC_MOMM_ID')) {
						//initPrice();
						var newMommId = _addSuffixOne(model.get('OPSC_MOMM_ID'), suffix);
						//model.set('newMommId', newMommId);
						////console.log('newMommId:', newMommId);
						if (suffix != '030') {
							model.set('price', parseFloat(_getMommData(newMommId)['price']));
						} else {	//@@@토요가산
							model.set('price', parseFloat(model.get('price')) + parseFloat(_getMommData(newMommId)['price']));
							////console.log('newMommId:', model.get('price'));
						}

					}

					//model.OPSC_MOMM_ID = _addSuffixOne(model.get('OPSC_MOMM_ID'), suffix);
					//model.parse();
				});

			},

			delSuffix: function(suffix) {
				var groups = [];
				switch(suffix) {
				case '010':
					groups = ['0', '1', '2', '3', '4'];
					////console.log('addSuffix is called 1', groups);
					break;
				case '030':
					groups = ['0'];
					////console.log('addSuffix is called 1', groups);
					break;
				case '050':
					groups = ['0', '1', '2', '3', '4', '7'];
					////console.log('addSuffix is called 1', groups);
					break;
				default:
					groups = ['0', '1', '2'];
					////console.log('addSuffix is called 1', groups);
					break;
				}

				var self = this;
				//initPrice();	//@@@price 초기화
				_.each(['0', '1', '2', '3', '4', '7'], function(group){
					var model = self.get(group);
					var mommId = model.get('OPSC_MOMM_ID');
					if (mommId) {
						model.set('price', parseFloat(_getMommData(mommId)['price']));
					}
				});

				//delSuffix부터 실행시켜야 함!!!
				_.each(groups, function(group){
					//////console.log('addSuffix is called 2', self.get(group));
					var model = self.get(group);
					//////console.log('addSuffix is called 2 model', model.toJSON(), model.get('OPSC_MOMM_ID'));
					if (model.get('OPSC_MOMM_ID')) {
						//model.set('OPSC_MOMM_ID', _addSuffixOne(model.get('OPSC_MOMM_ID'), suffix));
						//@@@age suffix 적용
						newMommId = _delSuffixOne(model.get('OPSC_MOMM_ID'), suffix);
						model.set('price', parseFloat(_getMommData(newMommId)['price']));
					}

					//model.OPSC_MOMM_ID = _addSuffixOne(model.get('OPSC_MOMM_ID'), suffix);
					//model.parse();
				});

			},

		});

//-----------------------------------------------------------------------------
// OBJECTS:ChartTxHeader
//-----------------------------------------------------------------------------
	var ChartTxHeader = Backbone.View.extend({

		initialize: function() {
			//this.render();
			//this.listenTo(this.model, 'change:_LISTDATE', this.reList);
			//this.listenTo(ChartTx.ChartTxs, 'add', this.fillStateNum);
      this.listenTo(GLOBAL, 'change:_SAVEDTX', this.saveAll);
		},

		render: function() {
      this.$el.empty();
      //this.$el.off();
			this.$el.append($(_.template(headerTpl)()));
			return this.$el;
		},

    reRender: function() {
      if (bodyView.patient) {
        var patient = bodyView.patient;
        console.log('_CURPTID, patient is ', GLOBAL.get('_CURPTID'), patient.toJSON());
        if (patient.get('SAVEDTX') == 0) {	//#################
          this.activeHeader();
          console.log('activeHeader');
        } else {
          this.passiveHeader();
          console.log('passiveHeader');
        }
      }
    },

		events: {
			'click .js-showSr': 'showSr',
			'click .js-showHs': 'showHs',
			'click .js-save': 'save',
			'click .glyphicon-folder-close': 'fold',
			'click .glyphicon-folder-open': 'unfold',
			'click .js-load': 'load',
			'click .js-edit': 'showPrmTxs',
      'click .glyphicon-minus-sign': 'emptyTxs',

		},

		showSr: function(e) {
			////console.log('showSr....!!!!!!!!!!!', bodyView.collection.toJSON());
		},

		showHs: function(e) {
			////console.log('showHs....!!!!!!!!!!!', bodyView.collection.toJSON());

		},

		save: function(e) {
			//@@@@@@@@조제료만 들어가는 경우있음!!!!
			////console.log('save chartTxs....!!!!!!!!!!!');
			//빈 MOMM_ID model 제거, suffix 적용@@@, 경고 메시지(물치, 습부, 제2특수침, ...)
			var items = [];
			var temps = bodyView.collection.toJSON();
			//console.log('temps', temps);
			//var seq = 1;
			_.each(temps, function(item){
				//console.log('item is ', item);
				if (item.OPSC_MOMM_ID) {
					//_item = _.omit(item, ['group', 'gasan', 'name', 'price', 'OPSC_ORDER']);
					_item = _.omit(item, ['gasan', 'name']);
					//item.seq = seq++;
					items.push(_item);
				}
			});

			//console.log('items is!!!!', items);

			var data = {
				items: items,
				attached: {
					MEDM: GLOBAL.get('_MEDM'),  //
					GWAM: GLOBAL.get('_GWAM'), //진료과목?
					FDOC: GLOBAL.get('_FDOC'),	//
					LDOC: GLOBAL.get('_LDOC')	//
				}

			};

			$.ajax({
				//url: GLOBAL.get('_BASEURL') + 'API/chart/ChartTxs/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE')+ '/' + GLOBAL.get('_CURPTID'),
				url: GLOBAL.get('_BASEURL') + 'ChartTxs/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE')+ '/' + GLOBAL.get('_CURPTID'),
				type: 'POST',
				data: data,
				async: false,
				//dataType: 'json',
				success: function(res) {
					//
				}
			});
      //@@@@예상 진료비 저장("CHARTED":{TOTAL:1000,BIBO:1120,BONBU:1110})
			//save({SAVETX:1}, {patch:true})
      ////@@@환자정보 갱신
      //var patient = Patient.Patients.get(GLOBAL.get('_CURPTID'));
      var patient = bodyView.patient;
      //var itype =
      var opts = {"hasEx":bodyView.collection.hasEx,
                "age":patient.get('AGE'),
                "itype":patient.get('ITYPE'),
                "jeju":patient.get('JEJUCODE')}; //@@JEJUCODE or JEJU??
      var objFee = _calculateFee(bodyView.collection.toJSON(), opts); //function(jsonArr, opts)
      var added = {};
      if (bodyView.collection.hasEx) {
        console.log('Ex, added is ', bodyView.collection.get('15').get('name'), added);
        added = {"EX":bodyView.collection.get('15').get('name')}
      }
      //bodyView.collection.
      //var added =  {"EX":"", "BIBO":"[]"};  //@@@@@@@@@@@
      var charted = _.extend(objFee, added);
      console.log('charted', charted, opts);
      //patient.save({"CHARTID":patient.get('CHARTID') , "SAVEDTX":1, "CHARTED":'{TOTAL:1000,BIBO:1120,BONBU:1110}'}, {patch:true});
      //patient.save({"CHARTID":patient.get('CHARTID') , "SAVEDTX":1, "CHARTED":JSON.stringify(charted)}, {patch:true});  //#################
      patient.save({"CHARTID":patient.get('CHARTID') , "SAVEDTX":1, "CHARTED":charted}, {patch:true});  //#################@@@@@@
      GLOBAL.set('_SAVEDTX', 1);
		},

    saveAll: function(e) {
      if (GLOBAL.get('_SAVEDTX') == 1) {
        this.passiveHeader();
        return;
      } else if (GLOBAL.get('_SAVEDTX') == 0) {
        return;
      }

      this.save();
      console.log('chartTx is saved now!!!');
      //GLOBAL.set('_SAVEDTX', 1);
      //GLOBAL.set('_SAVEDTX', -2); //특이사항에 보험약/비보험 저장
    },


    activeHeader: function() {
      this.$el.parent().parent().removeClass('passive');
      //this.$el.find('.glyphicon-folder-open').trigger('click');
    },

    passiveHeader: function() {
      this.$el.parent().parent().addClass('passive');
      //this.$el.find('.glyphicon-folder-close').trigger('click');
    },

		fold: function(e) {
			e.preventDefault();
			e.stopPropagation();
			////console.log('foldBody~~~~~~~~~~~~~~');
			$panel.find('.panel-body').addClass('hide');
			////console.log('span....', $(e.target));
			//$(e.target).removeClass('js-foldBody').addClass('js-unfoldBody');
			$(e.target).removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');
			//$(e.target).children('span').hM_toggleIcon('glyphicon-folder-close', 'glyphicon-folder-open');
			//this.trigger('chart:searchTx');
		},

		unfold: function(e) {
			e.preventDefault();
			e.stopPropagation();
			$panel.find('.panel-body').removeClass('hide');
			$(e.target).removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
		},

		load: function(e) {
			$panel.find('[class^="OPSC_"]').prop('disabled', false);
			//console.log('load....!!!!!!!!!!!', bodyView.collection.toJSON());
		},

    emptyTxs: function(e) {
      console.log('Every Txs models is destroyed');
      _emptyTxs(bodyView.collection);
      //bodyview.collection.
      //bodyview.collection.reset();
      //destroy models@@@@@@@@@@
      //$panel.find('[class^="OPSC_"]').prop('disabled', false);
      //console.log('load....!!!!!!!!!!!', bodyView.collection.toJSON());
    },

    showPrmTxs: function(e) {
      console.log('showPrmTxs!!!');

      //_prmTxsHandler();
      //$modal = _showTakePhoto('사진 찍기(' + this.model.get('NAME') + ')', this);
      $modal = _showPrmTxs('약속 상병', this);
      //console.log('showPrmTxs', $modal);
      _prmTxsHandler($modal, this);
    },

	});

//-----------------------------------------------------------------------------
// OBJECTS:ChartTxItem
//-----------------------------------------------------------------------------
	ChartTxItem = Backbone.View.extend({
		el: function() {
      var $thisEl = $('#chartTx').find('[mH-group="' + this.model.get('group') + '"]');
      $thisEl.off()
			return $thisEl;
		},

		initialize: function(){ //model change => render
			//this.model.on('change', this.render, this);
			//this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'change:OPSC_BLOD', this.changeBLOD);   //@@@
			//this.listenTo(this.model, 'change:OPSC_MOMM_ID', this.changeMainTx);
      this.listenTo(this.model, 'change:OPSC_MOMM_ID', this.render);
			//this.listenTo(this.model, 'change:OPSC_DAY', this.changeMainTx);
			this.listenTo(this.model, 'destroy', this.close);
		},

		render: function() {
			var data = this.model.toJSON();
      //this.$el.unbind();
      console.log('ChartTxItem rendering!!!!!!!!!');
      //this.$el.remove();

      //this.$el.empty
			//OPSC_MOMM_ID : 주항목
			//if select box : val(), selected
			//주치료 항목 변경 -> trigger(없이??) -> 부치료 항목 변경
			for(var key in data) {
				this.$el.find('.' + key).val(data[key]);
			}

			//if (data['OPSC_MOMM_ID']) {
				this.$el.find('.OPSC_MOMM_ID').val(data.OPSC_MOMM_ID);
				this.changeMainTx();
			//}

			//BIBO5 외 항목:
			//

			//this.createSubTxUI(subData);

			//부치료 항목
			//this.$el.find('.OPSC_MOMM_ID').trigger('_change'); // _change: user event 가능??[model 변경하지 않도록]
			//this.$el = $('body').find('#Ix_' + data.seq).end();
			//////console.log('this.$el', this.$el);

		},

		events: {
			'change .OPSC_MOMM_ID': 'changeMainTxUI', //주치료 항목 변경
			//'change .OPSC_MOMM_ID': '_changeMainTxUI', //주치료 항목 변경
			'change select.OPSC_BIGO5': 'changeSubTxUI',  //부치료 항목 변경
			'change select.OPSC_BIGO2': 'changeSubTxUI',  //부치료 항목 변경

			'click #js-restoreAcus': 'restoreAcus',   //경혈 내용 복원

			'change .EX1': 'changeEx',	//보험약 변경
			'change .OPSC_AMT': 'changeExAmt',  //
			'change .OPSC_DAY': 'changeExDay',
			//'remove .OPSC_BIGO5': 'destoryTxSub',  //부치료 항목 변경
			//'change .OPSC_BIGO2': 'changeTxAcu',  //경혈코드 변경
			'change .OPSC_BIGO2': 'changeTxAcu',  //경혈코드 변경
			//'click #txFee #js-showCurrentTx': 'showCurTx',

			'keypress input[type="text"].OPSC_BLOD': 'searchAcu',
			//'blur input[type="text"].OPSC_BLOD': 'searchAcu',	//@@@@@@@@@ notClose와 충돌???
			'click .mH-dropdown-close': 'selAcuClose',  //dropdown@@@@
			'change .dropdown-menu span input:checkbox': 'changeSelAcu',
			//'click .closeDown': 'closeDown',
			'click .dropdown-menu span': 'notClose',  ////dropdown 없어지지 않도록 함!!!
			//'change .dropdown-menu span input:checkbox': 'updateAcu',

			'change #js-checkJoje': 'changeJoje',
			'click #js-promiseAcu': 'promiseAcu'
		},

		close: function(e) {
			e.preventDefault();
			e.stopPropagation();
			console.log('model destroyed');
			//this.$el.remove();
			//this.$el.find('input').val('');
      //this.$el.find('select').val('');
      this.$el.find('.OPSC_MOMM_ID').val('');
      this.$el.off();
		},

		changeMainTxUI: function(e) {
			e.preventDefault();
			e.stopPropagation();

			//////console.log('changeMainTxUI@@@@@@@@@@@@@', $(e.target).val());
			//this.model.set({OPSC_MOMM_ID:$(e.target).val()});  //@@@부항목들은 default 값으로 세팅??
			//price, gasan, name 변경
			this.model.setAttr($(e.target).val());

			//open sub selectbox
			////console.log('this.model.toJSON()', this.model.toJSON());
			bodyView.calculateFee();
		},

		changeMainTx: function() {
			$mainUI = this.$el.find('.OPSC_MOMM_ID');
			//open sub selectbox
			if (!this.model.get('OPSC_MOMM_ID')) { //empty tx@@@@@@@@@
        $mainUI.val('');
				$mainUI.removeClass('active');
				this._deleteSubTxUI();
			} else {
				$mainUI.addClass('active');
				var sub = _.findWhere(txSub, {mainCode:this.model.get('OPSC_MOMM_ID')});

				if (sub) {
					$subUI = this.createSubTxUI(sub.subItems);	//@@@@@@@@@
					var type = $subUI.attr('class');
					//console.log('subUI type is....', type);
					this.changeSubTx(type);
				} else {
					this._deleteSubTxUI();
				}
			}

			////console.log('changeMainTx param', this.model.get('OPSC_MOMM_ID'));
		},

		changeSubTxUI: function(e) {
			e.preventDefault();
			e.stopPropagation();
			//////console.log('changeSubTxUI!!!!', $(e.target).val());
			var type = $(e.target).attr('class');
			if (type == 'OPSC_BIGO5') {
				this.model.set({OPSC_BIGO5:$(e.target).val()});
			} else {	//특수침
				this.model.set({OPSC_BIGO2:$(e.target).val()});
				this.model.set({OPSC_BLOD:$(e.target).children(':selected').text()});
			}

			//this.changeBIGO5();
			this.changeSubTx(type);
			/*
			if (this.model.get('OPSC_BIGO5')) {
				this.$el.find('.OPSC_BIGO5').addClass('active');
			} else {
				this.$el.find('.OPSC_BIGO5').removeClass('active');
			}
			*/
			//open sub selectbox
			////console.log('this.model.toJSON()', this.model.toJSON());
		},

		changeSubTx: function(type) {
			//console.log('changeSubTx', type, this.model.toJSON(), this.model.get(type));
			if (this.model.get(type)) { //setAttr() 적용 이전에 실행됨@@@@@@@@값이 "0"인 경우는??@@@@@
				//console.log('UI activate!!!!!', type, this.model.get(type));
				this.$el.find('.' + type).val(this.model.get(type));
				this.$el.find('.' + type).addClass('active');
			} else {
				this.$el.find('.' + type).removeClass('active');
			}
		},

		createSubTxUI: function(data) {
			//var type = BIGO5(code: 0, 1, ...) / BIGO2(code: ST025, ... 경혈코드);
			if (data[0]['OPSC_BIGO2']) {
				//console.log("data[0]['OPSC_BIGO2']", data[0]['OPSC_BIGO2']);
				var type = 'OPSC_BIGO2';
				$tpl = $(_.template(subBIGO2Tpl)({data:data}));
			} else {	//data[0]['OPSC_BIGO5']는 "0"일 수도 있어서@@@@
				//console.log("data[0]['OPSC_BIGO5']", data[0]['OPSC_BIGO5']);
				var type = 'OPSC_BIGO5';
				$tpl = $(_.template(subBIGO5Tpl)({data:data}));
			}

			if (this.$el.find('.' + type)) {
				this.$el.find('.' + type).remove();
			}

			this.$el.find('.OPSC_MOMM_ID').after($tpl);
			return $tpl;
		},

		_deleteSubTxUI: function() {
			//this.$el.find('.OPSC_BIGO5').remove();
			this.$el.find('select.OPSC_BIGO5').remove();
			this.$el.find('select.OPSC_BIGO2').remove();
		},


		changeEx: function(e) {
			//console.log('changeEx', $(e.target).val());
			var $amt = this.$el.find('.OPSC_AMT');
			var $day = this.$el.find('.OPSC_DAY');

			if (!this.model.previous('OPSC_MOMM_ID')) {
				bodyView.collection.hasEx++;	//@@@없다가 생긴 경우는?? previous...
				this.model.set({'OPSC_AMT':$amt.val(), 'OPSC_DAY':$day.val()});
				$amt.addClass('active');
				$day.addClass('active');
				//console.log('bodyView.collection.hasEx', bodyView.collection.hasEx);
			} else if (!$(e.target).val()) {
				bodyView.collection.hasEx--;	//있다가 없어진 경우
				$amt.val('1.0').removeClass('active');
				$day.val('1').removeClass('active');
				//console.log('bodyView.collection.hasEx', bodyView.collection.hasEx);
			}

			this.$el.find('#js-checkJoje').trigger('change');   //조제료 추가, 삭제
			bodyView.calculateFee();
		},

		changeBLOD: function() {
			////console.log('changeBLOD', this.model.toJSON());
			this.$el.find('input.OPSC_BIGO2').val(this.model.get('OPSC_BIGO2'));
			this.$el.find('input.OPSC_BLOD').val(this.model.get('OPSC_BLOD'));
		},

		restoreAcus: function(e) {
			//console.log('restoreAcus', this.model.previousAttributes(), this.model.previous('OPSC_BLOD'), this.model.previous('OPSC_BIGO2'), this.model.toJSON());
			//this.$el.find('.OPSC_BIGO2').val(this.model.get('OPSC_BIGO2'));
			//this.$el.find('.OPSC_BLOD').val(this.model.get('OPSC_BLOD'));
		},

		changeExAmt: function(e) {
			if (!this.model.get('OPSC_MOMM_ID')) {
				return;
			}
			this.model.set('OPSC_AMT', $(e.target).val());
			bodyView.calculateFee();
		},

		changeExDay: function(e) {
			if (!this.model.get('OPSC_MOMM_ID')) {
				return;
			}
			this.model.set('OPSC_DAY', $(e.target).val());
			//joje료 변경#############
			//bodyView.getJojeId($(e.target).val());
			//bodyView.change
			this.$el.find('#js-checkJoje').trigger('change');
			bodyView.calculateFee();
			//console.log('changeExDay!!!!', this.$el.find('#js-checkJoje'));
		},

		changeJoje: function(e) {
			//console.log('조제료 항목 클릭');
			if (!bodyView.collection.hasEx) {
				bodyView.collection.get('2').setAttr('');
				//bodyView.calculateFee();
				return;
			}

			if ($(e.target).is(':checked')) {
				//조제항목 제거(group, gasan외 속성 모두 제거)
				//this.collection.get('2').set({OPSC_MOMM_ID:'', price:'', name:''});
				//this.collection.get('2').set({OPSC_MOMM_ID:''}).setAttr();
				bodyView.collection.get('2').setAttr('');
				//console.log('조제료 항목', bodyView.collection.get('2').toJSON());
				bodyView.calculateFee();
			} else {
				//조제항목 생성(OPSC_DAY -> 조제료 생성)##########
				//this.collection.get('2').set({OPSC_MOMM_ID:'30010'});   //테스트
				if (!bodyView.collection.get('15').get('OPSC_MOMM_ID')) {
					bodyView.collection.get('2').setAttr('');
					return;
				} else {
					var day = parseInt(this.model.get('OPSC_DAY'));
					if (day < 16) { //처방일수별 분기####
						var mommId = (30000 + day*10).toString();
					} else if (day < 31) {
						var mommId = '30160';
					} else if (day < 61) {
						var mommId = '30180';
					} else {
						var mommId = '30190';
					}

					bodyView.collection.get('2').setAttr(mommId);
				}

				//console.log('조제료 항목', bodyView.collection.get('2').toJSON());
				bodyView.calculateFee();
			}
		},

		searchAcu: function(e) {
			////console.log('searchAcu', $(e.target).val());

			if (e.keyCode == 13 || e.keyCode == undefined) {	//!!!for blur event : e.keyCode == undefined
				//e.preventDefault();
				e.stopPropagation();
				this.updSrhAcus(e);
        console.log('searchAcu from enter key!!!!!!!!!!!', e.keyCode);
			}

			//getDelAcus(this.model, $(e.target).val());  //OPSC_BLOD: 한글경혈명, OPSC_BIGO2: 경혈코드
			//getAddAcus(this.model, $(e.target).val());
		},

		updSrhAcus: function(e) {
      console.log('updSrhAcus', $(e.target).val());
			var acus = $(e.target).val();

			var oldAcuNames = this.model.get('OPSC_BLOD').split('/');
			//var oldAcuCodes = this.model.get('OPSC_BIGO2').substring(-1).split('/');  //끝에 있는 '/' 제거
			var oldAcuCodes = this.model.get('OPSC_BIGO2').split('/');  //끝에 있는 '/' 제거
			var newAcuNames = acus.split('/');

			for (var i=0;i<oldAcuNames.length;i++) {
				if (_.indexOf(newAcuNames, oldAcuNames[i]) == -1) {
					//oldAcuNames[i] = 'del';
					oldAcuCodes[i] = 'del';
				}
			}

			//@@@@@@@@del된 경혈 코드 찾기!!!
			//var oldAcuCodes = this.model.get('OPSC_BIGO2').split('/');
			//var newAcuCodes = acus.split('/');
			//var delAcus = _.difference(oldAcus, newAcus);
			//var addAcus = _.difference(newAcus, oldAcus).join('/');
			var strAcuNames = _.intersection(oldAcuNames, newAcuNames).join('/');
			//strAcuNames = _.without(oldAcuNames, 'del');
			var strAcuCodes = _.without(oldAcuCodes, 'del').join('/');

			//console.log('strAcuNames, strAcuCodes 1', strAcuNames, strAcuCodes);

			//UI에서 혈명이 아닌 것들 제거
			$(e.target).val(strAcuNames);

			var data = {term:_.difference(newAcuNames, oldAcuNames).join('/')};
			var rs = '';
			$.ajax({
				//url: GLOBAL.get('_BASEURL') + 'API/chart/getAcuCodes/' + term,
				//url: GLOBAL.get('_BASEURL') + 'API/chart/getAcuCodes',
				url: GLOBAL.get('_BASEURL') + 'getAcuCodes',
				//type: 'GET',
				type: 'POST',
				data: data,
				async: false,
				dataType: 'json',
				success: function(res) {
					rs = res;
				}
			});

			//console.log('rs.Acu1, rs.Acu2', rs.Acu1, rs.Acu2);

			//var strAcus_ = oldAcuNames.join('')
			if (rs.Acu1.length) {
				////console.log('단일혈', rs.Acu1);
				_.each(rs.Acu1, function(acu){
					strAcuNames += '/' + acu.name;
					strAcuCodes += '/' + acu.code;
					//oldAcuNames.push(acu.name);
					//oldAcuCodes.push(acu.code);
				});
				//acus_ + '/' + rs.Acu1
				//console.log('단일혈', strAcuNames, strAcuCodes);

			}

			//model set
			this.model.set({OPSC_BIGO2:(strAcuCodes  + '/').replace(/\/\//gi, '/'), OPSC_BLOD:strAcuNames.replace(/\/\//gi, '/')});

			if (rs.Acu2.length) {
				//console.log('동명 이혈', rs.Acu2);
				//acus_ + '/' + rs.Acu1
				this.$el.find('.dropdown-menu').remove();
				this.$el.find('style').remove();
				this.$el.find('.dropdown').append($(_.template(selAcuTpl)({items:rs.Acu2})));
				this.$el.find('.dropdown-toggle').trigger( "click" );
			}

			//console.log('getAcuCodes', rs);
		},

		changeSelAcu: function(e) {
			console.log('changeSelAcu', $(e.target).is(':checked'), $(e.target).attr('mH-name'));
			if ($(e.target).is(':checked')) {
				var strAcuNames = this.model.get('OPSC_BLOD') + '/' + $(e.target).attr('mH-name');
				var strAcuCodes= this.model.get('OPSC_BIGO2') + $(e.target).attr('mH-code');
				this.model.set({OPSC_BIGO2:(strAcuCodes  + '/').replace(/\/\//gi, '/'), OPSC_BLOD:strAcuNames.replace(/\/\//gi, '/')});
			}
		},

		notClose: function(e){  //dropdown 없어지지 않도록 함!!!
			//e.preventDefault();
      console.log('notClose is called');
			e.stopPropagation();
			//console.log('not Close');
		},

/*
		changeBIGO5: function() {
			////console.log('changeBIGO5', this.model.get('OPSC_BIGO5'));
			if (this.model.get('OPSC_BIGO5')) {
				this.$el.find('.OPSC_BIGO5').addClass('active');
			} else {
				this.$el.find('.OPSC_BIGO5').removeClass('active');
			}
		},
*/
  });

//-----------------------------------------------------------------------------
// OBJECTS:ChartTxBody
//-----------------------------------------------------------------------------
	var ChartTxBody = Backbone.View.extend({

		initialize: function() {
			////console.log('ChartTxBody initialize!!!!!!!', GLOBAL.get('_CURPTID'));
			//this.listenTo(GLOBAL, 'change:_CURPTID', this.render);
			this.listenTo(GLOBAL, 'change:_CURPTID', this.changeId);
			this.listenTo(this.collection, 'add', this.addOne);
			//this.listenTo(this.collection, 'change:suffix', this.changeSuffix);

		},

		preRender: function() {
			////console.log('ChartTxBody preRender');
      ///txMain에서 load해서 그려넣기@@@@@@@@@@@@@@@@ 특히 보험약, 비보험
      this.$el.empty();
      //this.$el.off();
			this.$el.append($(_.template(bodyTpl)()));

			$panel = MH.panel(panelOpts);
			//$panel.find('.panel-heading').empty().append(new ChartTxHeader().render());
      $panel.find('.panel-heading').empty().append(headView.render());
			$panel.find('.panel-body').empty().append(this.$el);

      //보험약1 preRender
      this.$el.find('.EX1').empty();
      items = _.findWhere(txMain, {"group":"15"}).txitems;  //@@@앞에 var 를 붙이면 안됨!!!
      //console.log('보험약 items ', items, items[0], _.template(optionsTpl)(items));
      this.$el.find('.EX1').html(_.template(optionsTpl)(items));
      //for (txMain)
      //EX1

      //보험약2 preRender
      this.$el.find('.EX2').empty();
      items = _.findWhere(txMain, {"group":"15"}).txitems;  //@@@앞에 var 를 붙이면 안됨!!!
      _.each(items, function(item){
        if (item.code.charAt(0) != '6') { //@@@code.charAt(0) != '6'인 것(임의, 가감 처방) 제외!!!
          console.log('find it', item);
          items = _.without(items, item);
        }
      });
      //console.log('보험약 items ', items, items[0], _.template(optionsTpl)(items));
      this.$el.find('.EX2').html(_.template(optionsTpl)(items));

      //비보험 preRender
      this.$el.find('[mH-group="77"]').find('select').empty();
      items = _.findWhere(txMain, {"group":"77"}).txitems;  //@@@앞에 var 를 붙이면 안됨!!!
      //console.log('보험약 items ', items, items[0], _.template(optionsTpl)(items));
      this.$el.find('[mH-group="77"]').find('select').html(_.template(optionsTpl)(items));
      //for (txMain)

		},

		render: function() {
			////console.log('ChartTx render called');
			this.collection.forEach(this.addOne, this);
			//보험약 amt, day activate
			if (this.collection.hasEx == 1) {   //보험약 @@@@@@@@@@@
				this.$el.find('[mH-group="15"] .OPSC_AMT').addClass('active');
				this.$el.find('[mH-group="15"] .OPSC_DAY').addClass('active');
				//조제료 제외 checkbox update @@@@@@@@@@@
				if (!this.collection.get('2').get('OPSC_MOMM_ID')) {
				   this.$el.find('#js-checkJoje').prop('checked', true);
				}
			} else if (this.collection.hasEx == 2) {
				this.$el.find('.OPSC_AMT').addClass('active');
				this.$el.find('.OPSC_DAY').addClass('active');
				//조제료 제외 checkbox update @@@@@@@@@@@
				if (!this.collection.get('2').get('OPSC_MOMM_ID')) {
				   this.$el.find('#js-checkJoje').prop('checked', true);
				}
			}
			//할증 checkbox false
			this.$el.find('.dayExtra').prop('checked', false);

		},

		addOne: function(item) {
			console.log('ChartTx addOne called', item.toJSON());
			//this.$el.append(new PatientListItem({model:patient}).render().el);
			//new ChartTxItem({model:item}).render();
      //new ChartTxItem({model:item}).render();
      //if (this.)
      this.itemView = new ChartTxItem({model:item}).render();
		},

		changeId: function() {
			////console.log('chartTX changeId......');
			if (GLOBAL.get('_CURPTID')) {
        this.patient = Patient.Patients.get(GLOBAL.get('_CURPTID'));  //@@@@@@@patient 변수로 지정
				//fetch()
				//set
				this.collection = new ChartTxs();
				this.collection.fetch({async:false});
				this.blankTxs();
				//this.collection.setGroup(); //txgrouping!!!
				//this.collection.forEach(this.addOne, this);
				////console.log('chartTX changeId!!!!!', this.collection.toJSON());
				this.render();
				this.calculateFee();

        headView.reRender();
			}
		},

		blankTxs: function() {
			var group = _.pluck(txMain, 'group');
			//console.log('blankTxs!!! this.collection.get(group[i])', this.collection.get("0").toJSON());
			for (var i=0;i<group.length;i++) {
				//if (!this.collection.get(group[i]) || !this.collection.get(group[i]).get('OPSC_MOMM_ID')) {
				if (!this.collection.get(group[i])) {
				   this.collection.add({group:group[i]});
				}
			}

		},

		changeSuffix: function() {
			//@@@
		},

		events: {
			'click #js-showCurTxs': 'showCurTxs',
			'change .dayExtra': 'changeDayExtra',
			'click #js-showPrmAcus': 'showPrmAcus',
			//'change #js-checkJoje': 'checkJoje',
			//'click #js-restoreAcus': 'restoreAcus',
			//'click .dayExtra': 'changeDayExtra',
		},


/*
		changeMainTxUI: function(e) {
		  ////console.log('changeMainTxUI', $(e.target).val());
		}
*/
		changeDayExtra: function(e) {
			//////console.log('changeDayExtra', $(e.target).val(), $(e.target).is(":checked"));
			$(e.target).siblings().prop('checked', false);
			this.collection.suffix = $(e.target).val();

			if ($(e.target).is(":checked")) {
				this.collection.addSuffix($(e.target).val());
			} else {
				this.collection.delSuffix($(e.target).val());
			}

			////console.log('suffix', this.collection.suffix);
			////console.log('suffix', this.collection);
			this.calculateFee();
			//addSuffix($(e.target).val());
		},

		showPrmAcus: function(e) {  //################
			//var self = this;
			var group = 3;	//@@@group 구하기
			var model = this.collection.get(group);
			//////console.log('model', this.collection.toJSON());

			////console.log('showPrmAcus');
			var strHtml = _.template(prmAcusTpl)({items:this._getPrmAcus()});
			$modal = MH.modal({title:'약속 경혈', body:strHtml});
			$modal.find('.js-insertAcu').on('click', function(e){
				e.preventDefault();
				e.stopPropagation();

				//////console.log('js-insertAcu clicked', $(this).parent().siblings('.ASK_NAME').text());
				model.set('OPSC_BIGO2', $(this).parent().siblings('.ASK_NAME').text()); //@@@BLOD보다 먼저 나와야!!! changeBLOD를 이용하는 경우
				model.set('OPSC_BLOD', $(this).parent().siblings('.BLOD_HNAME').text());
				////console.log('model', model.toJSON());
				/*
				bodyView.model.set({OSSC_PF:$(this).parent().parent().find(".OSSC_PF").text()});
				bodyView.model.trigger('change');
				bodyView.render();
				////console.log('bodyView.model.toJSON()', bodyView.model.toJSON());
				*/
        $modal.find('[data-dismiss="modal"]').trigger('click');
			});
			//js-insertAcu
		},

		checkJoje: function(e) {
			//console.log('조제료 항목 클릭');
			if (!this.collection.hasEx) {
				return;
			}
			if ($(e.target).is(":checked")) {
				//조제항목 제거(group, gasan외 속성 모두 제거)
				//this.collection.get('2').set({OPSC_MOMM_ID:'', price:'', name:''});
				//this.collection.get('2').set({OPSC_MOMM_ID:''}).setAttr();
				this.collection.get('2').setAttr('');
				//console.log('조제료 항목', this.collection.get('2').toJSON());
				this.calculateFee();
			} else {
				//조제항목 생성(OPSC_DAY -> 조제료 생성)##########
				//this.collection.get('2').set({OPSC_MOMM_ID:'30010'});   //테스트
				var mommId = '30010';
				this.collection.get('2').setAttr(mommId);
				//console.log('조제료 항목', this.collection.get('2').toJSON());
				this.calculateFee();
			}
		},

		//blank Txs 제거된 collection
		_getFilledTxs: function() {
			return _.filter(this.collection.toJSON(), function(item){ return item.OPSC_MOMM_ID; });
		},

		_getPrmAcus: function() {
			//return _.filter(this.collection.toJSON(), function(item){ return item.OPSC_MOMM_ID; });
			var rs = '';
			$.ajax({
				//url: GLOBAL.get('_BASEURL') + 'API/chart/getPrmAcus',
				url: GLOBAL.get('_BASEURL') + 'getPrmAcus',
				type: 'GET',
				async: false,
				dataType: 'json',
				success: function(res) {
					////console.log('_getPrmAcus', res);
					rs = res;
				}
			});
			return rs;
		},

		showCurTxs: function() {
			//////console.log('clicked showCurTxs', this._getFilledTxs());
			var strHtml = _.template(curTxsTpl)({items:this._getFilledTxs()});
			MH.modal({title:'치료항목 보기', body:strHtml});
		},

		calculateFee: function(options){
      var patient = bodyView.patient;
      //var itype =
      var opts = {"hasEx":this.collection.hasEx,
                "age":patient.get('AGE'),
                "itype":patient.get('ITYPE'),
                "jeju":patient.get('JEJUCODE')}; //@@JEJUCODE or JEJU??
      //var opts = {"hasEx":0,"age":0,"itype":"건보","jeju":""};
      var objFee = _calculateFee(this.collection.toJSON(), opts);

      this.$el.find('#feeTotal').text(hM_formatNum(objFee.total));
      this.$el.find('#feeBonbu').text(hM_formatNum(objFee.bonbu));
      this.$el.find('#feeChungu').text(hM_formatNum(objFee.chungu));
      this.$el.find('#feeBibo').text(hM_formatNum(objFee.bibo));
      this.$el.find('#feeSunab').text(hM_formatNum(objFee.sunab));
		}

	});

//-----------------------------------------------------------------------------
// INSTANCES
//-----------------------------------------------------------------------------
	var headView = new ChartTxHeader();
	var bodyView = new ChartTxBody({collection: new ChartTxs()});

//-----------------------------------------------------------------------------
// RETURN
//-----------------------------------------------------------------------------
	return {
		headView: headView,
		bodyView: bodyView
	}

});
