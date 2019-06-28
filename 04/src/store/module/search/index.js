const GET_SELECT_AREA_CODE = 'GET_SELECT_AREA_CODE';

export default {
  namespaced: true,
  state: {
    selectArea: ''
  },
  mutations: {
    [GET_SELECT_AREA_CODE](state, areaCode) {
      state.selectArea = areaCode;
    }
  },
  getters: {
    selectArea: state => state.selectArea
  },
  actions: {
    setAreaCode({ commit }, areaCode) {
      commit(GET_SELECT_AREA_CODE, areaCode);
    }
  }
};
