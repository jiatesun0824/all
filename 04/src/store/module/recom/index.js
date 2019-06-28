import {
    queryPlanTypeList,
    querySpaceList,
    queryStyleList,
    queryAreaList,
    queryPlanList,
    queryFavoritesList,
    queryPlanItemId,
    bindPlanItem,
    unBindPlanItem,
    getFitmentTypeList
} from 'api/recom';
import { forEach, map, pick, merge, get, isEmpty, values, reject, cloneDeep } from 'lodash';
import loading from 'components/Loading/index';

const GET_PLAN_TYPE_LIST = 'GET_PLAN_TYPE_LIST';
const CHANGE_PLAN_TYPE = 'CHANGE_PLAN_TYPE';
const GET_SPACE_LIST = 'GET_SPACE_LIST';
const CHANGE_SPACE_TYPE = 'CHANGE_SPACE_TYPE';
const GET_STYLE_LIST = 'GET_STYLE_LIST';
const CHANGE_STYLE_TYPE = 'CHANGE_STYLE_TYPE';
const GET_AREA_LIST = 'GET_AREA_LIST';
const CHANGE_AREA_TYPE = 'CHANGE_AREA_TYPE';
const GET_PLAN_LIST = 'GET_PLAN_LIST';
const CHANGE_NAVGATE_DATA = 'CHANGE_NAVGATE_DATA';
const GET_FAVORITES_LIST = 'GET_FAVORITES_LIST';
const GET_CURRENT_FAVORITES_ID = 'GET_CURRENT_FAVORITES_ID';
const GET_FITMENTTYPELIST = 'GET_FITMENTTYPELIST';
const CHANGE_FOUR_ACTIVE = 'CHANGE_FOUR_ACTIVE'; // 拉下筛选框
const CHANGE_RECOM_TYPE = 'CHANGE_RECOM_TYPE';

