webpackJsonp([88],{1065:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={data:function(){return{codetit:"获取验证码",i:60}},beforeCreate:function(){},methods:{next:function(){},getcode:function(){var e=this.i,t=this,n=setInterval(function(){e--,t.codetit=e+"s",e<1&&(clearInterval(n),t.codetit="获取验证码",t.i=60)},1e3)}}}},1158:function(e,t,n){t=e.exports=n(674)(!1),t.push([e.i,".addbankphone[data-v-7b5eed36]{height:100%;background:#eee}.addbankphone .tit[data-v-7b5eed36]{background:#fafafa;font-size:.32rem;color:#999}.addbankphone .box[data-v-7b5eed36],.addbankphone .tit[data-v-7b5eed36]{height:1.333333rem;line-height:1.333333rem;padding:0 1rem;font-family:PingFang-SC-Bold}.addbankphone .box[data-v-7b5eed36]{background:#fff;font-size:.373333rem;box-sizing:border-box;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.addbankphone .box .inpu[data-v-7b5eed36]{width:5.333333rem;height:1.266667rem;color:#333;border:none}.addbankphone .box .getcode[data-v-7b5eed36]{display:inline-block;float:right;width:2.4rem;color:#ff662e;border-left:.013333rem solid #e8e8e8;text-align:right;height:.4rem;line-height:.4rem}.addbankphone .nextbox[data-v-7b5eed36]{text-align:center;margin-top:.533333rem}.addbankphone .nextbox .next[data-v-7b5eed36]{display:inline-block;width:8rem;line-height:1.066667rem;height:1.066667rem;background-color:#ff6419;font-size:.426667rem;color:#fff;border-radius:.533333rem}",""])},1256:function(e,t,n){var a=n(1158);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var i=n(675).default;i("2110b278",a,!0,{})},1551:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"addbankphone"},[n("div",{staticClass:"tit"},[e._v("\n        绑定银行卡需要短信确认， 请按提示操作\n    ")]),e._v(" "),n("div",{staticClass:"box"},[n("input",{staticClass:"inpu",attrs:{placeholder:"请输入验证码",type:"number"}}),e._v(" "),n("span",{staticClass:"getcode",on:{click:e.getcode}},[e._v(e._s(e.codetit))])]),e._v(" "),n("div",{staticClass:"nextbox"},[n("span",{staticClass:"next",on:{click:e.next}},[e._v("下一步")])])])},staticRenderFns:[]}},755:function(e,t,n){function a(e){n(1256)}var i=n(6)(n(1065),n(1551),a,"data-v-7b5eed36",null);e.exports=i.exports}});