import { getSpace, getDesignList, deletePlan } from 'api/design';
import { isEmpty, find, get } from 'lodash';
import loading from 'components/Loading';

const GET_SPACE_LIST = 'GET_SPACE_LIST';
const GET_DESIGN_LIST = 'GET_DESIGN_LIST';
const GET_TOTAL_COUNT = 'GET_TOTAL_COUNT';

export default {
  namespaced: true,
  state: {
    spaceList: [],
    designList: [],
    totalCount: 0
  },
  mutations: {
    [GET_SPACE_LIST](state, data) {
      state.spaceList = data;
    },
    [GET_DESIGN_LIST](state, {datalist, start}) {
      state.designList = start ? [...state.designList, ...datalist] : [...datalist];
    },
    [GET_TOTAL_COUNT](state, count) {
      state.totalCount = count;
    }
  },
  getters: {
    spaceList: state => state.spaceList,
    designList: state => state.designList,
    totalCount: state => state.totalCount
  },
  actions: {
    async getSpace({ commit, getters }) {
      if (!isEmpty(getters.spaceList)) return;
      let { datalist } = await getSpace();
      let spaceList = (datalist || []).map((item, index) => { item.active = !index; return item; });
      commit(GET_SPACE_LIST, spaceList);
    },
    async queryDesignList({ commit, getters, rootGetters }, { start = 0, limit = 10 } = {}) {
      let data = {
        limit,
        start: start * limit,
        userId: get(rootGetters, 'common/userInfo.id'),
        msgId: get(rootGetters, 'common/userInfo.id'),
        spaceFunctionId: get(find(getters.spaceList, {active: true}), 'value')
      };
      !start && loading();
      let { datalist, totalCount } = await getDesignList(data);
      !start && loading.close();
      commit(GET_DESIGN_LIST, {datalist, start});
      commit(GET_TOTAL_COUNT, totalCount);
    },
    async deletePlan({ commit, dispatch }, {planId, planHouseType}) {
      let { success } = await deletePlan({planId, planHouseType});
      success && dispatch('queryDesignList');
    }
  }
};
