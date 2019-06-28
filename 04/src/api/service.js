import { tcService, baseService } from 'utils/request'

export function serviceDetail(data) { //同城服务详情
  return tcService.get('/v1/sandu/mini/companyshop/detail', data)
}

export function tcfwList(data) { //同城服务列表
  return tcService.get('/v1/sandu/mini/companyshop/list', data,{
    headers: {
      'Platform-Code': 'mobile2b'
    }
  })
}

export function getDesignStyleList(data) { //同城服务列表风格列表
  return tcService.get('/v1/sandu/mini/sysdictionary/list', data)
}

export function shopPopularityList(data) { //同城服务人气大牌
  return tcService.get('/v1/sandu/mini/companyshop/shopPopularityList', data)
}

export function houseStyle(data) { //同城服务家居服务风格列表
  return tcService.get('/v1/sandu/mini/productcategory/list', data)
}
export function updateVisitCount(data) { //浏览次数
  return tcService.get('v1/sandu/mini/companyshop/updateVisitCount', data)
}
