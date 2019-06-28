import { queryProvincesAndCitiesList, queryVillageList } from 'api/area';
import { isEmpty, map, get, merge } from 'lodash';
import loading from 'components/Loading/index';

const GET_PROVINCES_LIST = 'GET_PROVINCES_LIST';
const GET_CITIES_LIST = 'GET_CITIES_LIST';
const GET_AREAS_LIST = 'GET_AREAS_LIST';
const SET_SELECT_INDEX = 'SET_SELECT_INDEX';
const SET_SELECTED_INFO = 'SET_SELECTED_INFO';
const GET_VILLAGE_LIST = 'GET_VILLAGE_LIST';

export default {
    namespaced: true,
    state: {
        parentIndex:2,
        provinces: [],
        selectIndex: [2, 1, 0],
        selectCityCode: ['440000', '440300'],
        selectCity: ['广东省', '深圳市'],
        searchVillageList: '',
        searchVillageCount: ''
    },
    mutations: {
        [GET_PROVINCES_LIST](state, provinces) {
            state.provinces = map(provinces, item => { return { name: item.areaName, value: item.areaCode, children: [] }; });
        },
        [GET_CITIES_LIST](state, { index, cityList }) {
            let data = map(cityList, item => { return { name: item.areaName, value: item.areaCode }});
            state.provinces.splice(index, 1, merge(state.provinces[index], { children: data }));
            //console.log(state.provinces)
        },
        [GET_AREAS_LIST](state, {index, areaList}) {
           let data = map(areaList, item => { return { name: item.areaName, value: item.areaCode }; });
           data.unshift({name:'全部',value:''});
           state.provinces[state.selectIndex[0]].children.splice(index, 1, merge(state.provinces[state.selectIndex[0]].children[index], { children: data }));
        },
        [SET_SELECT_INDEX](state, data) {
            state.selectIndex = data;
        },
        [SET_SELECTED_INFO](state, [selectCityCode, selectIndex, selectCity]) {
            state.selectCityCode = selectCityCode;
            state.selectIndex = selectIndex;
            selectCity.indexOf('全部')>0 ? selectCity.splice(selectCity.indexOf('全部'),1):'';
            state.selectCity = selectCity;
        },
        [GET_VILLAGE_LIST](state, { datalist, totalCount, start }) {
            state.searchVillageList = start ? [...state.searchVillageList, ...datalist] : [...datalist];
            state.searchVillageCount = totalCount;
        }
    },
    getters: {
        provinces: state => state.provinces,
        selectIndex: state => state.selectIndex,
        selectCityCode: state => state.selectCityCode,
        selectCity: state => state.selectCity,
        searchVillageList: state => state.searchVillageList,
        searchVillageCount: state => state.searchVillageCount
    },
    actions: {
        setSearchVillageList({ commit }, { datalist, totalCount, start }) {
            commit(GET_VILLAGE_LIST, { datalist, totalCount, start });
        },
        async queryProvincesAndCities({ commit, getters,state }, { isCity = true, provinceCode = '',cityCode = '', index = 0 }) {
            if (isEmpty(getters.provinces) && !isCity) {
                let { datalist } = await queryProvincesAndCitiesList();
                commit(GET_PROVINCES_LIST, datalist);
            }
            if (provinceCode) {
                if (isEmpty(get(getters, `provinces.${index}.children`))) {
                    let { datalist } = await queryProvincesAndCitiesList(provinceCode);
                    commit(GET_CITIES_LIST, { index, cityList: datalist });
                }
            }
            if(cityCode){
              if (isEmpty(get(getters, `provinces.${state.selectIndex[0]}.children.${index}.children`))) {
                let { datalist } = await queryProvincesAndCitiesList({cityCode:cityCode});
                commit(GET_AREAS_LIST, { index, areaList: datalist });
              }
            }
        },
        setSelectIndex({ commit }, data) {
            commit(SET_SELECT_INDEX, data);
        },
        setSelectCityInfo({ commit }, data) {
            commit(SET_SELECTED_INFO, data);
        },
        async queryVillageList({ commit, getters, rootGetters }, { start = 0, limit = 10, villageName = '' } = {}) {
            !start && loading();
            // 户型搜索，历史记录 开始
            let areaHosDataArr = [];
            if (JSON.parse(localStorage.getItem('areaHosDataArr'))) {
                areaHosDataArr = JSON.parse(localStorage.getItem('areaHosDataArr'));
            }
            let areaHosData = {
                limit: limit,
                start: start * limit,
                msgId: rootGetters['common/userInfo']['id'],
                livingName: villageName,
                provinceCode: get(getters, 'selectCityCode.0'),
                cityCode: get(getters, 'selectCityCode.1'),
                areaCode: get(getters, 'selectCityCode.2')
            }
            areaHosDataArr.push(areaHosData)
            areaHosDataArr.map((item, index) => {
                if (item.livingName == '') {
                    areaHosDataArr.splice(index, 1)
                }
            })
            localStorage.setItem('areaHosDataArr', JSON.stringify(areaHosDataArr));
            // 户型搜索，历史记录 结束
            let { datalist, totalCount } = await queryVillageList({
                limit,
                start: start * limit,
                msgId: rootGetters['common/userInfo']['id'],
                livingName: villageName,
                provinceCode: get(getters, 'selectCityCode.0'),
                cityCode: get(getters, 'selectCityCode.1'),
                areaCode: get(getters, 'selectCityCode.2')
            });
            !start && loading.close();
            commit(GET_VILLAGE_LIST, { datalist, totalCount, start });
        }
    }
};
