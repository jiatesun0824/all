webpackJsonp([83],{690:function(t,e,i){function a(t){i(937)}var s=i(6)(i(926),i(968),a,"data-v-490ee0e7",null);t.exports=s.exports},926:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(16);i.n(a);e.default={name:"cityselect",props:{provance:String,city:String,area:String,street:String,title:{type:String,default:"所在地区"},chooseTitle:{type:String,default:"请选择"},items:{type:Array,required:!0},columns:{validator:function(t){return/^\d*$/.test(t)}},show:{type:Boolean,default:!1}},data:function(){return{navIndex:1,columnNum:1,nav:{txt1:this.chooseTitle,txt2:"",txt3:"",txt4:""},columnsObj:{},active:{},activeClasses:"",itemHeight:40,showContent:!1}},computed:{cityListData:function(){if(this.items.length)return this.init(),!0}},methods:{init:function(){var t=this;this.items&&this.items[0]&&this.isArray(this.items)&&(this.columns&&~~this.columns>1?this.columnNum=~~this.columns:this.getColumsNum(this.items[0]),this.columnsObj.columnItems1=this.items,this.provance&&this.$nextTick(function(){t.setDefalutValue(t.items,"provance",1)}))},navEvent:function(t){this.columnNum>2&&(t>=this.columnNum-1?this.forwardView(!0,t):this.backoffView(!0,t)),this.navIndex=t},itemEvent:i.i(a.debounce)(function(t,e,i,a){if(this.active["itemValue"+t]=i,this.active["itemName"+t]=e,this.nav["txt"+t]=e,this.columnsObj["columnItems"+(t+1)]=a,t>1&&a&&a.length>0&&this.columnNum>2&&this.forwardView(!0,t),this.clearNavTxt(t),t===this.columnNum||a.length<=0){if(t!==this.columnNum)for(var s=this.columnNum;s>=0;s--)s>t&&(this.active["itemValue"+s]="",this.active["itemName"+s]="",this.nav["txt"+s]="");this.navIndex=t,this.returnValue()}else this.navIndex=t+1,this.nav["txt"+(t+1)]=this.chooseTitle},20),currentClass:function(t,e,i){return t&&t==this.active["itemValue"+i]||e&&e===this.active["itemName"+i]?"active":""},clearNavTxt:function(t){for(var e=0;e<this.columnNum;e++)e>t&&(this.nav["txt"+(e+1)]="")},getColumsNum:function(t){this.isArray(t.baseAreaVos)&&(this.columnNum++,this.getColumsNum(t.baseAreaVos[0]))},isArray:function(t){return t&&t.constructor===Array&&t.length>0},setDefalutValue:function(t,e,i){var a=this;t.every(function(t,s){if(t.areaCode==a[e]||t.areaName===a[e]){var n=a.columnsObj["columnItems"+(i+1)]=t.baseAreaVos,o=a.$refs["itemBox"+i][0];return o.scrollTop=s*a.itemHeight-o.offsetHeight/3,a.active["itemValue"+i]=t.areaCode,a.active["itemName"+i]=t.areaName,a.nav["txt"+i]=t.areaName,a.navIndex=i,++i,i>=a.columnNum&&a.columnNum>2&&a.forwardView(!1),a.isArray(n)&&a.setDefalutValue(n,["","provance","city","area"][i],i),!1}return!0})},returnValue:function(){this.$emit("result",this.active),this.showContent=!1},backoffView:function(t,e){this.activeClasses=(t?"cityselect__move--animate":"")+(1===e?" cityselect__prev2":" cityselect__prev")},forwardView:function(t,e){console.warn(this.navIndex,e),this.activeClasses=(t?"cityselect__move--animate":"")+(2===e?" cityselect__next":" cityselect__next2")}},watch:{show:function(t){t&&(this.showContent=t)}}}},932:function(t,e,i){var a=i(676);e=t.exports=i(674)(!1),e.push([t.i,'.cityselect__container[data-v-490ee0e7]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000}.cityselect__content[data-v-490ee0e7]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:absolute;bottom:0;left:0;width:100%;height:75%;background-color:#fff;-webkit-transition:-webkit-transform .2s;transition:-webkit-transform .2s;transition:transform .2s;transition:transform .2s,-webkit-transform .2s;z-index:1100}.cityselect__content.upward-enter-active[data-v-490ee0e7]{-webkit-transition:all .2s ease;transition:all .2s ease}.cityselect__content.upward-leave-active[data-v-490ee0e7]{-webkit-transition:all .15s ease;transition:all .15s ease}.cityselect__content.upward-enter[data-v-490ee0e7],.cityselect__content.upward-leave-active[data-v-490ee0e7]{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}.cityselect__header[data-v-490ee0e7]{-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;position:relative;width:100%}.cityselect__header[data-v-490ee0e7]:after{content:"";position:absolute;left:0;bottom:0;width:100%;height:1px;background-color:#bdbdbd;-webkit-transform:scaleY(.5);transform:scaleY(.5)}.cityselect__title[data-v-490ee0e7]{position:relative;width:100%;height:1.2rem;line-height:1.2rem;font-size:.4rem;text-align:center;color:#666}.cityselect__title[data-v-490ee0e7]:after{content:"";position:absolute;left:0;bottom:0;width:100%;height:1px;background-color:#b2b2b2;-webkit-transform:scaleY(.5);transform:scaleY(.5)}.cityselect__nav[data-v-490ee0e7]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;padding-left:.266667rem;overflow:hidden;box-sizing:border-box}.cityselect__nav--item[data-v-490ee0e7]{font-size:.346667rem;color:#222;display:block;height:1.066667rem;line-height:1.226667rem;padding:0 .213333rem;position:relative;margin-right:.4rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:40%}.cityselect__nav--item.active[data-v-490ee0e7]{color:#ff6419!important}.cityselect__nav--item.active[data-v-490ee0e7]:after{content:"";width:100%;height:.053333rem;background-color:#ff6419;position:absolute;bottom:.026667rem;left:0;z-index:2}.cityselect__body[data-v-490ee0e7]{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;box-sizing:border-box}.cityselect__item[data-v-490ee0e7]{display:block;height:inherit;width:50%;-webkit-box-flex:0;-webkit-flex:0 0 50%;-ms-flex:0 0 50%;flex:0 0 50%;overflow-y:auto;-webkit-overflow-scrolling:touch;background-color:#fff}.cityselect__item[data-v-490ee0e7]:nth-child(2n){background-color:#f5f5f5}.cityselect__box[data-v-490ee0e7]{width:100%;padding:0 .4rem;box-sizing:border-box}.cityselect__box--item[data-v-490ee0e7]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:relative;height:40px;line-height:40px;width:100%;font-size:.346667rem;color:#333;overflow:hidden}.cityselect__box--item span[data-v-490ee0e7]{display:block;height:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cityselect__box--item.active[data-v-490ee0e7]{color:#ff6419!important}.cityselect__box--item.active[data-v-490ee0e7]:after{content:"";position:absolute;top:0;right:0;width:.4rem;height:100%;background-image:url('+a(i(941))+');background-repeat:no-repeat;background-position:50%}.cityselect__box--item[data-v-490ee0e7]:before{content:"";position:absolute;left:0;bottom:0;width:100%;height:1px;background-color:#ececec;-webkit-transform:scaleY(.5);transform:scaleY(.5)}.cityselect__move--animate[data-v-490ee0e7]{-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s}.cityselect__prev[data-v-490ee0e7]{-webkit-transform:translate(-50%);transform:translate(-50%)}.cityselect__prev2[data-v-490ee0e7]{-webkit-transform:translate(0);transform:translate(0)}.cityselect__next[data-v-490ee0e7]{-webkit-transform:translate(-50%);transform:translate(-50%)}.cityselect__next2[data-v-490ee0e7]{-webkit-transform:translate(-100%);transform:translate(-100%)}',""])},937:function(t,e,i){var a=i(932);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var s=i(675).default;s("5785ef25",a,!0,{})},941:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyBzdHlsZT0id2lkdGg6IDFlbTsgaGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNODQ3LjY1OTI2ODggMzU0LjM1NDEyNzAyTDQ1My43NjI1ODcyMiA3NDcuMjU0MjMyNDdjLTAuNzQ3NDMyMjggMC43NDc0MzIyOC0wLjg3MjAwNDIgMS43NDQwMDg0LTEuNjE5NDM1NzUgMi40OTE0Mzk5Ny0xNC4yMDEyMDg5MiAxNC4yMDEyMDg5Mi0zNS4xMjkzMDU0MiAxNy4zMTU1MDg1LTUyLjQ0NDgxNDY0IDkuODQxMTg4NjEtNi43MjY4ODgzMi0yLjQ5MTQzOTk2LTEzLjA4MDA2MDg2LTYuMTA0MDI3OTYtMTguNDM2NjU2NTUtMTEuNDYwNjI0MzYtMS43NDQwMDg0LTEuNzQ0MDA4NC0yLjQ5MTQzOTk2LTMuOTg2MzA0NTItMy45ODYzMDQ1MS01Ljk3OTQ1Njc3TDE4Mi41NjkzMzE4MiA1NDguMDYzNTk1NThjLTE4LjU2MTIyODQ3LTE4LjU2MTIyODQ3LTE4LjU2MTIyODQ3LTQ4LjcwNzY1Mzk4IDAtNjcuMTQ0MzExMjQgMTguNTYxMjI4NDctMTguNTYxMjI4NDcgNDguODMyMjI1OS0xOC41NjEyMjg0NyA2Ny4zOTM0NTQzNiAwbDE2My42ODc2MTU3MSAxNjMuMzEzODk5MjEgMzYyLjI1NTM5MTUzLTM2MS4zODMzODczNGMxOS44MDY5NDkxOC0xOS44MDY5NDkxOCA1MS45NDY1MjYyLTE5LjgwNjk0OTE4IDcxLjc1MzQ3NTM4IDAgMTkuODA2OTQ5MTggMTkuNjgyMzc2NTIgMTkuODA2OTQ5MTggNTEuNjk3MzgyMzUgMCA3MS41MDQzMzA4MXoiIGZpbGw9IiNmZjY0MTkiPjwvcGF0aD48L3N2Zz4K"},968:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.cityListData?i("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],staticClass:"cityselect__container",on:{click:function(e){e.stopPropagation(),t.showContent=!1}}},[i("transition",{attrs:{name:"upward"},on:{"after-leave":function(e){t.$emit("update:show",!1)}}},[t.showContent?i("div",{staticClass:"cityselect__content",on:{click:function(t){t.stopPropagation()}}},[i("div",{staticClass:"cityselect__header"},[i("p",{staticClass:"cityselect__title",domProps:{textContent:t._s(t.title)},on:{touchstart:function(t){t.stopPropagation(),t.preventDefault()}}}),t._v(" "),i("div",{staticClass:"cityselect__nav"},t._l(t.columnNum,function(e,a){return i("a",{directives:[{name:"show",rawName:"v-show",value:!!t.nav["txt"+e],expression:"!!nav['txt' + index]"}],key:a,staticClass:"cityselect__nav--item",class:{active:e==t.navIndex},attrs:{href:"javascript:;"},domProps:{textContent:t._s(t.nav["txt"+e])},on:{click:function(i){i.stopPropagation(),t.navEvent(e)}}})}))]),t._v(" "),i("ul",{staticClass:"cityselect__body",class:t.activeClasses},t._l(t.columnNum,function(e,a){return i("li",{key:a,staticClass:"cityselect__item"},[i("scroll",{ref:"itemBox"+a,refInFor:!0,attrs:{beforeScroll:"",data:t.columnsObj["columnItems"+e]||[]}},[t.columnsObj["columnItems"+e]&&t.columnsObj["columnItems"+e].length>0?[i("div",{staticClass:"cityselect__box"},t._l(t.columnsObj["columnItems"+e],function(a,s){return i("a",{key:s,staticClass:"cityselect__box--item",class:t.currentClass(a.areaCode,a.areaName,e),attrs:{href:"javascript:;"},on:{click:function(i){i.stopPropagation(),t.itemEvent(e,a.areaName,a.areaCode,a.baseAreaVos)}}},[i("span",{domProps:{textContent:t._s(a.areaName)}})])}))]:[i("div",{staticClass:"cityselect__box",on:{touchstart:function(t){t.stopPropagation(),t.preventDefault()}}})]],2)],1)}))]):t._e()])],1):t._e()},staticRenderFns:[]}}});