webpackJsonp([82],{1025:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=o(156),s=o.n(i),a=o(33),n=o(111),r="";t.default={data:function(){return{allowToSubmit:!1,phoneNumber:"",msg:"获取验证码",firstNewPwd:"",secondNewPwd:"",count:60,codeVal:"",canGetCode:!0,codeFlag:!0}},activated:function(){this.resetVal()},methods:{goBack:function(){this.$router.go(-1)},resetVal:function(){this.phoneNumber="",this.msg="获取验证码",this.firstNewPwd="",this.secondNewPwd="",this.count=60,this.codeVal="",this.codeFlag=!0,this.canGetCode=!0,clearTimeout(r)},encrypt:function(){var e=document.getElementById("resetPwd").value,t=$.md5("WeB"+e);return $.md5(t)},allowSubmit:function(){""===this.phoneNumber||""===this.codeVal||""===this.firstNewPwd||""===this.secondNewPwd?this.allowToSubmit=!1:this.allowToSubmit=!0},submit:function(e){var t=this,o=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,16}$/;if(this.allowToSubmit){if(!o.test(this.firstNewPwd)||!o.test(this.secondNewPwd))return this.$store.state.popupMsg="请设置4-16位包含数字及字母密码组合",void this.$store.commit("showPopup");if(this.firstNewPwd!==this.secondNewPwd)return this.$store.state.popupMsg="您设置的密码不一致",void this.$store.commit("showPopup");var i=new FormData;i.append("mobile",this.phoneNumber),i.append("phoneCode",this.codeVal),i.append("password",this.encrypt()),1===e?i.append("comfirmFlag",1):i.get("comfirmFlag")&&i.delete("comfirmFlag"),this.API.updatePwd(i).then(function(e){if(e){if(!e.flag&&1===e.obj)return void t.$refs.tip.show();t.$store.state.popupMsg=e.message,t.$store.commit("showPopup"),setTimeout(function(){t.toLogin()},2e3)}})}},toLogin:function(){var e=this;this.$store.state.personalHideHeader=!0;var t=this.phoneNumber,o=this.encrypt();localStorage.setItem("userName",t),localStorage.setItem("pwd",o);var i=new FormData;i.append("account",t),i.append("password",o),i.append("msgId",0),i.append("loginFlag",1),this.API.getFranchiserCompanyList(i).then(function(a){a&&(a.datalist.length&&a.datalist.length>1?(localStorage.setItem("companyList",s()(a.datalist)),e.$store.commit("showComComponents",!1),e.$router.push("/company")):e.API.login(i).then(function(i){if(i){if(!i.flag){if(e.$store.commit("showComComponents",!1),e.$store.commit("popupMsg",i.message),e.$store.commit("showPopup"),"您尚未开通移动版功能，请联系客服开通!"===i.message)return e.$store.state.isRenew=!1,localStorage.setItem("pauopenUserId",i.msgId),void e.$router.push("/payopen");if("未开通此平台权限,请联系客服."===i.message||"平台权限已到期,请续费开通!"===i.message){var a=i.msgId;return localStorage.setItem("pauopenUserId",a),e.$store.state.isRenew=!1,void e.$router.push("/payopen")}return}if("移动版已到期，请续费开通！"===i.message)return e.$store.state.isRenew=!0,void e.$router.push("/payopen");if(e.$store.state.errorCount>3)return e.$store.commit("showComComponents",!1),e.$store.commit("popupMsg","账号或密码错误超过3次，请修改密码！"),e.$store.commit("showPopup"),void setTimeout(function(){router.push("/reset")},2500);if(localStorage.setItem("token",i.obj.token),localStorage.setItem("userId",i.obj.id),sessionStorage.getItem("designHouseType")||sessionStorage.setItem("designHouseType","3"),e.$store.state.timeOut=!1,e.$store.state.errorCount=0,sessionStorage.setItem("provinceCode",44e4),sessionStorage.setItem("cityCode",440300),localStorage.removeItem("companyList"),!i.obj.menuTree)return e.$store.commit("showComComponents",!1),e.$store.commit("popupMsg","请先配置用户菜单！"),void e.$store.commit("showPopup");var r=s()(i.obj.menuTree);n.b.$emit("footerTabShow",r),localStorage.setItem("menu",r),e.API.integralShow({account:t,password:o}).then(function(e){e&&(localStorage.setItem("balanceAmount",i.obj.balanceIntegral),localStorage.setItem("consumAmount",i.obj.consumAmount))}),e.$store.commit("showComComponents",!0),e.$store.state.footerShow=!0,localStorage.setItem("isLogined",1),localStorage.setItem("mobile",i.obj.mobile),e.$router.push("/recom");var l=new FormData;l.append("account",t),l.append("password",o),l.append("msgId",0),e.API.getFranchiserCompanyList(l).then(function(e){e&&e.datalist.length&&e.datalist.length>1&&localStorage.setItem("companyList",s()(e.datalist))}),e.API.space().then(function(t){t&&(e.$store.state.spaceList=t.datalist,sessionStorage.setItem("selType",e.$store.state.spaceList[0].name),sessionStorage.setItem("name",e.$store.state.spaceList[0].name),sessionStorage.setItem("houseType",e.$store.state.spaceList[0].value),e.$store.state.loginToDesign=!0,e.$store.state.loginToRecom=!0,sessionStorage.setItem("replaceList",""))}),e.API.getFavoritesList({msgId:localStorage.getItem("userId"),token:i.obj.token}).then(function(t){t&&(e.$store.state.favoritesList=t.datalist)})}}))})},getCode:function(){function e(){0==t.count?(clearTimeout(r),t.msg="获取验证码",t.count=60,t.codeFlag=!0):(t.codeFlag=!1,t.count--,t.msg=t.count+"S后重发",r=setTimeout(function(){e()},1e3))}var t=this,o=document.getElementById("phoneNumber").value.replace(/(^\s*)|(\s*$)/g,"");if(!/^(0|86|17951)?(13[0-9]|15[012356789]|19[0-9]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(o))return this.$store.state.popupMsg="请输入正确的手机号",void this.$store.commit("showPopup");if(""==o)return this.$store.state.popupMsg="请输入手机号",void this.$store.commit("showPopup");if(t.codeFlag){if(!t.canGetCode)return;t.canGetCode=!1,""!==this.codeVal&&(clearTimeout(r),e()),clearTimeout(r),this.API.sendbindPhoneMsg({phoneNumber:o}).then(function(o){o&&(t.canGetCode=!0,e())})}}},computed:o.i(a.e)({footerShow:function(e){return e.footerShow}})}},1153:function(e,t,o){var i=o(679);t=e.exports=o(677)(!1),t.push([e.i,".first-login[data-v-56e62949]{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;overflow:hidden}.first-login .back-icon[data-v-56e62949]{position:absolute;left:.4rem;top:.4rem;width:.64rem;height:.64rem;background-size:.64rem .64rem;background-image:url("+i(o(1350))+")}.first-login .first-login-wrapper .title-box[data-v-56e62949]{margin:1.68rem 0 1.333333rem;text-align:center;font-size:0}.first-login .first-login-wrapper .title-box .title-f[data-v-56e62949]{display:inline-block;padding-bottom:.4rem;font-family:PingFang-SC-Bold;font-size:.48rem;color:#333}.first-login .first-login-wrapper .title-box .title-s[data-v-56e62949]{display:inline-block;font-size:.64rem;color:#ff6419}.first-login .first-login-wrapper .module-box[data-v-56e62949]{margin:0 auto .8rem;width:8rem}.first-login .first-login-wrapper .module-box .module-title[data-v-56e62949]{font-size:.32rem;color:#999}.first-login .first-login-wrapper .module-box .module-inp[data-v-56e62949]{box-sizing:border-box;margin:.266667rem 0;width:8rem;height:1.173333rem;border:1px solid #e0e0e0;border-radius:.586667rem}.first-login .first-login-wrapper .module-box .module-inp .inp[data-v-56e62949]{box-sizing:border-box;display:block;width:8rem;height:1.173333rem;text-indent:.8rem}.first-login .first-login-wrapper .module-box .module-inp-code[data-v-56e62949]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.first-login .first-login-wrapper .module-box .module-inp-code .code-inp[data-v-56e62949]{width:5.066667rem}.first-login .first-login-wrapper .module-box .module-inp-code .code[data-v-56e62949]{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;margin:.4rem 0;text-align:center;line-height:.373333rem;height:.373333rem;font-size:.373333rem;color:#999;border-left:.013333rem solid #e0e0e0}.first-login .first-login-wrapper .submit-btn[data-v-56e62949]{margin:1.6rem auto 0;width:8rem;height:1.173333rem;background-color:#ffdccc;border-radius:.533333rem;color:#fff;font-size:.453333rem;text-align:center;line-height:1.173333rem}.first-login .first-login-wrapper .submit-btn.allow-submit[data-v-56e62949]{background-color:#ff6419}",""])},1255:function(e,t,o){var i=o(1153);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var s=o(678).default;s("6a8f2e92",i,!0,{})},1350:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3QzNFQzI3ODFCOTExMUU4OENDQjhEMThEM0UzRUU0RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3QzNFQzI3OTFCOTExMUU4OENDQjhEMThEM0UzRUU0RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdDM0VDMjc2MUI5MTExRTg4Q0NCOEQxOEQzRTNFRTREIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdDM0VDMjc3MUI5MTExRTg4Q0NCOEQxOEQzRTNFRTREIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+AsQZfwAAAeJJREFUeNrsmltLAmEQhlfXoP/XgQiRijIioqzsIJ3LsjItwotWKwmJ6A92EbnNwCwMg1d+BxvagfdiFmTfZ7/dmW92zcRxHGiObKA8UoBRR26YH0VR5MxQsVhMbyFfkQHVQV+gmjYANN8CbYHGQSuaAND8ozAdaQFA8w+gVXbsCbSjASAxv8aOtWkl4r8OgOabwnwHtGxi3hcAmm+A1tmxZyz5puZ9AaD5DZa/gJZsmPcBIM2/2jTvGgCbVEmYXwT1NXTiOjWpJLp05fu2T+QC4EaYf6Mr/6NhL3QNKgvzC67M2waoiY7ac23eJsAlaJfl76A51+ZtAGCTqoL2hfmCD/NDT2Si2myy/MOnedMVqArzn6C8T/OmAN8iD0cxX5ic8AR0xfIJuv/HNM3EFdAZyycJIqcFAOMYdDoAItT0VgJvp3OWT/mCsPnQHYEuWD7tA8J21Tik8sohei4hXJS9A1GdZmhTF2oBSKoTh5h1BeGy8VRoe80hurYhXHfOPRpwksjTUB9qAQhom33L8oJNCF97Fxx07gRExwaEz83XtoDAgadt6sH37hEhmiyfp5XIagEIaIa4FxANTQAYpQEQIxkpTVcCPy/ht4KWRoCYml1F00NsPTLpfyVSgH8O8CvAAM/5XzNCM9egAAAAAElFTkSuQmCC"},1567:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"first-login"},[o("div",{staticClass:"back-icon",on:{click:e.goBack}}),e._v(" "),o("div",{staticClass:"first-login-wrapper"},[e._m(0),e._v(" "),o("div",{staticClass:"module-box"},[o("div",{staticClass:"module-title"},[e._v("绑定手机号")]),e._v(" "),o("div",{staticClass:"module-inp"},[o("input",{directives:[{name:"model",rawName:"v-model",value:e.phoneNumber,expression:"phoneNumber"}],staticClass:"inp",attrs:{type:"text",id:"phoneNumber",placeholder:"请输入手机号",autocomplete:"off",maxlength:"11",oninput:"if (this.value.length == 1) { this.value = this.value.replace(/[^1-9]/g, '') } else { this.value = this.value.replace(/\\D/g, '').replace(/^0+/g, '') }",onafterpaste:"if (this.value.length == 1) { this.value = this.value.replace(/[^1-9]/g, '') } else { this.value = this.value.replace(/^0+/g, '') }"},domProps:{value:e.phoneNumber},on:{keyup:e.allowSubmit,input:function(t){t.target.composing||(e.phoneNumber=t.target.value)}}})]),e._v(" "),o("div",{staticClass:"module-inp module-inp-code"},[o("input",{directives:[{name:"model",rawName:"v-model",value:e.codeVal,expression:"codeVal"}],staticClass:"inp code-inp",attrs:{type:"text",placeholder:"请输入验证码",oninput:"value=this.value.replace(/\\D+/g,'')",maxlength:"6"},domProps:{value:e.codeVal},on:{keyup:e.allowSubmit,input:function(t){t.target.composing||(e.codeVal=t.target.value)}}}),e._v(" "),o("div",{staticClass:"code",on:{click:e.getCode}},[e._v(e._s(e.msg))])])]),e._v(" "),o("div",{staticClass:"module-box"},[o("div",{staticClass:"module-title"},[e._v("首次登陆请修改密码")]),e._v(" "),o("div",{staticClass:"module-inp"},[o("input",{directives:[{name:"model",rawName:"v-model",value:e.firstNewPwd,expression:"firstNewPwd"}],staticClass:"inp",attrs:{type:"password",placeholder:"请输入4-16位数字及字母密码组合",autocomplete:"off",maxlength:"16"},domProps:{value:e.firstNewPwd},on:{keyup:e.allowSubmit,input:function(t){t.target.composing||(e.firstNewPwd=t.target.value)}}})]),e._v(" "),o("div",{staticClass:"module-inp"},[o("input",{directives:[{name:"model",rawName:"v-model",value:e.secondNewPwd,expression:"secondNewPwd"}],staticClass:"inp",attrs:{type:"password",id:"resetPwd",placeholder:"再次确认密码",autocomplete:"off",maxlength:"16"},domProps:{value:e.secondNewPwd},on:{keyup:e.allowSubmit,input:function(t){t.target.composing||(e.secondNewPwd=t.target.value)}}})])]),e._v(" "),o("div",{staticClass:"submit-btn",class:{"allow-submit":e.allowToSubmit},on:{click:function(t){e.submit(1)}}},[e._v("提交")]),e._v(" "),o("confirm",{ref:"tip",attrs:{text:"该手机号已绑定其他账号，再次绑定将会合并账号信息，是否确认绑定？",cancelBtnText:"取消",confirmBtnText:"确定"},on:{confirm:function(t){e.submit(0)}}})],1)])},staticRenderFns:[function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"title-box"},[o("span",{staticClass:"title-f"},[e._v("绑定账户信息后，您可获得")]),o("br"),o("span",{staticClass:"title-s"},[e._v("三个月免费渲染套餐")])])}]}},712:function(e,t,o){function i(e){o(1255)}var s=o(6)(o(1025),o(1567),i,"data-v-56e62949",null);e.exports=s.exports}});