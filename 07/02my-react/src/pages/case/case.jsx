import React, {Component} from 'react';
import { connect } from 'react-redux'
import { mapDispatchToProps } from '@/store/case';

class Case extends Component{ // 根组件
  addTestData() {
    this.props.setTestData(1)
  }

  render() {
    return (
      <div onClick={this.addTestData.bind(this)}>我是方案页{this.props.testData}</div>
    )
  }
}

export default connect((state) => ({
  testData: state.caseReducer.testData
}), mapDispatchToProps)(Case)