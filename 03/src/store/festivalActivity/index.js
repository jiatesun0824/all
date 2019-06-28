export default {
   namespaced:true,
   state:{
       dialog:{
         taskDialog:false, //做任务
         bindPhone:false, //绑定手机号
         getCards:false, //恭喜您 获取卡片-
         inviteRecord:false, //邀请记录
         getMoving:false, //获得电影票
         sharePoster:false, //海报
         guidePage:false, //引导页
       },
       imgList:[
         {name:'2', active:false,defaultUrl: '/static/image/festivalActivity/spring_word_2.png',selectUrl:'/static/image/festivalActivity/spring_word_2_get.png'},
         {name:'0', active:false,defaultUrl: '/static/image/festivalActivity/spring_word_0.png',selectUrl:'/static/image/festivalActivity/spring_word_0_get.png'},
         {name:'1', active:false,defaultUrl: '/static/image/festivalActivity/spring_word_1.png',selectUrl:'/static/image/festivalActivity/spring_word_1_get.png'},
         {name:'9', active:false,defaultUrl: '/static/image/festivalActivity/spring_word_9.png',selectUrl:'/static/image/festivalActivity/spring_word_9_get.png'},
         {name:'随', active:false,defaultUrl: '/static/image/festivalActivity/spring_word_sui.png',selectUrl:'/static/image/festivalActivity/spring_word_sui_get.png'},
         {name:'选', active:false,defaultUrl: '/static/image/festivalActivity/spring_word_xuan.png',selectUrl:'/static/image/festivalActivity/spring_word_xuan_get.png'},
         {name:"请", active:false,defaultUrl: '/static/image/festivalActivity/spring_word_qing.png',selectUrl:'/static/image/festivalActivity/spring_word_qing_get.png'},
         {name:"您", active:false,defaultUrl: '/static/image/festivalActivity/spring_word_nin.png',selectUrl:'/static/image/festivalActivity/spring_word_nin_get.png'},
         {name:"看", active:false,defaultUrl: '/static/image/festivalActivity/spring_word_kan.png',selectUrl:'/static/image/festivalActivity/spring_word_kan_get.png'},
         {name:"贺", active:false,defaultUrl: '/static/image/festivalActivity/spring_word_he.png',selectUrl:'/static/image/festivalActivity/spring_word_he_get.png'},
         {name:"岁", active:false,defaultUrl: '/static/image/festivalActivity/spring_word_sui2.png',selectUrl:'/static/image/festivalActivity/spring_word_sui2_get.png'},
         {name:"片", active:false,defaultUrl: '/static/image/festivalActivity/spring_word_pian.png',selectUrl:'/static/image/festivalActivity/spring_word_pian_get.png'},
       ],
       cardsInfo:'',//卡片列表信息
       taskList:[  //任务列表
         { status:'',title:'绑定手机号，得拼图',tip:'绑定成功即可获取'},
         { status:'',title:'体验装修我家，得拼图',tip:'查看装修我家操作指引'},
         { status:'',title:'体验产品替换，得拼图',tip:'查看产品替换操作指引'}
       ],
       awardData: {}, //抽奖数据
       taskStatus:'',//任务状态
       inviteRecordData:'',//邀请记录数据
       successCardsInfo:[], //绑定成功获取卡片数据
       urlParams:'', //地址栏参数
       redPoint:0 , //0无新消息  1做任务新消息  2.邀请好友新消息
       movingInfo:'',//电影票信息
       originInfo:'',//来源信息
       guideIndex:0  //那张引导页
   },
  getters:{

  },
  mutations:{
     ['SET_DIALOG'](state,data){
       state.dialog.taskDialog=data.taskDialog;
       state.dialog.bindPhone=data.bindPhone;
       state.dialog.getCards=data.getCards;
       state.dialog.inviteRecord=data.inviteRecord;
       state.dialog.getMoving=data.getMoving;
       state.dialog.sharePoster=data.sharePoster;
       state.dialog.guidePage=data.guidePage;
       if(data.guidePage){
         state.guideIndex=data.guideIndex;
       }
     },
     ['SET_CARDSLIST'](state,data){
       data.vm.API.getCardsList({activityId:state.urlParams.activityId}).then(res=>{
         if(res.success){
           state.cardsInfo=res.obj;
           state.imgList.map((item,index)=>{
             index < res.obj.totalCard ?  item.active=true : '';
           });
         }else{
           data.vm.$toast(res.message);
         }
       })
     },
     ['SET_TASKLIST'](state,data){
        data.vm.API.getUserTaskState({ activityId : state.urlParams.activityId}).then(res=>{
            if(res.success){
               state.dialog.taskDialog=true;
               state.taskStatus=res.obj;
               state.taskList[0].status=res.obj.taskOneState; //任务1 0：可领取    1：进行中 2：已完成  3：未完成但不可领取
               state.taskList[1].status=res.obj.taskTwoState; //任务2
               state.taskList[2].status=res.obj.taskThreeState;//任务3
            }else{
              data.vm.$toast(res.message);
            }
        })
     },
     ['SET_GETTASK'](state,data){
       data.vm.API.getdoTask({activityId: state.urlParams.activityId,id:state.taskStatus.id}).then(res=>{
            if(res.success){
                if(data.taskIndex==0){ //任务1
                  state.dialog.taskDialog=false;
                  setTimeout(()=>{
                    state.dialog.bindPhone=true;
                  },500);
                }else{ //任务2 3
                  data.vm.$toast('领取成功');
                }
                state.taskList.map((item,index)=>{
                  if(data.taskIndex==index){
                    item.status=1;
                  }
                })
            }else{
              data.vm.$toast(res.message);
            }
       })
     },
     ['SET_INVITE_RECORD'](state,data){
       data.vm.API.getInviteRecord({ activityId:state.urlParams.activityId,pageNo:1,pageSize:10 }).then(res=>{
          state.dialog.inviteRecord=true;
          state.inviteRecordData=res;
       })
     },
     ['SET_SUCCESS_CARDS'](state,data){
         state.successCardsInfo=data;
         if(state.successCardsInfo){
           state.imgList.map(res=>{
             state.successCardsInfo.map(item=>{
               if(res.name==item.name){
                 res.active=true;
                 state.originInfo='绑定手机号';
               }
             })
           })
         }
     },
     ['SET_URLPARAMS'](state,data){
         state.urlParams=data;
     },
     ['SET_MSGTIP'](state,data){
       // hasTaskFlag": true, "activityOverFlag": true,"cardNumFlag": true  三个都为true，做任务有红点 后面两个位true，邀好友有红点
         data.vm.API.redPoint({activityId:state.urlParams.activityId}).then(res=>{
             if(res.success){
               res.obj.hasTaskFlag && res.obj.activityOverFlag && res.obj.cardNumFlag ? state.redPoint=1 : '';
               !res.obj.hasTaskFlag && res.obj.activityOverFlag && res.obj.cardNumFlag ? state.redPoint=2 : '';
             }else{
               data.vm.$toast(res.message);
             }
         })
     },
     ['SET_GETMOVING'](state,data){
       data.vm.API.getFilmTicket({activityId:state.urlParams.activityId}).then(res=>{
             if(res.success){
                  state.movingInfo=res.obj;
                  state.dialog.getMoving=true;
             }else {
               data.vm.$toast(res.message);
             }
       })
     },
     ['SET_UNRECEIVED_CARD'](state,data){
         data.vm.API.getUserTaskState({activityId:state.urlParams.activityId}).then(item=>{
           data.vm.API.getUnReceivedCard({activityId:state.urlParams.activityId}).then(res=>{
             if(res.success){
               if(res.datalist){
                 state.successCardsInfo=res.datalist;
                 state.dialog.getCards=true;
                 res.datalist.map(parItem=>{
                   state.imgList.map((item,index)=>{
                     if(parItem.cardNumber==index+1){
                       parItem.selectUrl=item.selectUrl;
                     }
                   })
                 });
                 state.originInfo=res.datalist[0].businessType==0 ? '绑定手机号' : res.datalist[0].businessType==1 ? '装修我家' : res.datalist[0].businessType==2 ? '产品替换' : '邀请好友';
               }

             }else {
               //data.vm.$toast(res.message);
             }
           })
       });
     },
     ['SET_AWARDDATA'](state,data){
      data.vm.API.getLotteryWheelNeedData({activityId: state.urlParams.activityId, count: Math.random()}).then(res => {
        if (res.obj) {
          state.awardData = res.obj;
        }
      })
     },
     ['SET_ORIGIN_INFO'](state,data){
        state.originInfo=data;
     }
  },
  actions:{
     setDialog({ commit },data){
        commit('SET_DIALOG',data)
     },
     setCardsList({ commit },data){ //卡片初始化
        commit('SET_CARDSLIST',data)
     },
     setTaskList({ commit },data){ //任务列表的状态
        commit('SET_TASKLIST',data)
     },
     setGetTask({ commit },data){ //领取任务
        commit('SET_GETTASK',data)
     },
     setInviteRecord({ commit },data){ //邀请记录
       commit('SET_INVITE_RECORD',data)
     },
     setSuccessCards({ commit },data){
       commit('SET_SUCCESS_CARDS',data)
     },
     setUrlParams({ commit },data){
       commit('SET_URLPARAMS',data)
     },
     setMsgTip({ commit },data){
       commit('SET_MSGTIP',data)
     },
     setGetMoving({commit},data){
       commit('SET_GETMOVING',data)
     },
     setUnReceivedCard({ commit },data){
       commit('SET_UNRECEIVED_CARD',data)
     },
     setAwardData({commit}, data){
      commit('SET_AWARDDATA',data)
     },
     setOriginInfo({ commit },data){
       commit('SET_ORIGIN_INFO',data)
     }
  }
}
