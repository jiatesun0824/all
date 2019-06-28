
import request, { tcService, bannerService, advService, baseService, locPayurl } from 'utils/request';

export function test() {
  return request.get('/v1/test');
}

export function getAllArea() {
  return request.get('/v1/union/base/basearea/getAllArea');
}

export function usercommissioninfo() {
  return request.get('/v1/union/commission/usercommissioninfo');
}

export function newestcommissioninfo(data) {
  return request.get('/v1/union/commission/newestcommissioninfo', data);
}

export function getshareplanlist(data) {
  return request.get('/v1/union/planRecommended/getshareplanlist', data);
}

export function commissiontop(data) {
  return request.get('/v1/union/commission/commissiontop', data);
}

export function sharexzchat(data) { //生成的二维码
  return request.get('/v1/union/invite/sharexzchat', data);
}

export function getallsupplydemandcategory(data) { // 建议改成驼峰
  return request.get('/v1/union/basedata/getallsupplydemandcategory', data);
}

export function getAllSupplyDemandInfo(data) {
  return request.post('/v1/union/supplydemand/getallsupplydemandinfo', data);
}

export function getallsupplydemandRoles(data) {
  return request.get('/v1/union/basedata/getallsupplydemandRoles', data);
}
export function dynamicShopList(data) { // 首页同城服务信息列表
  return tcService.get('/v1/sandu/mini/companyshop/dynamicShopList', data);
}

export function addsupplydemandviewnum(data) {
  return request.post('/v1/union/supplydemand/addsupplydemandviewnum', data);
}
export function getCommissionNote(data) { // 佣金明细
  return locPayurl.get('/v1/union/commission/commissionDetailsPage', data);
}

export function getBannerList(data) {
  return bannerService.get('/v1/base/banner/web/union/list', data, {
    headers: {
      'Platform-Code': 'mobile2b'
    }
  });
}

export function getAllAreaByQuery(data){
  return request.get('/v1/union/base/basearea/listall', data);
}

export function behaviorTotal(data) { // 中介首页分享统计 数据埋点
  return request.get('/v1/behavior', data);
}
export function getHomePageInfo(data){ //装修首页信息
  return baseService.get('/app/mobile/decorateSeckill/getHomePageInfo.htm', data);
}
export function seckill(data){ //装修首页抢单接口
  return baseService.post(`/app/mobile/decorateSeckill/seckill.htm?id=${data.id}`, data);
}

export function robOrderList(data){ //平台派单接口
  return baseService.get(`/app/mobile/decoratePrice/getList.htm`, data);
}
export function robOrderDetail(data){ //派单详情接口
  return baseService.get(`/app/mobile/decoratePrice/getDetail.htm`, data);
}

export function submitPrice(data){ //提交报价接口
  return baseService.post(`/app/mobile/decoratePrice/submitPrice.htm`, data);
}

