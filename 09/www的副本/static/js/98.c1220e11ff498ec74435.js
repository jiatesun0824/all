webpackJsonp([98],{683:function(t,n,e){function i(t){e(841)}var r=e(6)(e(827),e(857),i,null,null);t.exports=r.exports},827:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={data:function(){return{height:"",length:0,currentIndex:0,timer:null}},props:{interval:{type:Number,default:3e3},duration:{type:Number,default:600},direction:{validator:function(t){return"up"===t||"down"===t},default:"up"}},mounted:function(){this.fixList(),this.start()},destroyed:function(){clearInterval(this.timer)},methods:{fixList:function(){var t=this,n=void 0,e=this.$refs.container.firstElementChild;this.length=this.$refs.container.children.length,"up"===this.direction?(n=e.cloneNode(!0),this.$refs.container.appendChild(n)):(n=this.$refs.container.lastElementChild.cloneNode(!0),this.$refs.container.insertBefore(n,e)),this.$nextTick(function(){t.height=t.$refs.container.offsetHeight/(t.length+1)})},start:function(){var t=this,n=void 0,e=void 0;"down"===this.direction&&this.quickJump(!1),this.timer=setInterval(function(){"up"===t.direction?t.currentIndex+=1:t.currentIndex-=1,n="transform "+t.duration+"ms ease-in-out",t.setTransition(t.$refs.container,n),e="up"===t.direction?-t.currentIndex*t.height+"px":-(t.currentIndex+1)*t.height+"px",t.setTransform(t.$refs.container,"translate3d(0,"+e+",0)"),t.currentIndex==t.length?setTimeout(function(){t.quickJump(!0)},t.duration):-1==t.currentIndex&&setTimeout(function(){t.quickJump(!1)},t.duration)},this.interval+this.duration)},quickJump:function(t){var n=void 0;this.setTransition(this.$refs.container,"transform 0ms ease-in-out"),t?(this.currentIndex=0,n="0px"):(this.currentIndex=this.length-1,n=-(this.currentIndex+1)*this.height+"px"),this.setTransform(this.$refs.container,"translate3d(0,"+n+",0)")},setTransition:function(t,n){t.style.transition=n,t.style.WebkitTransition="-webkit-"+n,t.style.MozTransition="-moz-"+n,t.style.OTransition="-o-"+n},setTransform:function(t,n){t.style.transform=n,t.style.WebkitTransform=n,t.style.MozTransform=n,t.style.OTransform=n}}}},833:function(t,n,e){n=t.exports=e(674)(!1),n.push([t.i,".zzui-broadcast-window{width:100%;overflow:hidden;-webkit-transform:translateZ(0);transform:translateZ(0);height:100%}.zzui-broadcast-window .zzui-broadcast-container{padding:0;margin:0;width:100%;height:auto}.zzui-broadcast-window .zzui-broadcast-container li{margin:0}",""])},841:function(t,n,e){var i=e(833);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var r=e(675).default;r("16cfd58e",i,!0,{})},857:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"zzui-broadcast-window",style:{height:t.height+"px"}},[e("ul",{ref:"container",staticClass:"zzui-broadcast-container"},[t._t("default")],2)])},staticRenderFns:[]}}});