export default {
    namespaced: true,
    state: {
        planTypeList: '', // 方案列表
        spaceListBackUp: '', // 空间列表备份
        spaceList: '', // 空间列表
        styleList: '', // 风格列表
        areaList: '', // 面积列表
        navgateList: new Array(6),
        planList: '',
        planCount: 0,
        favoritesList: '',
        favoritesId: '',
        fitmentTypeList: [],
        fitmentTypeChildList: [],
        allActiveList: []
    },
    mutations: {
        [CHANGE_FOUR_ACTIVE](state, { parentIndex, index }) { // 下拉框四个分类选择
            switch (parentIndex) {
                case 0:
                    state.navgateList.splice(2, 1, state.styleList[index]);
                    break;
                case 1:
                    state.navgateList.splice(3, 1, state.areaList[index]);
                    console.log(state.navgateList,999)
                    break;
                case 2:
                    state.navgateList.splice(4, 1, state.fitmentTypeList[index]);
                    state.fitmentTypeChildList = state.fitmentTypeList[index].sonList;
                    break;
                case 3:
                    state.navgateList.splice(5, 1, state.fitmentTypeChildList[index]);
                    break;
            };
        },
        [GET_PLAN_TYPE_LIST](state, planTypeList) {
            let data = {
                name: planTypeList[0].planTypeName,
                value: planTypeList[0].planTypeCode,
                active: false
            };
            state.planTypeList = !isEmpty(planTypeList) ? map(planTypeList, (item, index) => {
                let typeItem = { name: item.planTypeName, value: item.planTypeCode, active: !index };
                return {...item, ...typeItem };
            }) : [];
            this.commit(`recom/${CHANGE_PLAN_TYPE}`, data, { root: true });
        },
        [GET_FITMENTTYPELIST](state, fitmentTypeList) {
            fitmentTypeList.unshift({ name: '全部', sonList: [], value: '' });
            state.fitmentTypeList = fitmentTypeList.map((value, index) => {
                value.sonList.unshift({ name: '全部', sonList: [], value: '' });
                value.sonList.map((val, count) => { return {...val, active: !count }; });
                return {...value, active: !index };
            });
            state.fitmentTypeChildList = state.fitmentTypeList[0].sonList;
            let data = {
                data1: {
                    name: '全部',
                    sonList: [],
                    value: ''
                },
                data2: {
                    name: '全部',
                    sonList: [],
                    value: ''
                }
            };
            this.commit(`recom/${CHANGE_NAVGATE_DATA}`, { index: 4, currentData: data.data1 });
            this.commit(`recom/${CHANGE_NAVGATE_DATA}`, { index: 5, currentData: data.data2 });
        },
        [CHANGE_PLAN_TYPE](state, data) {
            state.navgateList.splice(0, 1, data);
        },
        [GET_SPACE_LIST](state, spaceList) {
            spaceList.unshift({ name: '全部', value: '', valuekey: '' });
            // 修复最后一个点不到BUG开始
            spaceList.push({ name: '　', value: '', valuekey: '' });
            // 修复最后一个点不到BUG结束
            state.spaceListBackUp = map(spaceList, (item, index) => {
                return {...pick(item, ['name', 'valuekey', 'value']), active: !index };
            });
            state.spaceList = cloneDeep(state.spaceListBackUp);
            let data = {
                name: state.spaceList[0].name,
                value: state.spaceList[0].value,
                valuekey: state.spaceList[0].valuekey,
                active: false
            };
            this.commit(`recom/${CHANGE_SPACE_TYPE}`, data, { root: true });
        },
        [CHANGE_SPACE_TYPE](state, data) {
            state.navgateList.splice(1, 1, data);
        },
        [GET_STYLE_LIST](state, styleList) {
            styleList.unshift({ id: '', name: '全部' });
            state.styleList = map(styleList, (item, index) => {
                return {...pick(item, ['name']), value: item.id, active: !index };
            });
            let data = {
                name: '风格',
                value: '',
                active: false
            };
            this.commit(`recom/${CHANGE_NAVGATE_DATA}`, { index: 2, currentData: data });
        },
        [CHANGE_RECOM_TYPE](state, index) {
            state.spaceList = index ? reject(cloneDeep(state.spaceListBackUp), { value: 13 }) : cloneDeep(state.spaceListBackUp);
            state.spaceList.forEach(item => { item.active = item.value === get(state.navgateList, '1.value'); });
        },
        [CHANGE_STYLE_TYPE](state, data) {
            state.navgateList.splice(2, 1, data);
        },
        [GET_AREA_LIST](state, areaList) {
            areaList.unshift({ name: '全部', value: '' });
            state.areaList = map(areaList, (item, index) => {
                return {...pick(item, ['name', 'value']), active: !index };
            });
            let data = {
                name: '面积',
                value: '',
                active: false
            };
            this.commit(`recom/${CHANGE_NAVGATE_DATA}`, { index: 3, currentData: data });
        },
        [CHANGE_AREA_TYPE](state, data) {
            state.navgateList.splice(3, 1, data);
        },
        [GET_PLAN_LIST](state, { datalist, totalCount, start }) {
            datalist==null ? datalist=[]:'';
            state.planList = start ? [...state.planList, ...datalist] : [...datalist];
            state.planCount = totalCount;
        },
        [CHANGE_NAVGATE_DATA](state, { index, currentData }) {
            currentData.name=='样板方案'? currentData.value='prototype' : '';
            state.navgateList.splice(index, 1, currentData); // 初始化navgateList
        },
        [GET_FAVORITES_LIST](state, favoritesList) {
            state.favoritesList = favoritesList;
        },
        [GET_CURRENT_FAVORITES_ID](state, favoritesId) {
            state.favoritesId = favoritesId;
        }
    },
    getters: {
        planTypeList: state => state.planTypeList,
        spaceList: state => state.spaceList,
        styleList: state => state.styleList,
        areaList: state => state.areaList,
        navgateList: state => state.navgateList,
        planList: state => state.planList,
        planCount: state => state.planCount,
        favoritesList: state => state.favoritesList,
        favoritesId: state => state.favoritesId,
        fitmentTypeList: state => state.fitmentTypeList,
        fitmentTypeChildList: state => state.fitmentTypeChildList
    },
    actions: {
        changeFourActive({ commit }, { parentIndex, index }) {
            commit(CHANGE_FOUR_ACTIVE, { parentIndex, index });
        },
        async getFitmentTypeList({ commit }) {
            let { list, code } = await getFitmentTypeList();
            if (code === 200) {
                commit(GET_FITMENTTYPELIST, list);
            }
        },
        async queryPlanTypeList({ commit }) {
            let { datalist } = await queryPlanTypeList();
            commit(GET_PLAN_TYPE_LIST, datalist);
        },
        async querySpaceList({ commit, dispatch }) {
            let { datalist, success } = await querySpaceList();
            commit(GET_SPACE_LIST, datalist);
            if (success) {
                Promise.all([dispatch('queryStyleList'), dispatch('queryAreaList')])
                    .then(() => dispatch('queryPlanList'));
            }
        },
        async queryStyleList({ commit, getters }) {
            let queryParam = { houseName: get(getters, 'navgateList.1.name') };
            let { datalist } = await queryStyleList(queryParam);
            commit(GET_STYLE_LIST, datalist);
        },
        async queryAreaList({ commit, getters }) {
            let queryParam = { houseType: get(getters, 'navgateList.1.valuekey') };
            let { datalist } = await queryAreaList(queryParam);
            commit(GET_AREA_LIST, datalist);
        },
        async queryPlanList({ commit, getters, rootGetters }, { start = 0, pageSize = 10, planName = '' } = {}) {
            let { navgateList } = getters;
            let data = {
                //isMainList: 1,
                recommendationPlanSearchVo:{
                  displayType: get(navgateList, '0.value') || 'decorate',
                  houseType: get(navgateList, '1.value') || '',
                  designStyleId: get(navgateList, '2.value') || '',
                  spaceArea: get(navgateList, '3.value') || '',
                  searchKeyword: planName,
                  decoratePriceType: get(navgateList, '4.value') || '',
                  decoratePriceRange: get(navgateList, '5.value') || '',
                  msgId: rootGetters['common/userInfo']['id']
                },
                pageVo:{
                  pageSize,
                  start: start * pageSize,
                }
            };
            !start && loading();
            let { datalist, totalCount } = await queryPlanList(data);
            !start && loading.close();
            commit(GET_PLAN_LIST, { datalist, totalCount, start });
        },
        changeNavgateActive({ commit, getters }, { index, active }) {
            forEach(getters.navgateList, item => { item.active = false; });
            let currentData = get(getters.navgateList, index);
            currentData.active = active;
            commit(CHANGE_NAVGATE_DATA, { index, currentData });
        },
        changeNavgateItemActive({ commit, getters }, { parentIndex, itemIndex }) {
            let data = values(pick(getters, ['planTypeList', 'spaceList', 'styleList', 'areaList', 'fitmentTypeList', 'fitmentTypeChildList']))[parentIndex];
            forEach(data, (item, index) => { item.active = index === itemIndex; });
            let currentNavData = get(getters, `navgateList.${parentIndex}`);
            let styleAndAreaName = /(2|3)/.test(parentIndex) && !itemIndex ? ({ 2: '风格', 3: '面积' })[parentIndex] : get(data, `${itemIndex}.name`);
            commit(CHANGE_NAVGATE_DATA, {
                index: parentIndex,
                currentData: merge(currentNavData, {
                    name: styleAndAreaName,
                    value: get(data, `${itemIndex}.value`)
                })
            });
        },
        changeRecomType({ commit }, index) { // 改变样式
            commit(CHANGE_RECOM_TYPE, index);
        },
        async getFavoritesList({ commit, rootGetters }) {
            let { datalist } = await queryFavoritesList({
                msgId: get(rootGetters, 'common/userInfo.id')
            });
            commit(GET_FAVORITES_LIST, datalist);
        },
        async getPlanItemId({ commit, rootGetters }, recommendId) {
            let data = {
                userId: get(rootGetters, 'common/userInfo.id'),
                recommendId
            };

            let { obj } = await queryPlanItemId(data);

            commit(GET_CURRENT_FAVORITES_ID, obj);
        },
        async bindPlanItem({ rootGetters, dispatch,state }, { planId, fid ,planTableType}) {
            let data = {
                msgId: get(rootGetters, 'common/userInfo.id'),
                planRecommendedId: planId,
                fid,
                planHouseType:planTableType
            };
            await bindPlanItem(data);
            await dispatch('getPlanItemId', planId);
             //收藏成功后，前端把 收藏成功的参数置为1
             if (state.planList == '') {
               return
             } else {
               state.planList.map(item => {
                 if (item.planRecommendedId == planId) {
                   item.isFavorite = 1;
                   return item;
                 } else {
                   return item;
                 }
               })
             }
        },
        async unBindPlanItem({ commit, rootGetters,state }, { fid }) {
            let data = {
                msgId: get(rootGetters, 'common/userInfo.id'),
                fid
            };
          
            await unBindPlanItem(data);
            commit(GET_CURRENT_FAVORITES_ID, '0');
             if(state.planList == ''){
                 return
             }else{
                state.planList.map(item => {
                if (item.bid == fid) {
                    item.isFavorite = 0;
                    return item;
                } else {
                    return item;
                }
                })
             }
        }
    }
};
