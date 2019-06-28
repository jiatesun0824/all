import React from 'react'
import propTypes from 'prop-types'
import './footer.scss'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '@/store/home/index.js';


class Footer extends React.Component {
  constructor(props) { // 初始化
    super(props)
    this.state = {
      text: 'footer',
      footerList: [
        {
          routerPath: '/home',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '首页'
        },
        {
          routerPath: '/case',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '方案'
        },
        {
          routerPath: '/home',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '互动区'
        },
        {
          routerPath: '/home',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '同城服务'
        },
        {
          routerPath: '/home',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '我的'
        },
      ]
    }
  }
  componentWillMount() { // 装载组件时候触发
    window.api.getGoodsList({ designPlanRecommendedId: 175159 }).then((res) => {
      console.log(res)
    })
  }
  componentWillUnmount() { // 卸载组件时触发
  }
  changeFooterShow() {
    this.props.setFooterIsShow(false)
  }
  changeUserName() {
    this.setState(preState => ({
      text: preState.text + 1
    }))
  }
  changeFooterList() {
    this.setState({
      footerList: [
        {
          routerPath: '/home',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '首页1'
        },
        {
          routerPath: '/case',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '方案'
        },
        {
          routerPath: '/home',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '互动区'
        },
        {
          routerPath: '/home',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '同城服务'
        },
        {
          routerPath: '/home',
          logoPath: require('../../static/images/tab_home_nor.png'),
          name: '我的'
        },
      ]
    })
  }
  render() {
    return (
      <div className='footer'>
        <ul className="footer-list">
        {this.state.footerList.map((value, index) => {
          return <li className='list-item' key={index}>
            <Link to={value.routerPath}>
            <div className='item-logo'><img src={value.logoPath} alt=""/></div>
            <div className='item-text'>{value.name}</div>
            </Link>
          </li>
        })}
        </ul>
      </div>
    )
  }
}
Footer.propTypes = { // 设置组件类型
  userName: propTypes.string
}
Footer.defaultProps = { // 设置组件，默认值
  userName: '孙卫其'
}
export default connect((state) => ({
  loadingShow: state.loadingShow,
  footerIsShow: state.footerIsShow
}), mapDispatchToProps)(Footer)
