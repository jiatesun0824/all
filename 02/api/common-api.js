
import request from './request.js'
const commonAPI = {
  getUserOpenId(params = {}) { // 获取用户openid
    return request('limitUrl').formData('/user/getOpenid', params)
  },
  saveMinProNickName(params = {}) { // 保存用户信息
      return request('userUrl').formData('/v2/user/center/modifyUserInfo', params)
  },
  setUserLogin(params = {}) { // 用户登录
    return request('limitUrl').formData('/user/login', params)
  },
  
  getAllArea(params = {}) { // 获取省市区
    return request('baseUrl').get('/base/basearea/getAllArea', params)        
  },
  getAreaByPid(params = {}) {   //新的获取省市区
    return request('unionUrl').get('/union/base/basearea/getAreaByPid',params)
  },
  bindUserMobile(params = {}) { // 绑定手机号码
    return request('userUrl').formData('/v2/user/center/bindUserMobile', params)
  },
  getBindPhoneCode(params = {}) { // 获取绑定手机验证码
    return request('userUrl').formData('/v1/center/getSmsCode', params)
  },
  addRenderTask(params = {}) { // 添加渲染任务
    return request('renderUrl').post('/render/server/addRenderTask.htm', params)
  },
  getRenderType(params = {}) { // 获取渲染选择参数
    return request('payUrl').get('/web/pay/payOrder/getRenderType', params)
  },
  isUserMobileBinded() { // 检验手机号
  
  },
  getSuperiorPlan(params = {}) {//获取精选方案
    return request('baseUrl').get('/designplan/superiorPlanList', params)
  },
  sellingPoint(params = {}) { // 设置埋点
    let spm = wx.getStorageSync('spm')
    let equipmentMessage = getApp().equipmentMessage
    return request('sellingPointUrl').get('/app', Object.assign(params, {
      dm: equipmentMessage.model,
      os: equipmentMessage.system,
      tm: new Date().getTime(),
      spm: spm,
      tid: 20180002
      }))
  },
  getJsonData(params = {}) { // 获取二维码保存参数
    return request('unionUrl').get('/union/sxw/getJsonData', params)
  },
  joinRedPacketAct(params = {}) { // 用户参与元旦红包活动
    return request('systemUrl').formData('/act2/redpacket/reg/joinRedPacketAct', params)
  },
  recordInvitation(params = {}) { // 记录邀请信息(好友通过分享链接进入时)
    return request('systemUrl').formData('/act2/redpacket/reg/recordInvitation', params)
  },
  getSystemTime(params={}){
    return request('baseUrl').get('/home/basehouse/getServerTime',params)
  },
  getUserInfoStatus(){
    return request('userUrl').get('/v2/user/center/isObtainFullInfo')
  }
}
export default commonAPI
