webpackJsonp([41],{1090:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=i(13),n=i.n(o),a=i(12),c=i.n(a),s=i(68),r=i.n(s),l=i(263),p=(i(160),i(33));t.default={data:function(){return{codeColor:"#fff",codeBg:"#ff662e",codetit:"获取验证码",i:60,phone:"",code:"",timer:"",userType:11,constType:1,isMultipleFranchiserAccount:!1}},computed:r()({},i.i(p.b)("common",["userInfo"]),{isGetCode:function(){return 11===this.phone.length},isSubmit:function(){return 11===this.phone.length&&this.code},isClearTime:function(){if(!this.isGetCode){var e=["获取验证码","#fff","#ff662e"];return this.codetit=e[0],this.codeColor=e[1],this.codeBg=e[2],clearInterval(this.timer)}}}),created:function(){var e=this;this.userType=JSON.parse(localStorage.getItem("userInfo")).userType,3===this.userType&&this.API.amendType().then(function(t){1===t.obj&&(e.isMultipleFranchiserAccount=!0)})},methods:r()({},i.i(p.c)("common",["SET_USER_INFO"]),i.i(p.d)("login",["getAccount"]),{selConstType:function(e){this.constType=e},clear:function(){this.phone=""},showPhoneToast:function(){this.$toast("请输入手机号")},save:function(e){var t=this;if(this.isSubmit)if(/^[1][3-9][0-9]{9}$/.test(this.phone)){var i=new FormData;i.append("mobile",this.phone),i.append("phoneCode",this.code),1===e?i.append("comfirmFlag",1):i.get("comfirmFlag")&&i.delete("comfirmFlag"),3==this.userType&&i.append("enterpriseFlag",this.constType),this.API.btnDisabled(i).then(function(e){if(e){if(localStorage.setItem("rememberPhone",t.phone),10010212===e.exceptionCode)return void t.$confirm({title:"提示",msg:"该手机号已绑定其他账号，再次绑定将会合并账号信息，是否确认绑定？"}).success(function(e){e.close();var i=new FormData;i.append("mobile",t.phone),i.append("phoneCode",t.code),i.append("comfirmFlag",1),3==t.userType&&i.append("enterpriseFlag",t.constType),t.API.btnDisabled(i).then(function(e){e.success?(t.getAccount(t.phone),localStorage.setItem("rememberPhone",t.phone),t.$router.push("/login")):t.$toast(e.message)})});if(t.$store.state.popupMsg=e.message,t.$store.commit("showPopup"),t.$toast(e.message),e.success){var i=JSON.parse(localStorage.getItem("userInfo"));i.loginPhone=t.phone,i.mobile=t.phone,t.getAccount(t.phone),localStorage.setItem("rememberPhone",t.phone),t.SET_USER_INFO(i),setTimeout(function(){t.$router.go(-1)},2e3)}else t.$toast(e.message)}})}else this.$toast("请输入正确的手机号")},getCode:function(){var e=this;return c()(n.a.mark(function t(){var o,a,c;return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:o=e.i,"获取验证码"==e.codetit&&/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(e.phone)?(a=e,e.timer=setInterval(function(){o--,a.codetit=o+"s",a.codeBg="#e8e8e8",a.codeColor="#ff662e",o<1&&(clearInterval(a.timer),a.codetit="获取验证码",a.codeBg="#ff662e",a.codeColor="#fff",a.i=60)},1e3),c={phoneNumber:e.phone,msgId:11},i.i(l.h)(c).then(function(t){t.status&&e.$toast("验证码发送成功")})):e.$toast("请输入正确的手机号");case 2:case"end":return t.stop()}},t,e)}))()}}),activated:function(){this.phone=this.code=""}}},1194:function(e,t,i){t=e.exports=i(677)(!1),t.push([e.i,"header[data-v-c4398eea]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:1.173333rem;line-height:1.173333rem;position:fixed;top:0;left:0;z-index:2;width:100%;color:#333;background-color:#fff;border-bottom:1px solid #f8f8f8}header .icon-left[data-v-c4398eea]{position:absolute;left:0;top:0}header .title[data-v-c4398eea]{width:100%;text-align:center;font-size:.48rem}header .right[data-v-c4398eea]{position:absolute;right:.4rem;top:0;font-size:.48rem;color:#ff6614}",""])},1195:function(e,t,i){t=e.exports=i(677)(!1),t.push([e.i,".change-phone[data-v-c4398eea]{height:100%;background:#f5f5f5;box-sizing:border-box;padding-top:1.173333rem;overflow:hidden}.change-phone .line[data-v-c4398eea]{height:.266667rem}.change-phone .butbox[data-v-c4398eea]{text-align:center;margin-top:1.92rem}.change-phone .butbox .butsp[data-v-c4398eea]{display:inline-block;width:8rem;height:1.173333rem;line-height:1.173333rem;background-image:-webkit-linear-gradient(right,#999,#c9c9c9),-webkit-linear-gradient(#ff6419,#ff6419);background-image:linear-gradient(-90deg,#999,#c9c9c9),linear-gradient(#ff6419,#ff6419);background-blend-mode:normal,normal;border-radius:.586667rem;font-size:.48rem;color:#fff;letter-spacing:.133333rem}.change-phone .constType[data-v-c4398eea]{padding:0 .4rem;background:#fff}.change-phone .constType .type_item[data-v-c4398eea],.change-phone .constType .type_title[data-v-c4398eea]{height:1.173333rem;line-height:1.173333rem;font-size:.4rem;color:#333}.change-phone .constType .type_item .item_selicon[data-v-c4398eea]{width:.4rem;height:.4rem;vertical-align:middle}.change-phone .constType .type_item span[data-v-c4398eea]{vertical-align:middle}.change-phone .box[data-v-c4398eea]{position:relative;padding:0 .4rem;background:#fff}.change-phone .box .inpu[data-v-c4398eea]{width:8.666667rem;height:1.173333rem;font-size:.426667rem;font-family:PingFang-SC-Regular;color:#333;border:0;outline:none}.change-phone .box .icon[data-v-c4398eea]{width:.4rem;height:.4rem;border-radius:50%}.change-phone .box .get-code[data-v-c4398eea]{position:absolute;right:0;top:0;width:3.2rem;height:1.173333rem;line-height:1.173333rem;font-size:.426667rem;font-family:PingFang-SC-Regular;z-index:1;text-align:center}",""])},1296:function(e,t,i){var o=i(1194);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);var n=i(678).default;n("1ba619ab",o,!0,{})},1297:function(e,t,i){var o=i(1195);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);var n=i(678).default;n("4f54446c",o,!0,{})},1607:function(e,t,i){e.exports={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"change-phone"},[o("header",[o("i",{staticClass:"icon-left",on:{click:function(t){e.$router.back()}}}),e._v(" "),o("div",{staticClass:"title"},[e._v("修改手机号")])]),e._v(" "),e.userType/1==3&&e.isMultipleFranchiserAccount?o("div",{staticClass:"line"}):e._e(),e._v(" "),e.userType/1==3&&e.isMultipleFranchiserAccount?o("div",{staticClass:"constType"},[o("div",{staticClass:"type_title"},[e._v("选择修改类型：")]),e._v(" "),o("div",{staticClass:"type_item",on:{click:function(t){e.selConstType(1)}}},[o("img",{staticClass:"item_selicon",attrs:{src:i(1===e.constType?902:901),alt:""}}),e._v(" "),o("span",[e._v("仅修改当前企业")])]),e._v(" "),o("div",{staticClass:"type_item",on:{click:function(t){e.selConstType(2)}}},[o("img",{staticClass:"item_selicon",attrs:{src:i(2===e.constType?902:901),alt:""}}),e._v(" "),o("span",[e._v("修改关联的所有企业")])])]):e._e(),e._v(" "),o("div",{staticClass:"line"}),e._v(" "),o("div",{staticClass:"box"},[o("input",{directives:[{name:"model",rawName:"v-model",value:e.phone,expression:"phone"}],staticClass:"inpu",attrs:{maxlength:"11",type:"text",placeholder:"请输入手机号"},domProps:{value:e.phone},on:{input:function(t){t.target.composing||(e.phone=t.target.value)}}}),e._v(" "),o("img",{staticClass:"icon",attrs:{src:i(968)},on:{click:e.clear}})]),e._v(" "),o("div",{staticClass:"line"}),e._v(" "),o("div",{staticClass:"box"},[o("input",{directives:[{name:"model",rawName:"v-model",value:e.code,expression:"code"}],key:e.isClearTime,staticClass:"inpu",attrs:{maxlength:"10",type:"number",placeholder:"请输入验证码"},domProps:{value:e.code},on:{input:function(t){t.target.composing||(e.code=t.target.value)}}}),e._v(" "),e.isGetCode?e._e():o("div",{staticClass:"get-code",style:{color:"#fff",background:"#e8e8e8"}},[e._v("获取验证码")]),e._v(" "),e.isGetCode?o("div",{staticClass:"get-code",style:{color:e.codeColor,background:e.codeBg},on:{click:e.getCode}},[e._v(e._s(e.codetit))]):e._e()]),e._v(" "),o("div",{staticClass:"butbox"},[o("span",{staticClass:"butsp",style:e.isSubmit?"background: #ff6419;":"",on:{click:function(t){e.save(0)}}},[e._v("确定")])])])},staticRenderFns:[]}},777:function(e,t,i){function o(e){i(1296),i(1297)}var n=i(6)(i(1090),i(1607),o,"data-v-c4398eea",null);e.exports=n.exports},901:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAoNJREFUSIm9l0FP1EAUx3/bYSdpOGxdgV48mah3Ej+CcOeAfAU1An4SlygyHwE8cGf9CEbvhsSTBwa22JJsmkx3Wg9Ml7WJdlm6/JOe3rS/mb6+1/9rFUVBnbTWbWAdeAE8Bx4DgQvHwE/gK/AFOFFKZXXPbP0PrLUOgF3gtZRyWUqJlBIhBK1WC4CiKLDWYowprwGwD/SUUvGtwVrrLaDn+364uLiIEKLuEABYaxkOh6RpqoFdpdThVGCttQA+CCFedTod2u32VMCqsiwjSRKstQfAW6WU/SfYQT9LKTeCIBi/zlmV5zlJkmCMOQY2J+FeZW2vKSiA53kEQYCUcgPYm4yNT6y1fimEOOx2u3hedT93U1EURFGEtXZLKXU0Bruv90e3212ZNad1yrKMy8vLc+CZUiouj7br+/7coADtdhvf91e4Lk9aZ2dnEvi1tLS0PG3JzCprLYPB4AJ45AFrUsq5QwGEEEgpl4G1Ejx3aCnHWveA1XnmtirHWvWApwsLC/cGdqwnHtBpollMK8fqNNspbiEPSKb5Jzclx0o84HQ0Gt0b2LFOPeBbltUahsbkWN89oG+MuTewY/VLcGStrbnl7nIW6QI48cIwNMDH4XA4d7BjfFJKmbKcemmans8z11mWkabpBdAD50DCMIyB7SRJyPO8cWhRFFxdXQFsl85z3EDCMDyy1u4nSUKTdV0UBXEcMxqN9icdZ7Vz7RhjjuM4bgSe5zlxHJdmb2cy9hc4DEMLbBpjDqIo4i45d1YHY8wBFYcJ9YZ+z/f9lRkN/TmwM7Whr8AD4B3wRkr5cMoRJuJ6hHk/0whT2UA5tK1xM7Q9cOHf3AxtfaCvlKpthX8AMMZqkygweLoAAAAASUVORK5CYII="},902:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAqJJREFUSIm9101sVFUYxvFfp4CphDJ81RRHQkAgYEwMhsSw0A2UfUNLQ8KuYVCg5Ws/GRZs5KNWAevOAElBwp6yggQXGly4ICyAKAwIhcKUBI3FUhf33jJMmHtnSttnd895zvu/5557znnfurHOZlVoJjZhI9ZhGdJhXxG38Ssu4WI+k32RFLAuAZzGHnyFRdW8IR7jOHrymWyxkikVE6ADN5CrAQoLwzE3coW+jkqmN824Ht/iyxpgcTqJ3flMdrS0sXzG9Tg3iVBhrHO5Ql99HLgHrZMIjdSKbyqBt2DXFEAj7cwV+raUg9PonUJopN5coS9dCt6DpmkAN4UsdWOdzbNQUNuWeRs9QiaFlkmDzk6zt5/M6jjXIrRE4LfXu43sO8uaz9l6KMm9KYW1iUHrZ8b3NzQGM13yMQ9v88OOpIhrU1gZa/noCw5epmlpBegcus+w9BMG/+BIG8WHSeAVKcyNtWzYHkD3n2fhktf73plN12mWf8rjOxzZzNO/kqAwN+6SCPT9dm7+wvzFHPiJ+e8H7bMa6DrFh+t4co/DbTy5Xw0UwT4ejnX8+5zebdy6xoIPOHCe95ax+0dWfhbM8HAbQ3erhmK4bqyz+SrWJ1obGtnXH6zly/9IzaD4gK9bg7WtTT+ncK0q6z/PONbBn78H0OHB4EeqHQq/pTBQtf3vEH79CkfbeXBrIlAYiI7M+1gw0Sg1avzIHMF30wSFE/lMdiTaTj0YnAboo5A1fi0W0TUN4K4o8yw9QM4K0tKp0vF8JtsfPZSfXN24MAXQC2HscZWDR9EuSEknSyfRXp7ezniDcVRQOVwRZIYTTYkG0V36eUsVd0n0YxUOYqgG4FA4ZlUlKMm1U6SoaGvxqmibF/Y99apoG8BAPpMdSQr4P5pEqQqWxZVhAAAAAElFTkSuQmCC"},968:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAjtJREFUSIm1189LFGEYwPFPkyRqeqk8WgRibaeg6JaV185lEFQQXcr+jP6A6Ad2iTqUdg3qJOkxCjxpUZfyaHUyFSu1w/uO7E6zzKvtfmFgd+fZ5zvvzDPPPLNrfHxcArtxDEdxCPvRHfet4Du+4APmsF6VsKNifzdGMIzeJjF9cTuMc/iJaUzFg9q2+CQuxKTbYS/O4zRe4F2qOMOosMr/oQ/XMYgJbBQlxe83WiCtZzjmbHAVxRdwvIXSnOO42Ex8AmfbIM05Ex0N4m7hurab0ejaEo9ofru0kt7o0hG3qmJ6i0l04apQqfV8xFOs4ZK6U1rCMF5nqKle7QSWhQ51N4py5nAPP4Tm8bwiVy9qubiKzrrPv3A/yufwEL/r9ncl5KtlGEgIvIY9JfKitBNXEvINZOhPCBzCzRJ5UTrm3+tfRn8m7dTAkRL5TqTQVexcVaxjs+T3TQmPwnoyrCbGlhVSTn3BpbCaYTEhcB4P/HtNywruU0K+xQwLCYGP8acgHVNecE8S8i1kwmqqKJMOKi+4tYR887l4uSJwFD3CrHVbY/UewS3sE7rS5YpcS5jvEFbzRhhXmnEqbs0Ywp0KYc4M/uS301Q8knazFF1bj8UV4UHQbiajq2ECeS+Mpe1iWt3EWexck5htg3Q25t6iKN7AI6EAWsVMzNkw3pbN1Rt4hs/CZLjTkWhJWGXyQJ/zTujPI8L02ZMoXBZuzx2/woh/fIlXwktbDQdxQONL2zd8FZrRvMZOV8pfKrV+bpQuru8AAAAASUVORK5CYII="}});