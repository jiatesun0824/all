
import request from 'utils/request';

export function uploadImg(data) { // 上传图片接口
  return request.post('/v1/union/supplydemandpic/uploadrespic', data);
}

export function release(data) { // 发布接口
  return request.post('/v1/union/supplydemand/addallsupplydemandinfo', data);
}

// 编辑发布
export function updateRelease(data) {
  return request.post('/v1/union/supplydemand/updatemysupplydemandinfo', data);
}
