webpackJsonp([83],{1025:function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var a=t(156),n=t.n(a),s=t(68),r=t.n(s),c=t(33),i=t(111),m=t(157),l=(t.n(m),t(16));t.n(l);o.default={data:function(){return{beforeScroll:!0,data:[],curIndex:-1}},activated:function(){localStorage.getItem("companyList")&&(this.data=JSON.parse(localStorage.getItem("companyList")))},methods:r()({},t.i(c.c)("common",["SET_TOKEN","SET_USER_INFO"]),{selectCompany:t.i(l.debounce)(function(e,o){var a=this,s=e.id,r=localStorage.getItem("userName"),c=localStorage.getItem("pwd"),l=new FormData;l.append("account",r),l.append("password",c),l.append("loginCompanyId",s),this.API.login(l).then(function(e){if(e.flag){if(!e.obj.menuTree)return a.$store.commit("showComComponents",!1),a.$store.commit("popupMsg","请先配置用户菜单！"),void a.$store.commit("showPopup");var s=n()(e.obj.menuTree);if(i.b.$emit("footerTabShow",s),localStorage.setItem("menu",s),localStorage.setItem("token",e.obj.token),localStorage.setItem("userId",e.obj.id),1===e.obj.passwordUpdateFlag)return a.$store.state.footerShow=!1,void a.$router.push("/setAccount");if(a.API.integralShow({account:r,password:c}).then(function(o){o&&(localStorage.setItem("balanceAmount",e.obj.balanceIntegral),localStorage.setItem("consumAmount",e.obj.consumAmount))}),e.success){a.$store.commit("showComComponents",!0),localStorage.setItem("isLogined",1),localStorage.setItem("mobile",e.obj.mobile),a.curIndex=o,a.$store.state.recom.planName="",a.$store.state.footerShow=!0,localStorage.setItem("token",n()(e.obj.token)),localStorage.setItem("userInfo",n()(e.obj)),a.SET_TOKEN(e.obj.token),a.SET_USER_INFO(e.obj);var l=a;t.i(m.setTimeout)(function(){l.$router.push("/")},200)}a.API.space().then(function(e){e&&(a.$store.state.spaceList=e.datalist,sessionStorage.setItem("selType",a.$store.state.spaceList[0].name),sessionStorage.setItem("name",a.$store.state.spaceList[0].name),sessionStorage.setItem("houseType",a.$store.state.spaceList[0].value),a.$store.state.loginToDesign=!0,a.$store.state.loginToRecom=!0,sessionStorage.setItem("replaceList",""))}),a.API.getFavoritesList({msgId:localStorage.getItem("userId"),token:localStorage.getItem("token")}).then(function(e){e&&(a.$store.state.favoritesList=e.datalist)})}})},20),goback:function(){this.SET_TOKEN(null),this.$router.go(-2)}}),computed:t.i(c.e)({resourcesUrl:function(e){return e.resourcesUrl}})}},1199:function(e,o,t){var a=t(679);o=e.exports=t(677)(!1),o.push([e.i,".company[data-v-d11c5eba]{width:100%;height:100%;background-color:#eee}.company .company-header[data-v-d11c5eba]{position:relative;height:1.173333rem;text-align:center;font-size:0;background-color:#fff;z-index:99}.company .company-header .arrow[data-v-d11c5eba]{position:absolute;top:.266667rem;left:.266667rem;width:.64rem;height:.64rem;background-image:url("+a(t(1330))+");background-size:.64rem .64rem}.company .company-header .company-title[data-v-d11c5eba]{display:inline-block;line-height:1.173333rem;font-size:.48rem;color:#333}.company .company-wrappper[data-v-d11c5eba]{position:absolute;top:1.173333rem;bottom:0}.company .company-wrappper .company-box[data-v-d11c5eba]{padding-bottom:.4rem;overflow:hidden}.company .company-wrappper .company-box .company-item[data-v-d11c5eba]{margin:.4rem .8rem;width:8.4rem;height:3.466667rem;background-color:#fff;border:.013333rem solid transparent;border-radius:.133333rem;overflow:hidden}.company .company-wrappper .company-box .company-item.active[data-v-d11c5eba]{border:.013333rem solid #ff6419}.company .company-wrappper .company-box .company-item .company-logo[data-v-d11c5eba]{display:block;margin:.693333rem auto .4rem;width:2.666667rem;height:1.333333rem}.company .company-wrappper .company-box .company-item .company-name[data-v-d11c5eba]{text-align:center;font-size:.373333rem;color:#333}",""])},1300:function(e,o,t){var a=t(1199);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var n=t(678).default;n("8a423020",a,!0,{})},1330:function(e,o){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3QzNFQzI3ODFCOTExMUU4OENDQjhEMThEM0UzRUU0RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3QzNFQzI3OTFCOTExMUU4OENDQjhEMThEM0UzRUU0RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdDM0VDMjc2MUI5MTExRTg4Q0NCOEQxOEQzRTNFRTREIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdDM0VDMjc3MUI5MTExRTg4Q0NCOEQxOEQzRTNFRTREIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+AsQZfwAAAeJJREFUeNrsmltLAmEQhlfXoP/XgQiRijIioqzsIJ3LsjItwotWKwmJ6A92EbnNwCwMg1d+BxvagfdiFmTfZ7/dmW92zcRxHGiObKA8UoBRR26YH0VR5MxQsVhMbyFfkQHVQV+gmjYANN8CbYHGQSuaAND8ozAdaQFA8w+gVXbsCbSjASAxv8aOtWkl4r8OgOabwnwHtGxi3hcAmm+A1tmxZyz5puZ9AaD5DZa/gJZsmPcBIM2/2jTvGgCbVEmYXwT1NXTiOjWpJLp05fu2T+QC4EaYf6Mr/6NhL3QNKgvzC67M2waoiY7ac23eJsAlaJfl76A51+ZtAGCTqoL2hfmCD/NDT2Si2myy/MOnedMVqArzn6C8T/OmAN8iD0cxX5ic8AR0xfIJuv/HNM3EFdAZyycJIqcFAOMYdDoAItT0VgJvp3OWT/mCsPnQHYEuWD7tA8J21Tik8sohei4hXJS9A1GdZmhTF2oBSKoTh5h1BeGy8VRoe80hurYhXHfOPRpwksjTUB9qAQhom33L8oJNCF97Fxx07gRExwaEz83XtoDAgadt6sH37hEhmiyfp5XIagEIaIa4FxANTQAYpQEQIxkpTVcCPy/ht4KWRoCYml1F00NsPTLpfyVSgH8O8CvAAM/5XzNCM9egAAAAAElFTkSuQmCC"},1609:function(e,o){e.exports={render:function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("div",{staticClass:"company"},[t("div",{staticClass:"company-header"},[t("div",{staticClass:"arrow",on:{click:e.goback}}),e._v(" "),t("span",{staticClass:"company-title"},[e._v("选择您要进入的企业")])]),e._v(" "),t("scroll",{ref:"companyEl",staticClass:"company-wrappper",attrs:{data:e.data,beforeScroll:e.beforeScroll}},[t("div",{staticClass:"company-box"},e._l(e.data,function(o,a){return t("div",{key:a,staticClass:"company-item",class:{active:e.curIndex===a},on:{click:function(t){e.selectCompany(o,a)}}},[t("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.resourcesUrl+o.logoPath,expression:"resourcesUrl + item.logoPath"}],staticClass:"company-logo"}),e._v(" "),t("div",{staticClass:"company-name"},[e._v(e._s(o.name))])])}))])],1)},staticRenderFns:[]}},708:function(e,o,t){function a(e){t(1300)}var n=t(6)(t(1025),t(1609),a,"data-v-d11c5eba",null);e.exports=n.exports}});