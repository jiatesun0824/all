import { baseService } from 'utils/request';

export function uploadHouseInfo(data) {
  return baseService.post('/app/mobile/uploadHouse/create.htm', data);
}
