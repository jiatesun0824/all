webpackJsonp([85],{1074:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i(13),o=i.n(a),n=i(12),s=i.n(n),r=i(68),d=i.n(r),c=i(260),l=i(268),h=i(33),p=i(159),u=/^[0-9a-zA-Z]{6,16}$/;t.default={data:function(){return{loginPhone:"",codetit:"获取验证码",i:60,code:"",pwd:"",queryPhone:""}},created:function(){this.$route.query.phone/1!=1&&(this.queryPhone=this.$route.query.phone,this.loginPhone=this.$route.query.phone)},computed:{isSubmit:function(){return this.code&&u.test(this.pwd)}},methods:d()({},i.i(h.e)("login",["getPassword"]),{getCode:function(){var e=this,t=this.i;if("获取验证码"==this.codetit){var a=this,o=setInterval(function(){t--,a.codetit=t+"s",t<1&&(clearInterval(o),a.codetit="获取验证码",a.i=60)},1e3),n={phoneNumber:this.loginPhone,msgId:11};i.i(c.h)(n).then(function(t){t.success&&e.$toast("验证码发送成功")})}},submit:function(){var e=this;if(this.isSubmit)if(u.test(this.pwd)){var t=new FormData;t.append("mobile",this.loginPhone),t.append("authCode",this.code),t.append("newPassword",i.i(p.a)(i.i(p.a)("WeB"+this.pwd)));var a={mobile:this.loginPhone,authCode:this.code,newPassword:i.i(p.a)(i.i(p.a)("WeB"+this.pwd))};i.i(l.d)(a).then(function(){var t=s()(o.a.mark(function t(a){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!a.success){t.next=9;break}return e.getPassword(e.pwd),localStorage.setItem("pwd",i.i(p.a)(i.i(p.a)("WeB"+e.pwd))),localStorage.setItem("rememberPassword",window.btoa(e.pwd)),t.next=6,e.$toast("修改成功");case 6:e.$router.go(-1),t.next=10;break;case 9:e.$toast(a.message);case 10:case"end":return t.stop()}},t,e)}));return function(e){return t.apply(this,arguments)}}())}else this.$toast("密码格式不正确，请输入6-16位数字加字母")}})}},1099:function(e,t,i){t=e.exports=i(674)(!1),t.push([e.i,"header[data-v-03cb2a6a]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:1.173333rem;line-height:1.173333rem;position:fixed;top:0;left:0;z-index:2;width:100%;color:#333;background-color:#fff;border-bottom:1px solid #f8f8f8}header .icon-left[data-v-03cb2a6a]{position:absolute;left:0;top:0}header .title[data-v-03cb2a6a]{width:100%;text-align:center;font-size:.48rem}header .right[data-v-03cb2a6a]{position:absolute;right:.4rem;top:0;font-size:.48rem;color:#ff6614}.changepwd[data-v-03cb2a6a]{padding:2.106667rem 1.333333rem;box-sizing:border-box}.changepwd .bgeo[data-v-03cb2a6a]{background:#e0e0e0;color:gray}.changepwd .item[data-v-03cb2a6a]{width:100%;height:1.173333rem;line-height:1.173333rem;padding-left:.666667rem;margin-bottom:.4rem;border:.026667rem solid #e0e0e0;border-radius:.533333rem;position:relative;box-sizing:border-box}.changepwd .item .codeinpu[data-v-03cb2a6a]{width:2.666667rem;height:100%;display:block}.changepwd .item .codebut[data-v-03cb2a6a]{position:absolute;right:0;width:40%;top:.32rem;height:.533333rem;line-height:.533333rem;border-left:.013333rem solid #e0e0e0;z-index:2;padding-left:.666667rem;color:#808183}.changepwd .item .spbg[data-v-03cb2a6a]{position:absolute;right:0;width:40%;top:0;height:100%;z-index:1}.changepwd .but[data-v-03cb2a6a]{width:100%;height:1.173333rem;line-height:1.173333rem;text-align:center;background:#e0e0e0;color:#fff;font-size:.426667rem;letter-spacing:.026667rem;border-radius:.533333rem}",""])},1197:function(e,t,i){var a=i(1099);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var o=i(675).default;o("5444112e",a,!0,{})},1496:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"changepwd"},[i("header",[i("i",{staticClass:"icon-left",on:{click:function(t){e.$router.go(-1)}}}),e._v(" "),i("div",{staticClass:"title"},[e._v("修改密码")])]),e._v(" "),i("div",{staticClass:"main"},[""!=e.queryPhone?i("div",{staticClass:"item bgeo"},[e._v("\n           "+e._s(e.loginPhone)+"\n        ")]):e._e(),e._v(" "),""===e.queryPhone?i("div",{staticClass:"item"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.loginPhone,expression:"loginPhone"}],staticClass:"codeinpu",staticStyle:{width:"100%"},attrs:{maxlength:"10",type:"number",placeholder:"请输入手机号"},domProps:{value:e.loginPhone},on:{input:function(t){t.target.composing||(e.loginPhone=t.target.value)}}})]):e._e(),e._v(" "),i("div",{staticClass:"item"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.code,expression:"code"}],staticClass:"codeinpu",attrs:{maxlength:"10",type:"number",placeholder:"请输入验证码"},domProps:{value:e.code},on:{input:function(t){t.target.composing||(e.code=t.target.value)}}}),e._v(" "),i("span",{staticClass:"codebut",on:{click:e.getCode}},[e._v(e._s(e.codetit))]),e._v(" "),i("span",{staticClass:"spbg"})]),e._v(" "),i("div",{staticClass:"item"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.pwd,expression:"pwd"}],staticClass:"codeinpu",attrs:{onkeyup:"value=value.replace(/[^\\w\\.\\/]/ig,'')",minlength:"8",maxlength:"16",type:"password",placeholder:"请设置新密码"},domProps:{value:e.pwd},on:{input:function(t){t.target.composing||(e.pwd=t.target.value)}}})]),e._v(" "),i("div",{staticClass:"but",style:e.isSubmit?"background:#ff6419;":"background: #e0e0e0;",on:{click:e.submit}},[e._v("\n            提交\n        ")])])])},staticRenderFns:[]}},764:function(e,t,i){function a(e){i(1197)}var o=i(6)(i(1074),i(1496),a,"data-v-03cb2a6a",null);e.exports=o.exports}});