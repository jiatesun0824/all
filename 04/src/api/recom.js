import { baseService, miniService, tqService,seekURL } from 'utils/request';

export function queryPlanTypeList() {
    return baseService.get('/app/mobile/designPlanRecommended/returnRecommendedType.htm');
}

export function querySpaceList() {
    return baseService.get('/app/mobile/design/designPlan/getSpace.htm');
}

export function queryStyleList(data) {
    return baseService.post('/app/mobile/spaceCommon/getDesignStyleList.htm', data);
}

export function queryAreaList(data) {
    return baseService.post('/app/mobile/spaceCommon/getSpaceAndarea.htm', data);
}

// export function queryPlanList(data) {
//     return tqService.post('/app/mobile/designPlanRecommended/planRecommendedList.htm', data);
// }
export function queryPlanList(data) { //新接口
    
    return seekURL.post('/fullsearch-app/all/recommendationplan/search/mini/list', data,{
      headers: {
        'Platform-Code': 'mobile2b'
      }
    });
}

export function queryFavoritesList(data) {
    return baseService.post('/app/mobile/designPlanCollect/getFavoritesList.htm', data);
}

export function queryPlanItemId(data) {
    return baseService.post('/app/mobile/designPlanCollect/getDesignPlanHasBeCollected.htm', data);
}

export function bindPlanItem(data) {
    return baseService.post('/app/mobile/designPlanCollect/addDesingPlanCollect.htm', data);
}

export function unBindPlanItem(data) {
    return baseService.post('/app/mobile/designPlanCollect/delDesingPlanCollect.htm', data);
}

export function getFitmentTypeList() {
    return miniService.get('/decoratePrice/getDecoratePriceType');
}
