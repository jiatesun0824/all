import request from 'utils/request';
import { seekURL, tcService, renderService, baseService, advService, inviteService, registerService, ucService, planService } from 'utils/request';

// 获取我的消息列表
export function getPrivateMessageList(data) {
    return request.post('/v1/union/message/getprivatemessagelist', data)
}
// 获取我的消息详情
export function getprivatemessageinfolist(data) {
    return request.post('/v1/union/message/getprivatemessageinfolist', data)
}
// 发送消息
export function adduserprivatemessage(data) {
    return request.post('/v1/union/message/adduserprivatemessage', data)
}
// 删除一组会话
export function deluserprivatemessage(data) {
    return request.post('/v1/union/message/deluserprivatemessage', data)
}

// 系统消息列表
export function systemMsgList(data) {
    return baseService.post('/app/mobile/sysUserMessage/getList.htm', data);
}

// 获取我的发布列表
export function getallsupplydemandinfo(data) {
    return request.post('/v1/union/supplydemand/getallsupplydemandinfo', data)
}
// 更新我的发布列表（上架、下架操作）
export function updatemysupplydemandstatus(data) {
    return request.post('/v1/union/supplydemand/updatemysupplydemandstatus', data)
}

// 获取我的任务
export function getMyReplaceRecord(data) {
    return renderService.post('/app/mobile/pay/getMyReplaceRecord.htm', data, {
        headers: {
            "Platform-Code": 'mobile2b',
            "MediaType": '5'
        }
    })
}
//删除单个任务
export function deteleMyTaskAndDesign(data) {
    return baseService.post('/app/mobile/pay/deteleMyTaskAndDesign.htm', data)
}

// 获取收藏列表
export function getCollectList(data) {
    return seekURL.post('/fullsearch-app/collect/recommendationplan/search/list', data, {
        headers: {
            'Platform-Code': 'mobile2b'
        }
    })
}
// 获取设计风格选项列表
export function getDesignStyleList(data) {
    return baseService.post('/app/mobile/spaceCommon/getDesignStyleList.htm', data);
}
// 获取最佳列表
export function getFavoritesList(data) {
    return baseService.post('/app/mobile/designPlanCollect/getFavoritesList.htm', data)
}
// 获取空间类型列表“客餐厅”
export function getSpace() {
    return baseService.post('/app/mobile/design/designPlan/getSpace.htm')
}
// 取消收藏
export function delDesingPlanCollect(data) {
    return baseService.post('/app/mobile/designPlanCollect/delDesingPlanCollect.htm', data)
}


// 获取我的邀请界面广告
export function getInviteAdv(platformCode) {
    return advService.get('/v1/base/banner/web/union/list?positionCode=union:my:invitation:top', {}, {
        headers: {
            "Platform-Code": platformCode
        }
    })
}
// 获取排行榜信息
export function invitetoplist(data) {
    return inviteService.get('/v1/union/invite/invitetoplist', data)
}
// 获取我的邀请信息
export function userinvitelist(data) {
    return inviteService.get('/v1/union/invite/userinvitelist', data)
}
// 排行榜
export function commissiontop(data) {
    return request.get('/v1/union/commission/commissiontop', data);
}

// 获取验证码
export function getsms(data) {
    return registerService.get('/v1/center/getSmsCode', data)
}
// 修改手机号及密码，主要用于修改密码
export function updatePwdBak(data) {
    return ucService.post('/v2/user/center/modify2BUserMobileAndPassword', data);
}
// 获取用户信息
export function getUserInfo(data) {
    return registerService.get('/v2/user/center/getUserInfo2b', data)
}
// 编辑用户信息
export function editUserInfo2b(data) {
    return registerService.formPost('/v2/user/center/editUserInfo2b', data)
}
// 修改手机号
export function editPhone(data) {
    return ucService.post('v2/user/center/modify2BUserMobile', data)
}

// 上传头像
export function uploaduserpic(data) {
    return request.post('/v1/union/supplydemandpic/uploaduserpic', data)
}
// 邀请列表
export function getInviteList(data) {
    return inviteService.get('/v1/union/invite/myinvitelist', data);
}
