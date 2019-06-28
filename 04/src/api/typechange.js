import { baseService } from 'utils/request';

export function queryTypeChangeList(data) {
  return baseService.post('/app/mobile/houseSearch/newHouseListWeb.htm', data);
}
