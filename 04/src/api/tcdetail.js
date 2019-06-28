import { baseService,tcService,planService,seekURL } from 'utils/request'
import request from 'utils/request'
// 获取同城模块店铺详情
export function getShopDetail(data) {
    return request.post('/v1/sandu/mini/companyshop/detail', data)
}
// export function planRecommendedList(data) { //一键方案
//   return baseService.post('/app/mobile/designPlanRecommended/planRecommendedList.htm', data)
// }
export function planRecommendedList(data) { //一键方案
  return seekURL.post('/fullsearch-app/all/recommendationplan/search/mini/list', data, {
    headers: {
      'Platform-Code': 'mobile2b'
    }
  })
}

export function recommendedPlanCount(data) { //方案数量
  return seekURL.post('/fullsearch-app/all/recommendationplan/search/mini/count', data,{
    headers: {
      'Platform-Code': 'mobile2b'
    }
  })
}

export function designerList(data) { //设计师团队列表
  return tcService.get('/v1/sandu/mini/CompanyDesigner/designerList', data);
}

export function blogArticlelist(data) { // 博文列表
  return tcService.get('/v1/sandu/shop/article/list', data);
}

export function blogArticleDetails(data) { // 博文详情
  return tcService.get('/v1/sandu/shop/article/detail', data);
}

export function caseList(data) { // 案例
  return tcService.get('/v1/sandu/mini/companyshop/projectCaseList', data);
}

//https://mapi.ci.sanduspace.com/
