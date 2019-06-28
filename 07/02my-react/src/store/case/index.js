const types = {
    SET_TESTDATA: 'SET_TESTDATA'
}
const mapDispatchToProps = {
    setTestData: (value) => { return {type: types.SET_TESTDATA, value}}
}
//这是reducer
const caseReducer = (state = { testData: 0 }, action) => {
  switch (action.type) {
      case types.SET_TESTDATA:
          return { ...state, testData: ++state.testData};
      default:
          return state;
  }
}
export { mapDispatchToProps, caseReducer }