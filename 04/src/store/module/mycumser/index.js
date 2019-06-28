export default {
    namespaced: true,
    state: {
        cumseRemarks: ''
    },
    mutations: {
        setCumseRemarks(state, data) {
            state.cumseRemarks = data
        }

    },
    getters: {
        cumseRemarks: state => state.cumseRemarks
    },
    actions: {
        setCumseRemarks({ commit }, data) {
            commit('setCumseRemarks', data)
        }
    }
};