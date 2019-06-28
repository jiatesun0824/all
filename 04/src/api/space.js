import { baseService } from 'utils/request';

import { querySpaceList, queryAreaList } from './recom';

export {
  querySpaceList,
  queryAreaList
};

export function queryShapeList() {
  return baseService.get('/app/mobile/spaceCommon/getSpaceShape.htm');
}

export function querySpaceSearchList(data) {
  return baseService.post('/app/mobile/spaceCommon/newSpaceSearchWeb.htm', data);
}
