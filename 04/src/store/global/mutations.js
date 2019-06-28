export default {
  audioAutoPlay(state) {
    state.audioObj.newaudio.pause();
  },
  // 设置资源
  setResourcesUrl(state, resourcesUrl) {
    state.resourcesUrl = resourcesUrl;
  },
  // 设置域名
  setServerUrl(state, serverUrl) {
    state.serverUrl = serverUrl;
  },
  // 显示消息弹窗
  showPopup(state) {
    state.toastShow = !state.toastShow;
  },
  showToast(state) {
    state.popupShow = !state.popupShow;
  },
  // 显示头部底部组件
  showComComponents(state, comComponentsShow) {
    state.comComponentsShow = comComponentsShow;
  },
  // 记住账户
  setAccount(state, account) {
    state.account = account;
  },
  // 记住密码
  setPwd(state, pwd) {
    state.pwd = pwd;
  },
  // 公共弹窗提示信息
  popupMsg(state, popupMsg) {
    state.popupMsg = popupMsg;
  },
  toastMsg(state, toastMsg) {
    state.toastMsg = toastMsg;
  },
  SHOWLOADING(state) { // 显示正在加载组件
    state.loadingFlag = true;
  },
  HIDELOADING(state) { // 隐藏正在加载组件
    state.loadingFlag = false;
  },
  SETLOADER(state) {
    state.isLoader = true;
  },
  CANCELLOADER(state) {
    state.isLoader = false;
  },
  // 头部文本渲染
  changeTxt(state, htext) {
    state.headerTxt = htext;
  },
  // 720全景
  RETURNVIEW(state, fullViewUrl) {
    state.fullView.fullViewUrl = fullViewUrl;
  },
  // nav选项
  selNav(state, activeIndex) {
    state.activeIndex = activeIndex;
  },
  selDesignNav(state, activeIndex) {
    state.design.activeIndex = activeIndex;
  },
  selRecomnNav(state, activeIndex) {
    state.recom.activeIndex = activeIndex;
  },
  selCollectNav(state, activeIndex) {
    state.collect.activeIndex = activeIndex;
  },
  // 我的设计加载提示信息
  changeDesignMSG(state, designLoad) {
    state.myDesign.designLoad = designLoad;
  },
  // 我的设计数据
  setMyDesign(state, designData) {
    state.myDesign.designData = designData;
  },
  // 我的设计数据总数
  setDesignCount(state, designTotalCount) {
    state.myDesign.designTotalCount = designTotalCount;
  },
  // 我的设计页数
  setDesignPage(state, designPage) {
    state.myDesign.designPage = designPage;
  },
  // 我的设计滚动条回到顶部
  setScrollTop(state) {
    state.myDesign.scrollTop = !state.myDesign.scrollTop;
  },
  // 显示隐藏大图
  showBigImage(state) {
    state.search.bigImageShow = !state.search.bigImageShow;
  },
  openProvince(state) {
    state.contentFlag = true;
    state.selareaFlag = true;
    state.comComponentsShow = false;
  },
  openCity(state) {
    state.contentFlag = false;
    state.selareaFlag = true;
    state.comComponentsShow = false;
  },
  delPlan(state, bid) {
    state.delPlanList.push(bid);
  }
};
