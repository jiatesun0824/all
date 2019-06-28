import { CHANGE_ACTIVE_TAB } from 'store/types';

export default {
    namespaced: true,
    state: {
        menuList: [{
                name: '首页',
                icon: 'tab_icon_city_nor',
                activeIcon: 'tab_icon_city_sel',
                url: '/home',
                isActive: true
            },
            {
                name: '方案',
                icon: 'scheme_nor',
                activeIcon: 'scheme_pre',
                url: '/recom',
                isActive: false
            },
            {
                name: '户型',
                icon: 'search_nor',
                activeIcon: 'search_pre',
                url: '/search/area',
                isActive: false
            },
            {
                name: '设计',
                icon: 'mydesign_nor',
                activeIcon: 'mydesign_pre',
                url: '/design',
                isActive: false
            },
            {
                name: '我的',
                icon: 'personal_nor',
                activeIcon: 'personal_pre',
                url: '/user',
                isActive: false
            }
        ]
    },
    mutations: {
        [CHANGE_ACTIVE_TAB](state, tab) {
            state.menuList.map((item, index) => {
                item.isActive = index === tab
            })
        }
    },
    getters: {
        menuList: state => state.menuList
    },
    actions: {
        changeActiveTab({ commit }, payload) {
            commit(CHANGE_ACTIVE_TAB, payload)
        }
    }
}