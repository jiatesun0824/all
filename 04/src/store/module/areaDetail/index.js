import { queryTypeChangeList } from 'api/typechange';
import { get } from 'lodash';
import loading from 'components/Loading/index';

const GET_AREA_DETAIL_LIST = 'GET_AREA_DETAIL_LIST';

export default {
  namespaced: true,
  state: {
    areaDetailList: '',
    areaDetailCount: 0
  },
  mutations: {
    [GET_AREA_DETAIL_LIST](state, { datalist, totalCount, start }) {
      state.areaDetailList = start ? [...state.areaDetailList, ...datalist] : [...datalist];
      state.areaDetailCount = totalCount;
    }
  },
  getters: {
    areaDetailList: state => state.areaDetailList,
    areaDetailCount: state => state.areaDetailCount
  },
  actions: {
    async queryAreaDetailList({ commit, rootGetters }, { start = 0, limit = 10, livingId = '' } = {}) {
      let data = {
        livingId,
        limit,
        start: start * limit,
        msgId: get(rootGetters, 'common/userInfo.id')
      };

      !start && loading();
      let { datalist, totalCount } = await queryTypeChangeList(data);
      !start && loading.close();

      commit(GET_AREA_DETAIL_LIST, { datalist, totalCount, start });
    }
  }
};
