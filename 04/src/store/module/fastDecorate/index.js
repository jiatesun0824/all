import {
    querySpaceList,
    queryCurrentSpaceType,
    queryNewHouseList,
    queryNewSpaceDesignList,
    queryStyleList,
    queryPlanList,
    queryIsMatchPlan,
    getFitmentTypeList
} from 'api/fastDecorate';
import {get, pick, forEach, map, find, merge, concat, omit, flatten, reverse, partition, sortBy } from 'lodash';
import loading from 'components/Loading/index';

const GET_SPACE_LIST = 'GET_SPACE_LIST';
const GET_CURRENT_SPACE_LIST = 'GET_CURRENT_SPACE_LIST';
const GET_NEW_HOUSE_LIST = 'GET_NEW_HOUSE_LIST';
const GET_STYLE_LIST = 'GET_STYLE_LIST';
const GET_PLAN_LIST = 'GET_PLAN_LIST';
const GET_FITMENT_LIST = 'GET_FITMENT_LIST';

const GET_CURRENT_SPACE = 'GET_CURRENT_SPACE';
const GET_CURRENTHOUSE = 'GET_CURRENTHOUSE';
const GET_CURRENTSTYLE = 'GET_CURRENTSTYLE';
const GET_CURRENT_SELECTFITMENT = 'GET_CURRENT_SELECTFITMENT';

const GET_IS_NEW_MATCH = 'GET_IS_NEW_MATCH';

const INIT_CURRENT_DATA = 'INIT_CURRENT_DATA';

const RESET_FITMENT_LIST = 'RESET_FITMENT_LIST';

