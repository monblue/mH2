//////************************************************************************
////// 이름:    Global.js
////// 기능:    moonHani Chart Router Module
//////************************************************************************
define(function (require) {
  "use strict";
////===========================================================================
//// requires
////===========================================================================
//-----------------------------------------------------------------------------
// requires: libraries
//-----------------------------------------------------------------------------
  var $           = require('jquery');
  var _           = require('underscore');
  var Backbone      = require('backbone');
  var MH          = require('MH_utils');
  var GLOBAL        = require('share/Global');
//-----------------------------------------------------------------------------
// requires: templates
//-----------------------------------------------------------------------------
  var tpl         = require('text!share_tpl/Login.html');
////===========================================================================
//// private properties
////===========================================================================
  var template      = _.template(tpl);
////===========================================================================
//// private methods
////===========================================================================

////===========================================================================
//// OBJECTS
////===========================================================================
  var Login = Backbone.View.extend({

    render: function() {
      console.log('not logined');

      MH._loadModal();
      ////modal setting
      this.$el.html(template());

      //this.$el = _.template(loginTpl)();
      $('body .modal .modal-body').append(this.$el);

      //$('body .modal .modal-body').html(_.template(loginTpl)());
      this.$el.find('.input-ip').val('192.168.0.11');

      //this.$el.html(template());
      //return this;
    },

    events: {
      'keypress .input-id': 'login',
      'keypress .input-pw': 'login',
    },

    login: function(e) {
      //console.log('saveLogin...');

      //if (e.keyCode == 13 && id) {
      if (e.keyCode == 13) {
        e.preventDefault();
        var id = this.$el.find('.input-id').val();
        var pw = this.$el.find('.input-pw').val();
        //var user = haniMoon.request('login:checkUser', {id:id, pw:pw, view:this});
        if (!id) return false;

        $.ajax({
          url: GLOBAL.get('_BASEURL') + 'API/list/getUser',
          type: 'POST',
          //async: false,
          data: {'id':id, 'pw':pw},
        })
        .done(function(res) {
          console.log('response ', res);
          MH.setCookie('userId', id, 1);
          GLOBAL.set('_USERID', id);
          GLOBAL.set('_USERNM', user['USRM_NAME']);
          GLOBAL.set('_USERLV', user['USRM_DOC_GUBUN']);  //USRM_DOC_GUBUN: 0(직원), 1(전문의?), 2(일반의?)
        })
        .fail(function () {
          console.log('Error!');
          return false;
        });

      }

    }

  });
//-----------------------------------------------------------------------------
// INSTANCE & RETURN
//-----------------------------------------------------------------------------
  return new Login();
});
/*
- login view script
<script>
function checkLogin(){

  if( $.trim($("#userId").val()) == '' ){
    alert("아이디를 입력해 주세요.");
    $("#userId").focus();
    return;
  }
  if( $.trim($("#userPw").val()) == '' ){
    alert("비밀번호를 입력해 주세요.");
    $("#userPw").focus();
    return;
  }
  // 로그인 프로세스 호출
  $.ajax({
    type: 'post'
    , async: true
    , url: '/member.do?cmd=login'
    , data: $("#frm").serialize()
    , beforeSend: function() {
       $('#ajax_load_indicator').show().fadeIn('fast');
      }
    , success: function(data) {
      var response = data.trim();
      console.log("success forward : "+response);
      // 메세지 할당
      switch(response) {
        case "nomatch":
          msg = "아이디 또는 비밀번호가 일치하지 않습니다."; break;
        case "fail":
          msg = "로그인에 실패 했습니다."; break;
        default :
          msg = "존재하지 않는 사용자입니다."; break;
      }
      // 분기 처리
      if(response=="success"){
        window.location.href = "${targetUrl}";
      } else {
        alert(msg);
      }
      }
    , error: function(data, status, err) {
      console.log("error forward : "+data);
      alert('서버와의 통신이 실패했습니다.');
      }
    , complete: function() {
      $('#ajax_load_indicator').fadeOut();
      }
  });
}
</script>


- login view html
<form id="frm" name="frm" method="post" action="" onSubmit="checkLogin();return false;">
  <fieldset>
    <legend>login</legend>
    <div class="login_item mg_top34">
      <label>id</label>
      <input id="userId" name="memberVo.xcWebMbrId" type="text" class="i_login" />
    </div>

    <div class="login_item mg_top10">
      <label>password</label>
      <input id="userPw" name="memberVo.xcPswd" type="password" class="i_login" />
    </div>

    <div id="ajax_load_indicator" style="display:none">
      <p style="text-align:center; padding:16px 0 0 0"><img src="/mobile/common/img/ajax-loader-line.gif" /></p>
    </div>

    <p class="keeping mg_left89">
      <input id="keepidpw" class="rd_box22" value="1" type="checkbox" name="idPswdSave" >
      <label for="keepidpw">ID/PW 저장</label>
    </p>

    <p class="keeping mg_left20">
      <input id="keepid" class="rd_box22" value="1" type="checkbox" name="idSave" >
      <label for="keepid">ID 저장</label>
    </p>

    <span class="btn_login">
      <input type="image" src="<%=imageUrl%>/btn/btn_login.jpg" title="로그인" onclick="checkLogin();return false;">
    </span>

    <p class="btn_register"><a href="/member.do?cmd=memberJoin"><img src="<%=imageUrl%>/btn/btn_join.jpg" alt="회원가입" /></a>
    <a href="/member.do?cmd=goIdPwFind" class="mg_left5"><img src="<%=imageUrl%>/btn/btn_sch.jpg" alt="아이디/비밀번호 찾기" /></a></p>
  </fieldset>
</form>





  tagName: 'div',
  className: 'modal fade',
  template: 'ui-modal',

  events: {
    'keypress .input-id': 'saveLogin',
    'keypress .input-pw': 'saveLogin',
    //'click input-id': 'getNfPrivate'
    //'click #pop1': 'popoverMe'

  },

  saveLogin: function (e) {
    //cookie가 있으면, GB에 값이 있으면...
    var id = $(e.target).parent().parent().find('.input-id').val();
    var pw = $(e.target).parent().parent().find('.input-pw').val();
    if (e.keyCode == 13 && id) {
    console.log('id, pw', id, pw);
    var user = haniMoon.request('login:checkUser', {id:id, pw:pw, view:this});
    if (user[0]) {
      console.log('id, pw~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', id, pw);
      hM_setCookie('userId', id, 1);
      GLOBAL.set('_USRID', id);
      GLOBAL.set('_USRLV', user[0]['USRM_DOC_GUBUN']);  //USRM_DOC_GUBUN: 0(직원), 1(전문의?), 2(일반의?)
      haniMoon.trigger('list:showList2', hM_utils.getToday());
    } else {
      //haniMoon.navigate('denied');
      console.log('denied~~~~~~~~~~~~~~~~~~~~~');
      GLOBAL.set('_USRID', '');
    }
    }
*/