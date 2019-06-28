import { test } from 'api/home';
import { GET_TEST_DATA } from 'store/types';

const CHANGE_TYPE_TAB = 'CHANGE_TYPE_TAB';
const GET_TEST_FIRST = 'GET_TEST_FIRST';
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_DIOLOG = 'SET_DIOLOG';

export default {
    namespaced: true,
    state: {
        mask:false,
        robNum:false,
        robSuccess:false,
        first: true,
        testData: '',
        homeTypeTab: [{
                label: '同城商家',
                active: true
            },
            {
                label: '供求信息',
                active: false
            }
        ],
        MarkedMessage: ''
    },
    mutations: {
        [GET_TEST_FIRST](state, isFirst) {
            state.first = isFirst;
        },
        [GET_TEST_DATA](state, data) {
            state.testData = data;
        },
        [CHANGE_TYPE_TAB](state, index) {
            state.homeTypeTab.forEach((item, i) => Object.assign(item, { active: index === i }));
        },
        [SET_MESSAGE](state, data) {
            state.MarkedMessage = data
        },
        [SET_DIOLOG](state,data){
          state.mask=data.mask;
          state.robNum=data.robNum;
          state.robSuccess=data.robSuccess;

        }
    },
    getters: {
        first: state => state.first,
        testData: state => state.testData,
        homeTypeTab: state => state.homeTypeTab,
        mask: state => state.mask,
        robNum: state => state.robNum,
        robSuccess: state => state.robSuccess,
        MarkedMessage: state => state.MarkedMessage
    },
    actions: {
        async queryTestData({ commit }) {
            let { data } = await test()
            commit(GET_TEST_DATA, data);
        },
        changeTypeTab({ commit }, index) {
            commit(CHANGE_TYPE_TAB, index);
        },
        diolog({ commit },data){
          commit(SET_DIOLOG, data);
        },
        setMarkedMessage({ commit }, data) {
            commit(SET_MESSAGE, data)
        }
    }
}
