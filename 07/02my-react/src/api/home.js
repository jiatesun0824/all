import fetch from './fetch'
import commonApi from './common-api'
export default Object.assign({
  getPreferentialActivities(params = {}) {
    return fetch('renderUrl').get('/pages/vr720/getUnionSpecialOfferVo.htm', params)
  },
  getProductDetailsList(params = {}) {
    return fetch('renderUrl').get('/pages/vr720/getUnionStoreProductsCostList.htm', params)
  },
  getHouseChooseList(params = {}) {
    return fetch('renderUrl').get('pages/vr720/getUnionStoreSingleSenceList.htm', params)
  },
  getSevenAndRoamUrl(params = {}) { // 获取主要信息
    return fetch('renderUrl').get('/v1/miniprogram/render/renderpic/getrenderres.htm', params)
  },
  getGoodsList(params = {}) { // 费用清单
    return fetch('sevenUrl').get('/pages/vr720/getproductscost', params)
  },
  getGoodDetails(params = {}) { // 清单详情
    return fetch('sevenUrl').get('/product/baseproduct/productdetails', params)
  },
  getProductschangeList(params = {}) { // 组合搜索
    return fetch('productSearchUrl').post('/web/mobile/search/searchProductGroup.htm', params)
  },
  searchAloneProductList(params) { // 单品全文搜索
    return fetch('allSearchUrl').get('/fullsearch-app/universal/product/replace/list', params)
  },
  getDetailByIds(params = {}) { // 单品匹配
    return fetch('productSearchUrl').get('/web/app/search/getDetailByIds.htm', params)
  },
  addRenderTask (params = {}) { // 添加渲染任务
    return fetch('renderUrl').post('/v1/render/server/addRenderTask.htm', params)
  },
  getuserIsPackageInMonthly(params = {}) { // 获取用户包年包月信息
    return fetch('payUrl').get('/web/pay/checkRenderGroopRef2C', params)
  },
  getIsBindingMobile(params = {}) {
    return fetch('userUrl').get('/v2/user/center/isUserMobileBinded', params)
  },
  getMobileCode(params = {}) {
    return fetch('userUrl').formData('/v1/center/getSms', params)
  },
  confirmBingingMolide(params = {}) {
    return fetch('userUrl').formData('/v2/user/center/bindUserMobile', params)
  },
  newSearchProCategory(params = {}) { // （新）的产品替换分类接口
    return fetch('productSearchUrl').post('/web/mobile/search/searchProCategory', params)
  },
  getMobileToBPackageInMonthly(params = {}) { // 获取B端用户包年包月信息
    return fetch('payUrl').formData('/web/pay/payModelConfig/checkRenderGroopRef', params)
  },
  pushTemplateMessage(params = {}) { // 小程序模板消息推送
    return fetch('systemUrl').formData('/notify/wx/saveUserRenderFormId', params)
  },
}, commonApi)
