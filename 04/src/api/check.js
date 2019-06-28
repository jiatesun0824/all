import request from 'utils/request';

// 中介申请认证
export function check(data) {
    return request.post('/v1/union/authorize/check', data)
}

// 获取中介认证信息
export function checkinfo(data) {
    return request.get('/v1/union/authorize/info', data)
}

// 中介重新认证
export function reCheck(data) {
    return request.post('/v1/union/authorize/recheck', data)
}

// 认证状态
export function isauthorize() {
    return request.get('/v1/union/authorize/isauthorize')
}