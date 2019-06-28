import Situations from '@/utils/situations'

const types = {
  SHOW_LOADING: 'SHOW_LOADING',
  SET_TOKEN: 'SET_TOKEN',
  SET_REFERER: 'SET_REFERER',
  SET_USERID: 'SET_USERID'
}
export default {
  state: {
    loadingShow: false,
    token: '',
    referer: '',
    userId: ''
  },
  mutations: {
    [types.SHOW_LOADING] (state, loadingShow) {
      state.loadingShow = loadingShow
    },
    [types.SET_TOKEN] (state, token) {
      state.token = Situations.setVuexStorage('token', token)
    },
    [types.SET_REFERER] (state, referer) {
      state.referer = Situations.setVuexStorage('referer', referer)
    },
    [types.SET_USERID] (state, userId) {
      state.userId = Situations.setVuexStorage('userId', userId)
    }
  },
  getters: {
    loadingShow: state => state.loadingShow,
    token: state => state.token,
    referer: state => state.referer,
    userId: state => state.userId
  },
  actions: {
    showLoading ({commit}, loadingShow) {
      commit(types.SHOW_LOADING, loadingShow)
    },
    setToken ({commit}, token) {
      commit(types.SET_TOKEN, token)
    },
    setReferer ({ commit }, referer) {
      commit(types.SET_REFERER, referer)
    },
    setUserId ({ commit }, userId) {
      commit(types.SET_USERID, userId)
    }
  }
}
