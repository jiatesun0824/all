webpackJsonp([54],{1019:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=(a(33),a(788)),r=a(854);t.default={mixins:[o.a],data:function(){return{mealState:"0",mealExpiryTime:"",beforeScroll:!0,pullup:!0,pulldown:!0,integral:"",data:[],loadEnd:"",alreadyAppear:0,loadfailFlag:!1,page:0,costIntegral:null,topLoad:!1}},activated:function(){this.initScroll(),this._getIntegral()},methods:{toPayPage:function(){sessionStorage.setItem("returnPayUrl","account"),this.$router.push("/paypage")},_getIntegral:function(){var e=this,t=JSON.parse(localStorage.getItem("userInfo")).mobile,o=JSON.parse(localStorage.getItem("userInfo")).userKey;a.i(r.a)({account:t,password:o}).then(function(t){t&&(e.integral=Math.floor(t.obj.balanceIntegral).toString(),e.costIntegral=Math.floor(t.obj.consumAmount),e.mealState=t.obj.state,e.mealExpiryTime=t.obj.expiryTime)})},initScroll:function(){this.data=[],this.page=0,this.loadEnd="",this.loadData()},loadData:function(){var e=this;if("没有更多数据"!=this.loadEnd){var t=0+10*this.page;this.alreadyAppear=t,a.i(r.b)({limit:10,start:t}).then(function(t){if(t){e.page++;var a=t.obj;if(0==t.totalCount||null==a)return e.loadfailFlag=!0,void(e.$store.state.loadfailTxt="暂时没有记录呀~");t.totalCount<=10||0==a.length?e.loadEnd="没有更多数据":e.loadEnd="加载更多...",e.data=e.data.concat(a),e.loadfailFlag=!1}})}},topLoadData:function(){var e=this;this.topLoad=!0,this.$store.dispatch("cancelLoader");a.i(r.b)({limit:this.alreadyAppear+10,start:0}).then(function(t){t&&(e.$store.dispatch("setLoader"),e.topLoad=!1,e.data=t.obj)})}}}},1124:function(e,t,a){t=e.exports=a(677)(!1),t.push([e.i,"header[data-v-26f6a7ee]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:1.173333rem;line-height:1.173333rem;position:fixed;top:0;left:0;z-index:2;width:100%;color:#333;background-color:#fff;border-bottom:1px solid #f8f8f8}header .icon-left[data-v-26f6a7ee]{position:absolute;left:0;top:0}header .title[data-v-26f6a7ee]{width:100%;text-align:center;font-size:.48rem}header .right[data-v-26f6a7ee]{position:absolute;right:.4rem;top:0;font-size:.48rem;color:#ff6614}",""])},1125:function(e,t,a){t=e.exports=a(677)(!1),t.push([e.i,".account[data-v-26f6a7ee]{position:fixed;top:0;bottom:0;left:0;right:0;overflow:hidden;z-index:100}.account .account-wrapper[data-v-26f6a7ee]{position:relative;top:0;bottom:0;width:100%;height:100%}.account .account-wrapper .header-box[data-v-26f6a7ee]{position:absolute;top:0;width:100%;z-index:3}.account .account-wrapper .header-box .type-header[data-v-26f6a7ee]{background:#fff;color:#333;font-size:.48rem;height:1.173333rem;line-height:1.173333rem;text-align:center;border:.013333rem solid #ddd}.account .account-wrapper .header-box .type-header .goback[data-v-26f6a7ee]{width:.333333rem;height:.546667rem;position:absolute;left:.453333rem;top:.32rem;background-size:25px41px}.account .account-wrapper .header-box .type-header .type-text[data-v-26f6a7ee]{display:block;width:3.413333rem;margin:0 auto;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.account .line-first[data-v-26f6a7ee]{position:absolute;top:1.173333rem;width:100%;height:.32rem;background-color:#eee;z-index:1}.account .line-second[data-v-26f6a7ee]{position:absolute;top:6.826667rem;width:100%;height:.32rem;background-color:#eee;z-index:1}.account .integral-wrapper[data-v-26f6a7ee]{position:absolute;top:1.12rem;width:100%;height:5.333333rem;background-color:#fff;z-index:1}.account .integral-wrapper .left-box[data-v-26f6a7ee]{float:left;width:50%;height:5.333333rem}.account .integral-wrapper .left-box .integral-title[data-v-26f6a7ee]{display:block;margin:.8rem 0 .4rem .8rem;font-size:.373333rem;color:#494949}.account .integral-wrapper .left-box .integral-num[data-v-26f6a7ee]{display:block;margin:0 0 .8rem .8rem;font-size:1.6rem;color:#ff6419}.account .integral-wrapper .left-box .integral-button[data-v-26f6a7ee]{margin-left:.8rem;width:3.2rem;height:.8rem;text-align:center;line-height:.8rem;font-size:.373333rem;color:#fff;background-color:#ff6419;border-radius:.4rem}.account .right-box[data-v-26f6a7ee]{float:right;position:relative;width:40%;height:5.333333rem}.account .right-box .meal-title[data-v-26f6a7ee]{display:block;margin:.8rem 0 .533333rem;font-size:.373333rem;color:#494949}.account .right-box .meal-content[data-v-26f6a7ee]{display:block;margin-bottom:.266667rem;font-size:.533333rem;font-family:PingFang-SC-Bold;color:#ff6419}.account .right-box .meal-date[data-v-26f6a7ee]{display:block;font-size:.266667rem;color:#494949}.account .right-box .bg[data-v-26f6a7ee]{position:absolute;bottom:.533333rem;right:-.4rem;width:1.826667rem;height:1.866667rem;background-size:1.826667rem 1.866667rem}.account .record-wrapper[data-v-26f6a7ee]{position:absolute;top:7.146667rem;bottom:0;width:100%;background-color:#eee}.account .record-wrapper .record-header[data-v-26f6a7ee]{position:absolute;top:0;width:100%;height:1.173333rem;border-bottom:.013333rem solid #eee;background-color:#fff;z-index:1}.account .record-wrapper .record-header .record-title[data-v-26f6a7ee]{display:block;float:left;margin-left:.4rem;line-height:1.173333rem;font-size:.4rem;color:#494949}.account .record-wrapper .record-header .record-total[data-v-26f6a7ee]{display:block;float:right;margin-right:.4rem;line-height:1.173333rem;font-size:.4rem;color:#494949}.account .record-content[data-v-26f6a7ee]{position:absolute;top:1.173333rem;bottom:1.306667rem;width:100%}.account .record-content .list-wrapper[data-v-26f6a7ee]{width:100%}.account .record-content .list-wrapper .list-item[data-v-26f6a7ee]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:1.866667rem;border-bottom:.013333rem solid #eee;background-color:#fff}.account .record-content .list-wrapper .list-item .left-wrap[data-v-26f6a7ee]{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.account .record-content .list-wrapper .list-item .left-wrap .left-item[data-v-26f6a7ee]{margin:.4rem 0}.account .record-content .list-wrapper .list-item .left-wrap .left-item .name[data-v-26f6a7ee]{display:block;margin-bottom:.346667rem;margin-left:.4rem;width:5.333333rem;font-size:.4rem;color:#494949;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;height:.573333rem;line-height:.573333rem}.account .record-content .list-wrapper .list-item .left-wrap .left-item .data[data-v-26f6a7ee]{display:block;margin-left:.4rem;font-size:.32rem;color:#8e8e8e}.account .record-content .list-wrapper .list-item .right-wrap[data-v-26f6a7ee]{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.account .record-content .list-wrapper .list-item .right-wrap .integral[data-v-26f6a7ee]{display:block;float:right;line-height:1.813333rem;margin-right:.4rem;font-size:.48rem;color:#ff6419}.account .record-content .list-wrapper .list-item .right-wrap .integral .free-integral[data-v-26f6a7ee]{color:#494949}",""])},1226:function(e,t,a){var o=a(1124);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);var r=a(678).default;r("999f23cc",o,!0,{})},1227:function(e,t,a){var o=a(1125);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);var r=a(678).default;r("1288e84a",o,!0,{})},1542:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"account"},[a("div",{staticClass:"account-wrapper"},[a("header",[a("i",{staticClass:"icon-left",on:{click:function(t){e.$router.push("/user")}}}),e._v(" "),a("div",{staticClass:"title"},[e._v("我的账户")])]),e._v(" "),a("div",{staticClass:"line-first"}),e._v(" "),a("div",{staticClass:"integral-wrapper"},[a("div",{staticClass:"left-box"},[a("span",{staticClass:"integral-title"},[e._v("剩余度币")]),e._v(" "),a("span",{staticClass:"integral-num"},[e._v(e._s(e.integral))]),e._v(" "),a("div",{staticClass:"integral-button",on:{click:e.toPayPage}},[e._v("去充值")])]),e._v(" "),a("div",{staticClass:"right-box"},[a("span",{staticClass:"meal-title",domProps:{textContent:e._s("0"!==e.mealState?"已开通":"未开通")}}),e._v(" "),a("span",{staticClass:"meal-content"},[e._v("渲染套餐")]),e._v(" "),"0"!==e.mealState?a("span",{staticClass:"meal-date"},[e._v(e._s(e.mealExpiryTime)+"到期")]):e._e(),e._v(" "),a("div",{staticClass:"bg"})])]),e._v(" "),a("div",{staticClass:"line-second"}),e._v(" "),a("div",{staticClass:"record-wrapper"},[a("div",{staticClass:"record-header border-1px clearfix"},[a("span",{staticClass:"record-title"},[e._v("消费记录")]),e._v(" "),a("span",{staticClass:"record-total"},[e._v("总计:  "+e._s(e.costIntegral)+"度币")])]),e._v(" "),a("scroll",{staticClass:"wrapper record-content",attrs:{data:e.data,pullup:e.pullup,pulldown:e.pulldown,beforeScroll:e.beforeScroll},on:{pullup:e.loadData,pulldown:e.topLoadData}},[a("ul",{staticClass:"list-wrapper"},[e.topLoad?a("div",{staticClass:"loading-wrapper"},[e._v("加载更多...")]):e._e(),e._v(" "),e._l(e.data,function(t,o){return a("li",{key:o,staticClass:"list-item"},[a("div",{staticClass:"left-wrap"},[a("div",{staticClass:"left-item"},[a("span",{staticClass:"name"},[e._v(e._s(t.productName))]),e._v(" "),a("span",{staticClass:"data"},[e._v(e._s(t.orderDate))])])]),e._v(" "),a("div",{staticClass:"right-wrap"},[a("span",{staticClass:"integral",class:0==t.totalFee?"free-integral":""},["In"==t.financeType?[e._v("+")]:e._e(),"Out"==t.financeType?[e._v("-")]:e._e(),[e._v(e._s(t.totalFee)),"mobile_postphone"===t.productType?["weixinpay"===t.payType||"alipay"===t.payType?[e._v("度币")]:[e._v("元")]]:e._e(),["render_product_pay"===t.productType||"franchiser_product_pay"===t.productType?[e._v("元")]:[e._v("度币")]]]],2)])])}),e._v(" "),a("div",{staticClass:"loading-wrapper"},[e._v(e._s(e.loadEnd))])],2)])],1)])])},staticRenderFns:[]}},706:function(e,t,a){function o(e){a(1226),a(1227)}var r=a(6)(a(1019),a(1542),o,"data-v-26f6a7ee",null);e.exports=r.exports},788:function(e,t,a){"use strict";var o={data:function(){return{file:""}},methods:{fileChange:function(e){this.file=e.target.files[0],e.target.files[0].size&&(this.fileList(e.target),e.target.value="")},fileList:function(e){for(var t=e.files,a=0;a<t.length;a++)""!=t[a].type&&this.fileAdd(t[a])},fileAdd:function(e){var t=this;if(void 0!==this.limit&&this.limit--,!(void 0!==this.limit&&this.limit<0))if(this.size=this.size+e.size,-1==e.type.indexOf("image"))this.$toast("请选择图片文件");else{var a=new FileReader,o=new Image;a.readAsDataURL(e),a.onload=function(){e.src=this.result,o.onload=function(){var a=o.width,r=o.height;e.width=a,e.height=r,t.callback(e)},o.src=e.src}}},goShop:function(){this.$router.push("/home")},timeFn:function(e){var t=new Date(e.replace(/-/g,"/")),a=new Date,o=a.getTime()-t.getTime(),r=Math.floor(o/864e5),i=o%864e5,l=Math.floor(i/36e5),n=i%36e5,s=Math.floor(n/6e4),c=n%6e4;return[r,l,s,Math.round(c/1e3)]}},created:function(){this.probeType=3,this.listenScroll=!0}};t.a=o},854:function(e,t,a){"use strict";function o(e){return i.l.get("/v1/web/pay/payOrder/findExpenseRecordList",e,{headers:{"Platform-Code":l}})}function r(e){return i.l.get("v1/web/system/sysUser/getUserBalance",e,{headers:{"Platform-Code":l}})}t.b=o,t.a=r;var i=a(14),l="mobile2b"}});