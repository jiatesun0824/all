export default {
  namespaced: true,
  state: {
    view720: { // 720°全景
      view720Id: 0, // 720°全景id
      view720Small: [], // 720°缩略图列表
      view720Content: [], // 720显示的内容
      QRcodeText: 'http://www.baidu.com'
    },
    fullView: {
      fullViewTitle: '',
      fullViewUrl: ''
    },
    audioObj:{},
    detailsSeeType: '',
    isDesign: false,
    fasttype: '', // 一键装修进入720的类型
    popupMsg: '', // 弹窗的提示信息
    toastShow: false,  // 吐司显示
    goBackPath: '', // 720返回路由
    isCollectIndex: 0, // 选择要收藏的方案索引
    collectSignFlag: false, // 720、图片级中的收藏按钮显示样式
    comComponentsShow: false, // 控制头部底部组件显示false为隐藏
  },
  mutations: {
    audioAutoPlay(state) {
      state.audioObj.newaudio.pause();
    },
    // 公共弹窗提示信息
    popupMsg(state, popupMsg) {
      state.popupMsg = popupMsg;
    },
    // 显示消息弹窗
    showPopup(state) {
      state.toastShow = !state.toastShow;
    },
    showComComponents(state, comComponentsShow) {
      state.comComponentsShow = comComponentsShow;
    },

  },
  getters: {

  },
  actions: {

  }
}
