import { renderService } from 'utils/request';

export function queryPlanGallery(data) { // {planRecommendedId: id, remark: 'photo'}
  return renderService.post('/app/mobile/designPlanRecommended/getRecommendedPictureList.htm', data);
}

export function queryDesignGallery(data) {
  return renderService.post('/app/mobile/renderPic/getPictureList.htm', data);
}
