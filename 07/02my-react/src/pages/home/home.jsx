import React, {Component} from 'react';
// （1）引入redux要用到的插件
import { connect } from 'react-redux'
import { mapDispatchToProps } from '@/store/home/index.js';
// （2）定义组件
class Home extends Component{ // 根组件
  showfooterShow() {
    this.props.setFooterIsShow(true)
  }
  render() {
    return (
      <div onClick={this.showfooterShow.bind(this)}>我是首页{this.props.testData}</div>
    )
  }
}
// （3）导出组件
export default connect((state) => ({
  loadingShow: state.reducer.loadingShow,
  footerIsShow: state.reducer.footerIsShow,
  testData: state.caseReducer.testData
}), mapDispatchToProps)(Home)