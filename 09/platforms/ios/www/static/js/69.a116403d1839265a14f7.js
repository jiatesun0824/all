webpackJsonp([69],{1067:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(788);i(33);e.default={mixins:[a.a],data:function(){return{tabIndex:0,yi:!0,ya:!1,fo:!1,yo:!1,silder:[{id:""},{id:""},{id:""},{id:""},{id:""}]}},methods:{back:function(){this.$emit("back")},selFotterNav:function(t){switch(this.tabIndex=t,t){case 0:this.yi=!0,this.ya=!1,this.fo=!1,this.yo=!1;break;case 1:this.yi=!1,this.ya=!0,this.fo=!1,this.yo=!1;break;case 2:this.yi=!1,this.ya=!1,this.fo=!0,this.yo=!1;break;case 3:this.yi=!1,this.ya=!1,this.fo=!1,this.yo=!0}}}}},1133:function(t,e,i){e=t.exports=i(677)(!1),e.push([t.i,'.tab[data-v-36d474da]{position:relative}.tab .header[data-v-36d474da]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:1.173333rem;line-height:1.173333rem;width:100%;color:#333;background-color:#fff;border-bottom:.013333rem solid #f8f8f8;position:relative}.tab .header .icon-left[data-v-36d474da]{position:absolute;left:0;top:0}.tab .header .title[data-v-36d474da]{width:100%;text-align:center;font-size:.48rem}.tab .header .right[data-v-36d474da]{position:absolute;right:.4rem;top:0;font-size:.48rem;color:#ff6614}.tab .content-tab[data-v-36d474da]{padding:.413333rem 0;font-size:.373333rem;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;border-bottom:.013333rem solid #f8f8f8}.tab .content-tab .active[data-v-36d474da]{color:#ff6419;position:relative}.tab .content-tab .active[data-v-36d474da]:after{content:"";width:.533333rem;height:.053333rem;background-color:#ff6419;position:absolute;bottom:-.413333rem;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.tab .box[data-v-36d474da]{position:absolute;top:100%;left:0;overflow-y:scroll;padding:0 .4rem}.tab .box .silder[data-v-36d474da]{width:9.2rem;height:5.173333rem;background-color:#e8e8e8;border-radius:.133333rem;position:relative;margin:.4rem 0}.tab .box .silder .itemImg[data-v-36d474da]{width:100%;height:100%;position:absolute;left:0;top:0}',""])},1235:function(t,e,i){var a=i(1133);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var o=i(678).default;o("5bcd0fa8",a,!0,{})},1460:function(t,e,i){t.exports=i.p+"static/img/banner_01.b0e510f.png"},1550:function(t,e,i){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"tab"},[a("div",{staticClass:"content-tab borderBottom"},[a("span",{class:t.yi?"active":"",on:{click:function(e){t.selFotterNav(0)}}},[t._v("一键方案(20)")]),t._v(" "),a("span",{class:t.ya?"active":"",on:{click:function(e){t.selFotterNav(1)}}},[t._v("样板方案(20)")]),t._v(" "),a("span",{class:t.fo?"active":"",on:{click:function(e){t.selFotterNav(2)}}},[t._v("服务详情")]),t._v(" "),a("span",{class:t.yo?"active":"",on:{click:function(e){t.selFotterNav(3)}}},[t._v("用户评价")])]),t._v(" "),a("div",{staticClass:"box"},t._l(t.silder,function(t,e){return a("div",{key:e,staticClass:"silder"},[a("img",{staticClass:"itemImg",attrs:{src:i(1460),alt:""}})])}))])},staticRenderFns:[]}},754:function(t,e,i){function a(t){i(1235)}var o=i(6)(i(1067),i(1550),a,"data-v-36d474da",null);t.exports=o.exports},788:function(t,e,i){"use strict";var a={data:function(){return{file:""}},methods:{fileChange:function(t){this.file=t.target.files[0],t.target.files[0].size&&(this.fileList(t.target),t.target.value="")},fileList:function(t){for(var e=t.files,i=0;i<e.length;i++)""!=e[i].type&&this.fileAdd(e[i])},fileAdd:function(t){var e=this;if(void 0!==this.limit&&this.limit--,!(void 0!==this.limit&&this.limit<0))if(this.size=this.size+t.size,-1==t.type.indexOf("image"))this.$toast("请选择图片文件");else{var i=new FileReader,a=new Image;i.readAsDataURL(t),i.onload=function(){t.src=this.result,a.onload=function(){var i=a.width,o=a.height;t.width=i,t.height=o,e.callback(t)},a.src=t.src}}},goShop:function(){this.$router.push("/home")},timeFn:function(t){var e=new Date(t.replace(/-/g,"/")),i=new Date,a=i.getTime()-e.getTime(),o=Math.floor(a/864e5),s=a%864e5,n=Math.floor(s/36e5),r=s%36e5,d=Math.floor(r/6e4),l=r%6e4;return[o,n,d,Math.round(l/1e3)]}},created:function(){this.probeType=3,this.listenScroll=!0}};e.a=a}});