export default {
    namespaced: true,
    state: {
        spaceList: '',
        currentSpaceList: '',
        currentSpace: '',
        newHouseList: '',
        currentHouse: '',
        styleList: '',
        currentStyle: '',
        planList: '',
        planCount: 0,
        isNewMatch: false,
        allFilterData: '',
        selectFilterList: [{
                title: '装修方式',
                typeData: [{
                    name: '全部',
                    active: true
                }]
            },
            {
                title: '装修价格',
                typeData: [{
                    name: '全部',
                    active: true
                }]
            }
        ]
    },
    mutations: {
        [GET_SPACE_LIST](state, spaceList) {
            state.spaceList = map(spaceList, item => pick(item, ['name', 'value', 'valuekey']));
        },
        [GET_CURRENT_SPACE_LIST](state, currentSpaceList) {
            state.currentSpaceList = currentSpaceList;
        },
        [GET_CURRENT_SPACE](state, currentSpace) {
            state.currentSpace = currentSpace;
        },
        [GET_NEW_HOUSE_LIST](state, newHouseList) {
            state.newHouseList = newHouseList;
        },
        [GET_CURRENTHOUSE](state, currentHouse) {
            state.currentHouse = currentHouse;
        },
        [GET_STYLE_LIST](state, styleList) {
            state.styleList = styleList;
        },
        [GET_CURRENTSTYLE](state, currentStyle) {
            state.currentStyle = currentStyle;
        },
        [GET_PLAN_LIST](state, { datalist, totalCount, start }) {
            state.planList = start ? [...state.planList, ...datalist] : [...datalist];
            state.planCount = totalCount;
        },
        [INIT_CURRENT_DATA](state) {
            [
                'currentSpaceList',
                'currentSpace',
                'newHouseList',
                'currentHouse',
                'styleList',
                'currentStyle',
                'planList'
            ].forEach(item => { state[item] = ''; });
        },
        [GET_IS_NEW_MATCH](state, isMatch) {
            state.isNewMatch = isMatch;
        },
        [GET_FITMENT_LIST](state, fitmentList) {
            state.allFilterData = fitmentList;
            state.selectFilterList.splice(0, 1, {
                ...get(state.selectFilterList, '0'),
                typeData: concat(get(state.selectFilterList, '0.typeData'), map(fitmentList, item => merge(omit(item, 'sonList'), { active: false })))
            });
        },
        [GET_CURRENT_SELECTFITMENT](state, index) {
            state.selectFilterList.splice(1, 1, {
                ...get(state.selectFilterList, '1'),
                typeData: !index ? [{ name: '全部', active: true }] : [{ name: '全部', active: true }, ...map(get(state.allFilterData, `${index - 1}.sonList`), item => merge(omit(item, 'sonList'), { active: false }))]
            });
        },
        [RESET_FITMENT_LIST](state) {
            forEach(state.selectFilterList, (item, index) => {
                item.typeData = index ? [{ name: '全部', active: true }] : [{ name: '全部', active: true }, ...map(state.allFilterData, item => merge(omit(item, 'sonList'), { active: false }))]
            })
        }
    },
    getters: {
        spaceList: state => state.spaceList,
        currentSpaceList: state => state.currentSpaceList,
        currentSpace: state => state.currentSpace,
        newHouseList: state => state.newHouseList,
        currentHouse: state => state.currentHouse,
        styleList: state => state.styleList,
        currentStyle: state => state.currentStyle,
        planList: state => state.planList,
        planCount: state => state.planCount,
        isNewMatch: state => state.isNewMatch,
        allFilterData: state => state.allFilterData,
        selectFilterList: state => state.selectFilterList
    },
    actions: {
        setplanList({ commit }, { datalist, totalCount, start }) {
            commit(GET_PLAN_LIST, { datalist, totalCount, start })
        },
        setcurrentSpaceList({ commit }, list) {
            commit(GET_CURRENT_SPACE_LIST, list);
        },
        initCrrentData({ commit }) {
            commit(INIT_CURRENT_DATA);
        },
        async querySpaceList({ commit, getters }) {
            if (getters.spaceList) return;
            let { datalist } = await querySpaceList();
            commit(GET_SPACE_LIST, datalist);
        },
        async queryCurrentSpaceList({ commit, getters, rootGetters }, { start = 0, limit = 10, houseId = '', currentSpaceId = '' }) {
            let data = {
                start,
                limit,
                houseId,
                msgId: get(rootGetters, 'common/userInfo.id')
            };

            let { datalist } = await queryCurrentSpaceType(data);
            console.log({ datalist })
            let currentList = map(sortBy(datalist), (item, index) => { return { active: currentSpaceId ? item == currentSpaceId : !index, ...find(getters.spaceList, { value: item }) }; });
            currentList = flatten(reverse(partition(currentList, { value: 13 })));
            commit(GET_CURRENT_SPACE_LIST, currentList);
            !find(currentList, { active: true }) && (currentList[0].active = true);
            commit(GET_CURRENT_SPACE, find(currentList, { active: true }));
        },
        changeCurrentSpace({ commit, getters }, index) {
            let currentList = map(getters.currentSpaceList, (item, i) => merge(item, { active: i === index }));
            commit(GET_CURRENT_SPACE_LIST, currentList);
            commit(GET_CURRENT_SPACE, currentList[index]);
        },
        spaceSetType({ commit, getters }, id) {
            let currentList = [{ active: true, ...find(getters.spaceList, { value: Number(id) }) }];
            commit(GET_CURRENT_SPACE_LIST, currentList);
            commit(GET_CURRENT_SPACE, currentList[0]);
        },
        async queryNewHouseList({ commit, getters, rootGetters }, { start = 0, limit = 0, houseId = '' }) {
            let data = {
                start,
                limit,
                houseId,
                msgId: get(rootGetters, 'common/userInfo.id'),
                spaceFunctionId: get(getters, 'currentSpace.value')
            };

            let { datalist } = await queryNewHouseList(data);
            let currentHouseList = map(datalist, item => merge(item, { active: true }));
            commit(GET_NEW_HOUSE_LIST, currentHouseList);
            commit(GET_CURRENTHOUSE, get(currentHouseList, '0'));
        },
        async queryNewSpaceDesignList({ commit, rootGetters }, { houseId = '' }) {
            let data = {
                msgId: get(rootGetters, 'common/userInfo.id'),
                spaceCommonIdText: houseId
            };

            let { datalist } = await queryNewSpaceDesignList(data);
            let currentHouseList = map(datalist, item => merge(item, { active: true, templateId: item.id, viewPlanSmallPath: item.effectPlanSmallUrl }));
            commit(GET_NEW_HOUSE_LIST, currentHouseList);
            commit(GET_CURRENTHOUSE, get(currentHouseList, '0'));
        },
        changeCurrentHouse({ commit, getters }, index) {
            commit(GET_CURRENTHOUSE, get(getters, `newHouseList.${index}`));
        },
        async queryStyleList({ commit, getters }) {
            let { datalist } = await queryStyleList({ houseName: get(getters, 'currentSpace.name') });
            let data = [{ name: '不限', value: '', active: true }, ...map(datalist, item => { return { name: item.name, value: item.id, active: false }; })]
            commit(GET_STYLE_LIST, data);
        },
        changeCurrentStyle({ commit, getters }, index = 0) {
            let data = map(getters.styleList, (item, i) => merge(item, { active: index === i }));
            commit(GET_STYLE_LIST, data);
            commit(GET_CURRENTSTYLE, data[index]);
        },
        async queryPlanList({ commit, getters, rootGetters }, { start = 0, pageSize = 10 } = {}) {
            let data = {
                recommendationPlanSearchVo:{
                   // isMainList: 1,
                    searchKeyword:'',
                    displayType: 'decorate',
                    msgId: get(rootGetters, 'common/userInfo.id'),
                    houseType: get(getters, 'currentSpace.value') || '',
                    designStyleId: get(getters, 'currentStyle.value') || '',
                    spaceArea: get(getters, 'currentHouse.spaceAreas') || '',
                    decoratePriceType: get(find(get(getters, 'selectFilterList.0.typeData'), {
                      active: true
                    }), 'value'),
                    decoratePriceRange: get(find(get(getters, 'selectFilterList.1.typeData'), {
                      active: true
                    }), 'value'),
                    templateId: get(getters, 'currentHouse.templateId') || ''
                },
                pageVo:{
                    pageSize,
                    start: start * pageSize
                }
            };

            !start && loading();
            let { datalist, totalCount } = await queryPlanList(data);
            !start && loading.close();
            commit(GET_PLAN_LIST, { datalist, totalCount, start });
        },
        async queryIsMatchPlan({ commit, getters }, planRecommendedId) {
            let { success } = await queryIsMatchPlan({ planRecommendedId, templateId: get(getters, 'currentHouse.templateId') || '' });
            commit(GET_IS_NEW_MATCH, success);
        },
        async getFitmentTypeList({ commit, getters }) {
            if (getters.allFilterData) return;
            let { list } = await getFitmentTypeList();
            commit(GET_FITMENT_LIST, list);
        },
        changeCurrentFitment({ commit, getters }, { index, i }) {
            !index && commit(GET_CURRENT_SELECTFITMENT, i);
            forEach(getters.selectFilterList, (item, selectIndex) => {
                index === selectIndex && forEach(item.typeData, (selectItem, selectActive) => { selectItem.active = selectActive === i });
            });
        },
        resetFitment({ commit }) {
            commit(RESET_FITMENT_LIST);
        }
    }
};
