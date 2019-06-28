export default {
  namespaced:true,
   state:{
     activityParam:'',//活动状态参数
     detailData:'',//活动详情数据
     cutRecord:'',//砍价记录列表
     timer:'',//定时器
     cutprice:'',//砍价金额
     urlParams:'',//链接参数
     dialog:{  //弹窗
        startCutDialog:false,
        cutDetailDialog:false,
        deliveryAddressDialog:false,
        experienceShowDialog:false,
        submitDialog:false
     }
   },
   getters:{
      activityParam: state => state.activityParam,
      detailData: state => state.detailData,
      cutRecord: state => state.cutRecord,
      cutprice: state => state.cutprice,
      urlParams: state => state.urlParams,
      startCutDialog: state => state.dialog.startCutDialog,
       cutDetailDialog: state => state.dialog.cutDetailDialog,
       deliveryAddressDialog: state => state.dialog.deliveryAddressDialog,
       experienceShowDialog: state => state.dialog.experienceShowDialog,
     submitDialog: state => state.dialog.submitDialog,
   },
  mutations:{
     ['ACTIVITY_PARAM'](state,data){
        state.activityParam=data;
     },
     ['DETAIL_DATA'](state,data){
       state.timer=setInterval(()=>{
         if(data.actRemainTime>=1){
           data.actRemainTime=data.actRemainTime-1;
         }else{
           clearInterval(state.timer)
         }
       },1000);
       state.detailData=data;
     },
    ['DIALOG'](state,data){
        state.dialog.startCutDialog=data.startCutDialog;
        state.dialog.cutDetailDialog=data.cutDetailDialog;
        state.dialog.deliveryAddressDialog=data.deliveryAddressDialog;
        state.dialog.experienceShowDialog=data.experienceShowDialog;
        state.dialog.submitDialog=data.submitDialog;
    },
    ['CUTPRICE'](state,data){
       state.cutprice=data;
    },
    ['CUT_RECORD'](state,data){
       state.cutRecord=data;
    },
    ['URL_PARAMS'](state,data){
      state.urlParams=data;
    }
  },
  actions:{
    setActivityParam({ commit },data){
      commit('ACTIVITY_PARAM',data)
    },
    setDetailData({ commit },data){
      commit('DETAIL_DATA',data)
    },
    setDialog({ commit },data){
       commit('DIALOG',data)
    },
    setCutprice({commit},data){
       commit('CUTPRICE',data)
    },
    setCutRecord({ commit },data){
      commit('CUT_RECORD',data)
    },
    setUrlParams({ commit },data){
      commit('URL_PARAMS',data)
    }
    }
}
