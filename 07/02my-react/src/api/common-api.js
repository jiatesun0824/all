import fetch from './fetch'
export default {
  getSpaceRenderState(params = {}) {
    return fetch('sevenUrl').get('/fullHousePlan/getSpaceRenderState', params)
  },
  checkReplaceDesignPlanPay(params = {}) { //检查是否需要支付
    return fetch('renderUrl').formData('/app/render/server/checkReplaceDesignPlanPay.htm', params)
  },
  payDesignPlanCopyRight(params = {}) { //方案支付
    return fetch('renderUrl').post('/app/render/server/payDesignPlanCopyRight.htm', params)
  },
  checkDesignCopyRight(params = {}) { // 检查是否支付成功
    return fetch('renderUrl').formData('/app/render/server/checkDesignCopyRight.htm', params)
  },
  getRenderType(params = {}) { // 渲染选择列表
    return fetch('payUrl').get('/web/pay/payOrder/getRenderType', params)
  },
  sellingPoint(params = {}) { // 随选网小程序埋点
    return fetch('sellingPointUrl').get('/app', params)
  },
  getQrminiProgramCode(params = {}) { // 获取小程序二维码
    return fetch('wxOffcialServeUrl').get('/union/sxw/noticecode', params)
  },
  getWxJssdkParams(params = {}) {
    return fetch('renderUrl').get('/online/share/getWXConfig.htm', params)
  },
  getUserIsFirstRender(params = {taskType: 0}) { // 判断用户是否首次装进我家
    return fetch('sevenUrl').get('/render/getUserTaskCount', params)
  },
  getRenderIfFinish(params = {}) {
    return fetch('sevenUrl').get('/render/getTaskStatus', params) // 判断是否已完成渲染
  }
}