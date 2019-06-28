import request from 'utils/request';

export function getAllArea() {
    return request.get('/v1/union/base/basearea/getAllArea');
}
export function sharexzchat(data) {
    return request.get('/v1/union/invite/sharexzchat', data);
}
