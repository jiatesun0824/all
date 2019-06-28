import { baseService, renderService } from 'utils/request';

export function getSpace() {
    return baseService.get('/app/mobile/design/designPlan/getSpace.htm');
}

export function getDesignList(data) {
    return baseService.post('/app/mobile/design/designPlan/myDesignPlanMobile.htm', data);
}

export function deletePlan(data) {
    return baseService.post('/app/mobile/design/designPlan/deleteMyDesignPlanAndTask.htm', data);
}

export function getPlanQrCodeUrlList(data) {
    return renderService.get(`/online/share/getPlanQrCodeUrlList.htm?planId=${data.planId}`);
}