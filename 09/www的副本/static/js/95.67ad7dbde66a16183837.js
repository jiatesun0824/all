webpackJsonp([95],{681:function(e,r,t){function o(e){t(840)}var n=t(6)(t(829),t(856),o,null,null);e.exports=n.exports},829:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o=t(68),n=t.n(o),a=t(33);r.default={name:"expire",computed:n()({},t.i(a.b)("common",["userInfo"]),{remainingDays:function(){var e=new Date(new Date((new Date).toLocaleDateString())-new Date(this.userInfo.loginDay)).getDate();return this.userInfo.oldServiceFlag?Math.abs(e-(this.userInfo.leftTime+1)):Math.abs(e-(this.userInfo.remainingDays+1))}})}},832:function(e,r,t){r=e.exports=t(674)(!1),r.push([e.i,'.expire{position:absolute;top:-.266667rem;right:.266667rem}.expire__content{padding:.106667rem;font-size:.293333rem;color:#ff004e;word-break:keep-all;background-color:#fff;border-radius:.106667rem .106667rem 0 .106667rem;box-shadow:0 .08rem .08rem 0 rgba(255,100,25,.55)}.expire__content:after{content:"";position:absolute;right:0;bottom:-.08rem;border:.08rem solid transparent;border-top-color:#fff;border-right-color:#fff}',""])},840:function(e,r,t){var o=t(832);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);var n=t(675).default;n("417a4c21",o,!0,{})},856:function(e,r){e.exports={render:function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",{staticClass:"expire"},[t("div",{staticClass:"expire__content"},[t("span",{domProps:{textContent:e._s((e.userInfo.oldServiceFlag?"账户":e.userInfo.serviceType?"试用":"使用")+"还剩"+e.remainingDays+"天")}})])])},staticRenderFns:[]}}});