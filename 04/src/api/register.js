import { registerService } from 'utils/request';
import { checkPhone } from './login';

export {
    checkPhone
};

/**
 * phoneNumber  手机号
 */

// 获取验证码
export function getCode(data) {
    return registerService.get('/v1/center/getSmsCode', data)
}

/**
 * data
 *   mobile   手机号
 *   password 密码
 *   authCode 验证码
 */

export function register(data) {
    return registerService.formPost('/v2/user/center/register', data);
}

/**
 * data
 *  newPassword   新密码
 *  authCode      验证码
 */

export function resetpw(data) {
    return registerService.formPost('/v2/user/center/editPassword', data);
}

/**
 * params
 * type = userSourceCompany 写死
 */

export function getSourceCompany() {
    return registerService.get('/v1/sys/dictionary/list', { type: 'userSourceCompany' });
}