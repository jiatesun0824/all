import {
  querySpaceList,
  queryAreaList,
  queryShapeList,
  querySpaceSearchList
} from 'api/space';
import { map, pick, get, reject } from 'lodash';
import loading from 'components/Loading/index';

const GET_SPACE_LIST = 'GET_SPACE_LIST';
const GET_AREA_LIST = 'GET_AREA_LIST';
const GET_SHAPE_LIST = 'GET_SHAPE_LIST';
const GET_SEARCH_SPACE_LIST = 'GET_SEARCH_SPACE_LIST';

export default {
  namespaced: true,
  state: {
    spaceList: '',
    areaList: '',
    shapeList: '',
    searchSpaceList: '',
    spaceCount: 0
  },
  mutations: {
    [GET_SPACE_LIST](state, data) {
      state.spaceList = reject(map(data, item => pick(item, ['name', 'valuekey', 'value'])), {value: 13});
    },
    [GET_AREA_LIST](state, data) {
      state.areaList = map(data, item => pick(item, ['name', 'value']));
    },
    [GET_SHAPE_LIST](state, data) {
      let shapeList = map(data, item => pick(item, ['picPath', 'value','name']));
      shapeList.unshift({picPath: '全部', value: ''});
      state.shapeList = shapeList;
    },
    [GET_SEARCH_SPACE_LIST](state, { datalist, totalCount, start }) {
      state.searchSpaceList = start ? [...state.searchSpaceList, ...datalist] : [...datalist];
      state.spaceCount = totalCount;
    }
  },
  getters: {
    spaceList: state => state.spaceList,
    areaList: state => state.areaList,
    shapeList: state => state.shapeList,
    searchSpaceList: state => state.searchSpaceList,
    spaceCount: state => state.spaceCount
  },
  actions: {
    async querySpaceList({ commit }) {
      let { datalist } = await querySpaceList();
      commit(GET_SPACE_LIST, datalist);
    },
    async queryAreaList({ commit }, houseType) {
      let { datalist } = await queryAreaList({houseType});
      commit(GET_AREA_LIST, datalist);
    },
    async queryShapeList({ commit }) {
      let { datalist } = await queryShapeList();
      commit(GET_SHAPE_LIST, datalist);
    },
    async querySpaceSearchList({ commit, rootGetters }, { start = 0, limit = 10, spaceFunctionId = 3, areaValue = 17, spaceShape = '' } = {}) {
      let data = {
        limit,
        start: start * limit,
        spaceFunctionId,
        areaValue,
        spaceShape,
        msgId: get(rootGetters, 'common/userInfo.id')
      };

      !start && loading();
      let { datalist, totalCount } = await querySpaceSearchList(data);
      !start && loading.close();
      commit(GET_SEARCH_SPACE_LIST, { datalist, totalCount, start });
    },
    initConditionQuery({ dispatch }) {
      Promise.all([dispatch('querySpaceList'), dispatch('queryShapeList'), dispatch('queryAreaList')])
      .then(() => dispatch('querySpaceSearchList'));
    }
  }
};
