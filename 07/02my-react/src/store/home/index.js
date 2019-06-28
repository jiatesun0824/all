const types = {
  SET_LOADINGSHOW: 'SET_LOADINGSHOW',
  SET_FOOTERISSHOW: 'SET_FOOTERISSHOW'
}
//需要触发什么行为
const mapDispatchToProps = {
  setLoading: (value) => { return { type: types.SET_LOADINGSHOW, value } },
  setFooterIsShow: (value) => { return { type: types.SET_FOOTERISSHOW, value } }
}
//这是reducer
const reducer = (state = {
  loadingShow: false,
  footerIsShow: true
}, action) => {
  switch (action.type) {
      case types.SET_LOADINGSHOW:
          return { ...state, loadingShow: action.value};
      case types.SET_FOOTERISSHOW:
          return { ...state, footerIsShow: action.value};
      default:
          return state;
  }
}
export { mapDispatchToProps, reducer }