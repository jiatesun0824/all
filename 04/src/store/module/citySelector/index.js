export default {
    namespaced: true,
    state: {
        // item: {
        //     areaCode: '440300',
        //     areaName: '深圳',
        //     state: true
        // },
        item: {
            areaCode: '',
            areaName: '全国',
            state: true
        },
        robItem: {
            areaCode: '',
            areaName: '全国',
            state: true
        }
    },
    mutations: {},
    getters: {
        item: state => state.item,
        robItem: state => state.robItem
    },
    actions: {

    }
};