webpackJsonp([67],{1064:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(156),i=a.n(r),s=a(68),c=a.n(s),o=a(109),n=a(33),h=a(16);a.n(h);t.default={name:"search-view",data:function(){return{searchTitleArr:["找供求信息","找同城服务"],hotSearchData:[],historySearchData:JSON.parse(sessionStorage.getItem("historySearchData"))||[],historySupplySearchData:JSON.parse(sessionStorage.getItem("historySupplySearchData"))||[],keyWord:"",enterPage:""}},computed:c()({},a.i(n.b)("home",["homeTypeTab"]),{activeTabIndex:function(){return a.i(h.findIndex)(this.homeTypeTab,{active:!0})},isShowHistorySearch:function(){return 0==this.activeTabIndex?this.historySupplySearchData.length>0:this.historySearchData.length>0},searchText:{get:function(){return this.keyWord},set:function(e){this.keyWord=e.trim()}}}),methods:c()({},a.i(n.d)("home",["changeTypeTab"]),{delectAll:function(){if(this.activeTabIndex)return this.historySearchData=[],void sessionStorage.removeItem("historySearchData");this.historySupplySearchData=[],sessionStorage.removeItem("historySupplySearchData")},gotoDetail:function(e,t){var a="/"+(0==this.activeTabIndex?"searchResult":"searchService");this.$router.push({path:a,query:{categoryId:2,categorySmallId:t.id}}),17==t.id?sessionStorage.setItem("currentTab","5"):18==t.id?sessionStorage.setItem("currentTab","3"):19==t.id?sessionStorage.setItem("currentTab","6"):(sessionStorage.setItem("currentTab","2"),sessionStorage.setItem("styleTile","家居类别"))},chooseItem:function(e){this.changeTypeTab(e),this.requestgetallsupplydemandcategory({type:e+1,categoryId:0==e?2:15})},goBack:function(){this.$router.go(-1)},requestgetallsupplydemandcategory:function(e){var t=this;a.i(o.a)(e).then(function(a){15==e.categoryId?(t.hotSearchData=a.obj,t.hotSearchData.push({id:20,name:"家居建材"})):t.hotSearchData=a.obj})},searchSubmit:function(){0==this.activeTabIndex?(this.historySupplySearchData.push({name:this.keyWord}),this.historySupplySearchData=this.filterRepeatData(this.historySupplySearchData),sessionStorage.setItem("historySupplySearchData",i()(this.historySupplySearchData))):(this.historySearchData.push({name:this.keyWord}),this.historySearchData=this.filterRepeatData(this.historySearchData),sessionStorage.setItem("historySearchData",i()(this.historySearchData))),this.historySearchData.length>7&&(this.historySearchData=this.historySearchData.slice(0,6)),sessionStorage.setItem("shopName",this.keyWord),sessionStorage.setItem("currentTab",this.$route.query.searchType?this.$route.query.searchType:""),this.$router.push({path:"/"+(0==this.activeTabIndex?"searchResult":"searchService"),query:{keyName:this.keyWord,isSearch:1}})},filterRepeatData:function(e){var t={};return e=e.reduce(function(e,a){return t[a.name]||(t[a.name]=e.push(a)),e},[])},searchHistory:function(e){this.searchText=e.name,this.searchSubmit()}}),created:function(){this.requestgetallsupplydemandcategory({type:+this.activeTabIndex+1,categoryId:0==this.activeTabIndex?2:15})},beforeRouteEnter:function(e,t,a){a(function(e){e.enterPage=t.name})},beforeRouteLeave:function(e,t,a){"serviceList"===e.name&&"searchService"===this.enterPage&&(sessionStorage.removeItem("serviceAreaCode"),sessionStorage.removeItem("serviceStreetCode")),a()}}},1133:function(e,t,a){var r=a(679);t=e.exports=a(677)(!1),t.push([e.i,".search-view[data-v-2d95a018]{background-color:#fff}.search-view .search-box[data-v-2d95a018]{padding:.2rem .4rem;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.search-view .search-box .search-icon[data-v-2d95a018]{display:inline-block;width:.4rem;height:.4rem;background-size:100%;vertical-align:text-top;background-image:url("+r(a(913))+');position:absolute;left:.8rem;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.search-view .search-box #search-form[data-v-2d95a018]{width:90%}.search-view .search-box #search-form .search-text[data-v-2d95a018]{background-color:#f4f4f4;border-radius:.373333rem;padding:.213333rem 0 .213333rem .8rem;width:85%;border:0}.search-view .search-box[data-v-2d95a018] ::-webkit-input-placeholder{color:#999}.search-view .search-box .cancle[data-v-2d95a018]{font-size:.373333rem;color:#ff6419;text-decoration:none}.search-view .search-box .divider-bottom[data-v-2d95a018]{bottom:-.2rem;background-color:#e8e8e8}.search-view .search-hot[data-v-2d95a018]{padding:.533333rem .4rem .453333rem}.search-view .search-hot .search-title[data-v-2d95a018]{font-size:.373333rem;margin-bottom:.266667rem;color:#999}.search-view .search-hot .search-title .active[data-v-2d95a018]{color:#ff6419}.search-view .search-hot .search-title div[data-v-2d95a018]:first-child{margin-right:.413333rem}.search-view .search-hot .search-title div[data-v-2d95a018]:first-child:after{content:"";height:.346667rem;width:.066667rem;-webkit-transform:scaleX(.4);transform:scaleX(.4);background-color:#e8e8e8;display:inline-block;margin-left:.413333rem}.search-view .search-hot .search-item[data-v-2d95a018]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-flex-wrap:wrap-reverse;-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.search-view .search-hot .search-item span[data-v-2d95a018]{height:.346667rem;line-height:.346667rem;color:#333;font-size:.346667rem;margin:0 .266667rem .266667rem 0;padding:.226667rem .346667rem;border-radius:.08rem;background-color:#f5f5f5}.search-view .search-history[data-v-2d95a018]{padding-top:0}.search-view .search-history i[data-v-2d95a018]{background-image:url('+r(a(1455))+");background-size:100%;display:inline-block;width:.4rem;height:.4rem;position:absolute;right:.4rem}",""])},1234:function(e,t,a){var r=a(1133);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var i=a(678).default;i("1901cc67",r,!0,{})},1455:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAapJREFUWIXtl8Fx4kAQRd+fmuK6ZGBCIAM7BGewnLiuMzBEsOyVi3czgAjszcDOAEdgnylQ+8AMHgZJWMhlX/SrVEio+/cbSTNqCWA8HlMUBZKQRKYb4BcwyE+c0MrMZpL+pH+aGQCSmM/n+BMm18BvM1tK+tekupkNJc2AZ2BRFXcEEAmDRpKeAsg5egy5ixLvcoBMfTN7rUo+pZA7qItxjV0/WekVuALyYf4Iv5dn+tfl/08BJs652xqjhzMB6vKnwMQDrNfrmfe+bZFG2mw2j/B+BV5pP8qzdDQLnDt8LouiADhaoPJZUXU++sXjPO+gWlL8L2HuO+dS8yFwnxdM9h9CDJJSv2vgrgx0H5GN/Gc0itRh60u6iku2c24PGLZLM+vH+ERDSaM07wCg1+vx1Yo1v30h6gA6gA6gA+gATjWluyC/D1ttt9tlTejSe7+KB/FV3hog0Yr6Fr1x+/6hW1A2kuQVXPY19aHRQ4MrUNUZpUBNCkd9+0NYBfBE84/ROg2C55GqbsECuAVe2HXMbdRn1+JNmwBMAMxsJOmiTXUze5Y0jZ653gA/oYpZABrGCAAAAABJRU5ErkJggg=="},1548:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"search-view"},[a("div",{staticClass:"search-box relative"},[a("i",{staticClass:"search-icon"}),e._v(" "),a("div",{attrs:{id:"search-form"}},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.searchText,expression:"searchText"}],staticClass:"search-text needsclick",attrs:{type:"search"},domProps:{value:e.searchText},on:{keyup:function(t){return"button"in t||13===t.keyCode?e.searchSubmit(t):null},input:function(t){t.target.composing||(e.searchText=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"cancle",on:{click:e.goBack}},[e._v("取消")]),e._v(" "),a("span",{staticClass:"divider divider-horizontal divider-bottom"})]),e._v(" "),a("div",{staticClass:"search-hot"},[a("div",{staticClass:"search-title relative clearfix"},e._l(e.searchTitleArr,function(t,r){return a("div",{key:r,staticClass:"left",class:[r==e.activeTabIndex&&"active"],on:{click:function(t){e.chooseItem(r)}}},[e._v(e._s(t))])})),e._v(" "),e._l(new Array(2),function(t,r){return a("div",{directives:[{name:"show",rawName:"v-show",value:r==e.activeTabIndex,expression:"index == activeTabIndex"}],key:r,staticClass:"search-item"},e._l(e.hotSearchData,function(t,r){return a("span",{key:r,on:{click:function(a){e.gotoDetail(r,t)}}},[e._v(e._s(t.name))])}))})],2),e._v(" "),e._l(new Array(2),function(t,r){return a("div",{directives:[{name:"show",rawName:"v-show",value:e.activeTabIndex==r&&e.isShowHistorySearch,expression:"activeTabIndex == index && isShowHistorySearch"}],key:r,staticClass:"search-history search-hot"},[a("div",{staticClass:"search-title relative"},[e._v("历史搜索 "),a("i",{on:{click:e.delectAll}})]),e._v(" "),a("div",{staticClass:"search-item"},e._l(0==e.activeTabIndex?e.historySupplySearchData:e.historySearchData,function(t,r){return a("span",{key:r,staticClass:"history-item",on:{click:function(a){e.searchHistory(t)}}},[e._v(e._s(t.name))])}))])})],2)},staticRenderFns:[]}},747:function(e,t,a){function r(e){a(1234)}var i=a(6)(a(1064),a(1548),r,"data-v-2d95a018",null);e.exports=i.exports},913:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAeFJREFUSImt1T1rFFEUxvGfWQ2KhZXgGwgS8CWWWlgqQQQtIqggpFPZQkRMEfEL+FoYIaILYmcl0QgKFmr8AIIoJDZBUigp0tmpbLCYMzg7e3eS7OaByxzu3Of879m798y6RqMhoX4MxziCHfiDH/iMl3gVc5Van5g7jbsYSED3xTiPOVzHiypAXyGu4U4YBjCLUezHxhgHYm421kyGp7aSCm5iTFb2KB5hqbT+W4wHuIT74RHVdKzgTCH5STxMJC9qCQ2cCs9Y5EgC+mMncA3vKhKX9UFWLYxHrjbAWezCTOxqtXoc3p04lwIMR/wEzS4AzfAq5GoBHI74bRfJc+XeQynAtoi/9wDIvdtTgGVv4wrUdrhFwELEe3oA7I7nQvlFH75GfKIHwFA8P6UAUxFfUHHlK1TDxYinyi/78FzWJQ+i3gWgHt6fkasNkPceshs9VF5UoWNau8DvFECQ78n+DW9wWWunTfnqeO1/q2nbfREANzARhgnZ4V/FXmzAZgzG3BdZi9gU3uPYmgIU23UTV/ARtyPZeEUVc7gl+3kHMY2jWOxUQa7JMIxEPI+/MeZjbiTWPI2kMwVISyWpTybZwT+LsZwWAzKdqqTqIFejHNJWyVoBOkG2rCWgDHmPX/8AKvpqzkX6gJgAAAAASUVORK5CYII="}});