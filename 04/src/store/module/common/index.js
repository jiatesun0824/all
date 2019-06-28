import { forEach, map, filter, includes, flatten, omit, slice, take, takeRight, isEmpty, merge } from 'lodash';
import { getAllArea } from 'api/common';
import localforage from 'localforage';
import { GET_ALL_AREA_DATA, SET_USER_INFO, SET_TOKEN } from 'store/types';

export default {
    namespaced: true,
    state: {
        platformCode: 'mobile2b',
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : '',
        token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : '',
        allAreaData: [],
        resourcePath: 'https://show.ci.sanduspace.com'
    },
    mutations: {
        [GET_ALL_AREA_DATA](state, data) {
            state.allAreaData = data;
        },
        [SET_USER_INFO](state, userInfo) {
            state.userInfo = userInfo ? merge(omit(userInfo, 'token'), { loginDay: new Date().toLocaleDateString() }) : '';
            userInfo ? localStorage.setItem('userInfo', JSON.stringify(state.userInfo)) : localStorage.removeItem('userInfo');
        },
        [SET_TOKEN](state, token) {
            state.token = token;
            token ? localStorage.setItem('token', JSON.stringify(state.token)) : localStorage.removeItem('token');
        }
    },
    getters: {
        allAreaData: state => state.allAreaData,
        userInfo: state => state.userInfo,
        token: state => state.token,
        resourcePath: state => state.resourcePath,
        platformCode: state => state.platformCode
    },
    actions: {
        async queryAllAreaData({ commit }) {
            let hasCityList = await localforage.getItem('hasCityList');
            if (!hasCityList) {
                let { obj, success } = await getAllArea();
                if (success) {
                    let len = 3,
                        cityListLen = obj.length,
                        baseSize = Math.floor(cityListLen / 3);
                    forEach(Array(len), (item, index) => {
                        switch (index) {
                            case 0:
                                localforage.setItem(`cityList${index+1}`, take(obj, baseSize));
                                break;
                            case 1:
                                localforage.setItem(`cityList${index+1}`, slice(obj, baseSize, (index + 1) * baseSize));
                                break;
                            case 2:
                                localforage.setItem(`cityList${index+1}`, takeRight(obj, cityListLen - index * baseSize));
                                break;
                        }
                    });
                    commit(GET_ALL_AREA_DATA, obj);
                    localforage.setItem('hasCityList', true);
                }
            }
        },
        async getAllAreaData({ commit, getters, dispatch }) {
            dispatch('queryAllAreaData');
            if (isEmpty(getters.allAreaData)) {
                let keys = await localforage.keys();
                let cityList = await Promise.all(map(filter(keys, item => includes(item, 'cityList')), item => localforage.getItem(item)));
                commit(GET_ALL_AREA_DATA, flatten(cityList));
            }
        },
        clearToken({ commit }) {
            commit(SET_TOKEN, '');
            sessionStorage.setItem('sktShow', JSON.stringify(false));
            localStorage.removeItem('userInfo');
        }
    }
};