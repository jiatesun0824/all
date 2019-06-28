import { baseService } from 'utils/request';

export function queryProvincesAndCitiesList(provinceCode) {
  let data={};
  try {
     data=provinceCode.cityCode ? provinceCode : {provinceCode};
  }catch (e) {}
  return baseService.post('/app/mobile/houseSearch/searchProvinceCodeAndCityCode.htm', data);
}

export function queryVillageList(data) {
  return baseService.post('/app/mobile/houseSearch/newHouseSearchWeb.htm', data);
}
