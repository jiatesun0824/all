import { loginService, registerService } from 'utils/request';
import common from 'store/module/common';

export function login(data) {
  return loginService.formPost('/v1/user/login', data, { headers: { 'Platform-Code': common.state.platformCode } });
}

export function checkPhone(phone) {
  return registerService.formPost('/v2/user/center/checkMobileExist', { mobile: phone });
}
