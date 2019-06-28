export default {
  // 设置域名
  returnResourcesUrl(store, param) {
    store.commit('setResourcesUrl', param);
  },
  showLoading: ({commit}) => {
    commit('SHOWLOADING');
  },
  hideLoading: ({commit}) => {
    commit('HIDELOADING');
  },
  setLoader: ({commit}) => {
    commit('SETLOADER');
  },
  cancelLoader: ({commit}) => {
    commit('CANCELLOADER');
  }
};
