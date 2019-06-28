import { baseService ,renderService} from 'utils/request';
import { querySpaceList, queryStyleList, queryPlanList, getFitmentTypeList } from './recom';

export {
  querySpaceList,
  queryStyleList,
  queryPlanList,
  getFitmentTypeList
};

export function queryCurrentSpaceType(data) {
  return baseService.post('/app/mobile/houseSearch/getSpaceNameInHouse.htm', data);
}

export function queryNewHouseList(data) {
  return baseService.post('/app/mobile/houseSearch/newHouseSpaceListWeb.htm', data);
}

export function queryNewSpaceDesignList(data) {
  return baseService.post('/app/mobile/spaceCommon/newSpaceDesignWeb.htm', data);
}

export function queryIsMatchPlan(data) {
  return baseService.post('/v1/mobile/designPlanRecommended/getMatchPlan.htm', data);
}
export function isPayPlanStatus(data) {
  return renderService.post('/app/render/server/checkReplaceDesignPlanPay.htm', data);
}

