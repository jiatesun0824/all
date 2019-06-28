import Vue from 'vue';
import axios from 'axios';
import store from 'store';
import router from 'router';
import baseAPI from './baseAPI';

export const bus = new Vue();

// axios 配置
// axios.defaults.timeout = 60000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; 
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers['Platform-Code'] = 'mobile2b';
const u = navigator.userAgent; // 获取设备信息
// console.log('设备信息：' + u);
let mediaType = '';
// 判断手机设备类型
(function getMediaType() {
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // android
        console.log('android');
        mediaType = '6';
    } else if (u.indexOf('iPhone') > -1) { // iphone
        console.log('iphone');
        mediaType = '5';
    } else {
        mediaType = '5';
    }
})();

// POST传参序列化
axios.interceptors.request.use((config) => {
    config.headers['MediaType'] = mediaType; // 设备类型
    config.headers['Platform-Code'] = 'mobile2b'; // 'cityUnionMediation';  // 平台编码
    if (localStorage.token) {
        config.headers['Authorization'] = JSON.parse(localStorage.token);
    }
    if (store.state.isLoader) {
        store.dispatch('showLoading');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// 返回状态判断
axios.interceptors.response.use((res) => {
    if (res.data.success || res.data.returnCode === '000006') {
        // setTimeout(() => {
        //   store.dispatch('hideLoading');
        // }, 500);
        store.dispatch('hideLoading');
        return res;
    } else {
        return res;
        if (res.data.CheckOneLogin) {
            let msg = res.data.message;
            store.commit('toastMsg', msg);
            store.commit('showToast');
            localStorage.setItem('token', '');
            localStorage.setItem('isLogined', 0);
            sessionStorage.clear();
            return;
        }
        let errorMsg = res.data.message;
        if (errorMsg === '登录超时，请重新登录') { // 认证失败，返回登录页
            store.state.timeOut = true; // 登录超时
            localStorage.setItem('isLogined', 0);
            // router.replace('/');
            store.commit('showComComponents', false);
            // localStorage.setItem('token', '');
            // sessionStorage.clear();
            return false;
        } else if (errorMsg === '账号或密码错误!') { // 账户密码错误次数判断，跳转到忘记密码
            if (store.state.oldAccount == localStorage.getItem('userName')) {
                if (store.state.errorCount > 2) {
                    store.commit('showComComponents', false);
                    store.commit('popupMsg', '账号或密码错误超过3次，请修改密码！');
                    store.commit('showPopup');
                    setTimeout(() => {
                        router.push('/reset');
                    }, 2500);
                    return false;
                }
            }
            store.state.oldAccount = localStorage.getItem('userName');
            store.state.errorCount++;
        } else if (errorMsg === '您尚未开通移动版功能，请联系客服开通!' || errorMsg === '未开通此平台权限,请联系客服.') {
            let userId = res.data.msgId; // 缓存用户id
            localStorage.setItem('userId', userId);
            store.state.isRenew = false;
            router.push('/payopen');
            return;
        } else if (errorMsg === '移动版已到期，请续费开通！' || errorMsg === '平台权限已到期,请续费开通!') {
            let userId = res.data.msgId; // 缓存用户id
            localStorage.setItem('userId', userId);
            store.state.isRenew = true;
            router.push('/payopen');
            return;
        } else if (errorMsg === '账户积分不足，请充值.' || errorMsg === '您的余额不足，请到PC端充值！') {
            bus.$emit('integralConfirmShow');
            return;
        }
        store.commit('popupMsg', errorMsg);
        store.commit('showPopup');
        return res;
    }
}, (error) => {
    store.commit('popupMsg', '系统繁忙，请稍后再试！');
    // store.commit('showPopup');
    return Promise.reject(error);
});

export function fetch(url, params, type, base, formData) {
    if (base === 'render') { // 渲染服务
        axios.defaults.baseURL = baseAPI.renderURL;
    } else if (base === 'productSearch') { // 产品搜索服务
        axios.defaults.baseURL = baseAPI.productSearchURL;
    } else if (base === 'pay') { // 支付服务
        axios.defaults.baseURL = baseAPI.payURL;
    } else if (base === 'limit') {
        axios.defaults.baseURL = baseAPI.limitURL;
    } else if (base === 'login') {
        axios.defaults.baseURL = baseAPI.loginURL;
    } else if (base === 'seekUrl') { // 搜索服务
        axios.defaults.baseURL = baseAPI.seekURL;
    } else if (base === 'uc') {
        axios.defaults.baseURL = baseAPI.ucURL;
    } else if (base === 'tq') {
        axios.defaults.baseURL = baseAPI.tqLOcalurl;
    } else if (base === 'payloc') {
        axios.defaults.baseURL = baseAPI.locPayurl;
    } else if (base === 'min') {
        axios.defaults.baseURL = baseAPI.miniprogramUrl;
    } else if (base === 'role') {
        axios.defaults.baseURL = baseAPI.roleURL;
    } else if (base === 'soc') {
        axios.defaults.baseURL = baseAPI.socketurl;
    } else if (base === 'collect') {
        axios.defaults.baseURL = baseAPI.collectUrl;
    } else if (base === 'admin') {
        axios.defaults.baseURL = baseAPI.adminUrl;
    } else if (base === 'core') {
        axios.defaults.baseURL = baseAPI.planURL;
    } else { // 基础服务
        axios.defaults.baseURL = baseAPI.baseURL;
    }
    if (formData) {
        let formDataObj = new FormData();
        for (let key in params) {
            formDataObj.append(key, params[key]);
        }
        params = formDataObj;
    }
    return new Promise((resolve, reject) => {
        let params1 = {};
        if (type === 'get') {
            params1 = params || {};
            params = {};
        }
        axios({
                method: type || 'post',
                url: url,
                data: params,
                params: params1
            })
            .then(response => {
                if (response == undefined) {
                    return;
                }

                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export default {
    collectsave(params) { // 统计次数
        let url = `/v1/collect/save`;
        return fetch(url, params, 'post', 'collect');
    },
    updatePwd(params) { // 首次登陆修改密码
        let url = `/v1/center/updatePwd`;
        return fetch(url, params, '', 'uc');
    },
    sendbindPhoneMsg(params) { // 验证码 （绑定手机）
        let url = `/v1/center/getSms`;
        return fetch(url, params, 'get', 'uc');
    },
    getFranchiserCompanyList(params) { // 获取经销商企业列表
        let url = `/v1/user/getFranchiserCompanyList`;
        return fetch(url, params, '', 'limit');
    },
    switchCompany(params) { // 经销商切换企业
        let url = `/v1/user/switchCompany`;
        return fetch(url, params, '', 'limit');
    },
    rechargePayModelByH5Pay(params) { // 购买包年包月（微信h5支付，支付宝手机网页支付）
        let url = `/v1/web/pay/payOrder/rechargePayModelByH5Pay`;
        return fetch(url, params, 'get', 'pay');
    },
    locpayDesignPlanCopyRight(params) {
        let url = '/mobile/render/server/payDesignPlanCopyRight.htm';
        return fetch(url, params, 'post', 'payloc');
    },
    loccheckDesignCopyRight(params) {
        let url = '/mobile/render/server/checkDesignCopyRight.htm';
        return fetch(url, params, 'post', 'payloc');
    },
    rechargePayModelByAppPay(params) { // 购买包年包月（支付宝和微信APP支付）
        let url = `/v1/agency/pay/agencyPayModelByAppPay`;
        return fetch(url, params, 'get', 'pay');
    },
    payIntergralByH5(params) { // 积分充值H5
        let url = `/v1/web/pay/payOrder/rechargeIntegralByH5Pay2b`;
        return fetch(url, params, 'post', 'pay');
    },
    payIntergralByApp(params) { // 积分充值APP
        let url = `/v1/agency/pay/agencyRechargeIntegralByAppPay`;
        return fetch(url, params, 'post', 'pay');
    },
    getRechargeIntegral(params) { // 充值积分列表
        let url = `/v1/web/pay/payOrder/getRechargeIntegralList`;
        return fetch(url, '', 'post', 'pay');
    },
    getRenderPayConfigList(params) { // 渲染套餐列表
        let url = `/v1/web/pay/payModelConfig/getRenderPayConfigList?msgId=${params.msgId}`;
        return fetch(url, '', 'get', 'pay');
    },
    returnRecommendedType(params) { // 获取方案类型
        return fetch('/app/mobile/designPlanRecommended/returnRecommendedType.htm', params);
    },
    getUserBalanceAmount(params) { // 未开通移动端获取积分
        let url = `/v1/web/system/sysUser/getUserBalanceAmount?userId=${params.userId}`;
        return fetch(url, '', 'get', 'pay');
    },
    platformFilter() {
        return fetch('/v1/mobile/platform2b/platform2bDetails.htm', '', 'get'); // 平台过滤
    },
    login(params) {
        // return fetch('/user/login', params); // toC登录
        return fetch('/v1/user/login', params, '', 'limit'); // 权限改造登录
    },
    getMarkedMessage(params) {
        return fetch('/v1/user/getMarkedMessage', params, 'post', 'limit'); //  首次登录获取提示语
    },
    integralShow(params) {
        return fetch('/v1/web/system/sysUser/getUserBalance', params, 'post', 'pay'); // 积分展示
    },
    getCode(params) {
        return fetch('/app/mobile/user/app/sms.htm', params); // 获取验证码
    },
    reset(params) {
        return fetch('/app/mobile/user/app/findPassword.htm', params); // 找回密码
    },
    myDesign(params) {
        return fetch('/app/mobile/design/designPlan/myDesignPlanMobile.htm', params); // 我的设计
    },
    // recom(params) {
    //     return fetch('/app/mobile/designPlanRecommended/planRecommendedList.htm', params, '', 'tq'); // 推荐
    // },
    recom(params) {
        return fetch('/app/mobile/designPlanRecommended/planRecommendedList.htm', params); // 推荐
    },
    collect(params) {
        return fetch('/app/mobile/designPlanCollect/getCollectList.htm', params); // 获取所有收藏方案
    },
    space(params) {
        return fetch('/app/mobile/design/designPlan/getSpace.htm', params); // nav的空间列表
    },
    style(params) {
        return fetch('/app/mobile/spaceCommon/getDesignStyleList.htm', params); // nav的风格列表
    },
    getShape(params) {
        return fetch('/app/mobile/spaceCommon/getSpaceShape.htm', params); // nav的形状列表
    },
    fullView(params) {
        // return fetch('/app/mobile/design/designPlan/getPanoPicture.htm', params); // 我的设计720°全景
        return fetch('app/mobile/design/designPlan/getPanoPicture.htm', params, '', 'render'); // 我的设计720°全景
    },
    getPictureList(params) {
        return fetch('app/mobile/renderPic/getPictureList.htm', params, '', 'render'); // 我的设计缩略图(新)
        // return fetch('/app/mobile/renderPic/getPictureList.htm', params); // 我的设计缩略图
    },
    recomGetPictureList(params) {
        return fetch('app/mobile/designPlanRecommended/getRecommendedPictureList.htm', params, '', 'render'); // 推荐缩略图
    },
    detailsSee(params) {
        return fetch('app/mobile/design/designPlan/detailsSee.htm', params); // 获取720多点与漫游视频
    },
    getDesignPlanProductList(params) {
        return fetch('app/mobile/design/designPlan/getDesignPlanProductList.htm', params); // 获取720详情列表
    },
    getFavoritesList(params) {
        return fetch('/app/mobile/designPlanCollect/getFavoritesList.htm', params); // 获取收藏夹列表
    },
    addDesingPlanCollect(params) {
        return fetch('/app/mobile/designPlanCollect/addDesingPlanCollect.htm', params); // 添加收藏
    },
    subDesingPlanCollect(params) {
        return fetch('/app/mobile/designPlanCollect/delDesingPlanCollect.htm', params); // 取消收藏
    },
    delDesingPlanCollect(params) {
        return fetch('/app/mobile/designPlanCollect/delDesingPlanCollect.htm', params); // 取消收藏
    },
    houseType(params) {
        return fetch('/app/mobile/houseSearch/newHouseSearchWeb.htm', params); // 根据省市区搜索户型
    },
    typeArea(params) {
        return fetch('/app/mobile/spaceCommon/getSpaceAndarea.htm', params); // 获取房间类型及对应的面积范围
    },
    spaceType(params) {
        return fetch('/app/mobile/spaceCommon/newSpaceSearchWeb.htm', params); // 根据空间类型、面积搜索户型
    },
    detailType(params) {
        return fetch('/app/mobile/houseSearch/newHouseListWeb.htm', params); // 点击小区名字搜索户型
    },
    spaceLayout(params) {
        return fetch('/app/mobile/houseSearch/newHouseSpaceListWeb.htm', params); // 通过户型过滤空间布局图
    },
    newSpaceDesign(params) {
        return fetch('/app/mobile/spaceCommon/newSpaceDesignWeb.htm', params); // 通过空间搜索过滤空间布局图
    },
    removeAllNews(params) {
        return fetch('/app/mobile/sysUserMessage/removeAll.htm', params); // 清空所有消息
    },
    personalNewsList(params) {
        return fetch('/app/mobile/sysUserMessage/getList.htm', params); // 获取个人中心列表
    },
    personalDeleteOneNews(params) {
        return fetch('/app/mobile/sysUserMessage/delete.htm', params); // 个人中心删除单条信息
    },
    personalNewsIsRead(params) {
        return fetch('/app/mobile/sysUserMessage/findUnread.htm', params); // 个人中心信息是否已读
    },
    // getResRenderPicWeb (params) { // 户型渲染临时接口
    //   return fetch('/app/mobile/renderPic/getResRenderPicWeb.htm', params);
    // },
    submitHouse(params) {
        return fetch('/app/mobile/uploadHouse/create.htm', params); // 上传户型
    },
    getSpaceNameInHouse(params) {
        return fetch('/app/mobile/houseSearch/getSpaceNameInHouse.htm', params); // 一键装修头nav
    },
    transformAndCopyPlan(params) {
        return fetch('/app/mobile/autoRenderAndOneKeyCopy/transformAndCopyPlan.htm', params); // 渲染720接口
    },
    whetherRender(params) {
        return fetch('/app/mobile/pay/whetherRender.htm', params); // 判断是否渲染过720
    },
    findExpenseRecordList(params) {
        let url = `/v1/web/pay/payOrder/findExpenseRecordList?limit=${params.limit}&start=${params.start}`;
        return fetch(url, '', 'get', 'pay');
    },
    getQRCodePicUrl(params) {
        return fetch('app/mobile/renderPic/getQRCodePicUrl.htm', params, '', 'render'); // 获取720的二维码
        // return fetch('app/mobile/renderPic/getQRCodePicUrl.htm', params); // 获取720的二维码
    },
    searchProduct(params) {
        // return fetch('app/mobile/searchProduct/searchProduct.htm', params); // 查询产品库
        return fetch('/web/mobile/search/searchProduct.htm', params, '', 'productSearch'); // 查询产品库
    },
    addRenderTasks(params) { // 替换渲染任务、装进我家渲染任务
        // return fetch('app/mobile/pay/replaceRecord.htm', params);
        return fetch('app/render/server/addRenderTask.htm', params, '', 'render')
    },
    getMyReplaceRecord(params) {
        return fetch('/mobile/pay/getMyReplaceRecord.htm', params, '', 'render'); // 获取个人中心我的替换渲染任务
        // return fetch('app/mobile/pay/getMyReplaceRecord.htm', params); // 获取个人中心我的替换渲染任务
    },
    getAutoRender(params) {
        return fetch('app/mobile/renderPic/getAutoRender.htm', params); // 获取个人中心我的替换渲染任务
    },
    // getMyMessageList(params) {
    //   return fetch('app/mobile/pay/getMyMessageList.htm', params); // 获取个人中心消息
    // },
    // getAllSysDictionary(params) {
    //   return fetch('app/mobile/sysDictionary/getAllSysDictionary.htm', params); // 获取所有的系统文件字典
    // },
    searchProductGroup(params) {
        // return fetch('app/mobile/searchProductGroup/searchProductGroup.htm', params); // 搜索组合替换的列表
        return fetch('/web/mobile/search/searchProductGroup.htm', params, '', 'productSearch'); // 搜索组合替换的列表
    },
    findSameTypeProductList(params) {
        return fetch('/web/mobile/search/findSameTypeProductList.htm', params, '', 'productSearch'); // 搜索材质的接口
        // return fetch('app/mobile/searchProductGroup/findSameTypeProductList.htm', params); // 搜索材质的接口
    },
    searchProCategory(params) {
        return fetch('/web/mobile/search/searchProCategory.htm', params, '', 'productSearch'); // 产品搜索筛选条件
        // return fetch('app/mobile/searchProduct/searchProCategory.htm', params); // 产品搜索筛选条件
    },
    deteleMyTaskAndDesign(params) {
        return fetch('app/mobile/pay/deteleMyTaskAndDesign.htm', params); // 我的任务删除我的设计实时删除
    },
    getDesignPlanHasBeCollected(params) {
        return fetch('app/mobile/designPlanCollect/getDesignPlanHasBeCollected.htm', params); // 获取该方案是否被收藏
    },
    selectTextureById(params) {
        return fetch('/web/mobile/search/selectTextureById.htm', params, '', 'productSearch'); // 移动端查询材质详情的接口
        // return fetch('app/mobile/searchProductGroup/selectTextureById.htm', params); // 移动端查询材质详情的接口
    },
    getWXSettings(params) {
        return fetch('app/mobile/unlocking/getWXSettings.htm', params); // 移动端获取微信支付配置的接口
    },
    selectProductById(params) {
        return fetch('/web/mobile/search/selectProductById.htm', params, '', 'productSearch'); // 移动端获取原来产品材质的接口
        // return fetch('app/mobile/searchProductGroup/selectProductById.htm', params); // 移动端获取原来产品材质的接口
    },
    searchProvinceCodeAndCityCode(params) {
        return fetch('app/mobile/houseSearch/searchProvinceCodeAndCityCode.htm', params); // 查询所有省份和市区编码
    },
    deleteMyDesignPlanAndTask(params) {
        return fetch('app/mobile/design/designPlan/deleteMyDesignPlanAndTask.htm', params); // 删除我的设计
    },
    integralPay(params) {
        return fetch('/v1/web/pay/payOrder/addMobileLoginIntegralPay', params, 'post', 'pay'); // 积分支付
    },
    wechatPay(params) {
        return fetch('/v1/web/pay/payOrder/addMobileLoginPay', params, 'post', 'pay'); // 微信H5支付
    },
    aliPay(params) {
        // return fetch(url, params, 'get', 'pay'); // 微信H5支付
        return fetch('/v1/web/pay/payOrder/addPostponeAlipay', params, 'post', 'pay'); // 微信H5支付
    },
    getOrder(params) { // 支付回调获取订单信息
        let url = `/v1/web/pay/payOrder/getOrderInfo?orderNo=${params.orderNo}`;
        return fetch(url, '', 'get', 'pay');
    },
    getShareJson(params) { // 支付回调获取订单信息
        return fetch('/app/mobile/WXShare/getShareJson.htm', params);
    },
    getNewPayData(params) { // 获取微信支付参数
        let url = `/v1/web/pay/payOrder/addMobileLoginAppPay`;
        return fetch(url, params, 'post', 'pay');
    },
    isPackYearsAndMonth(params) { // 是否包年包月
        let url = `/v1/web/pay/payModelConfig/checkRenderGroopRef`;
        return fetch(url, params, 'post', 'pay', 'formData');
    },
    getAliPayPayInfo(params) { // 获取支付宝支付参数
        let url = `v1/web/pay/payOrder/addMobileLoginAppAlipay`;
        return fetch(url, params, 'post', 'pay');
    },
    logout(params) { // 退出登录
        return fetch('/v1/user/logout', params, '', 'limit'); // 权限改造登录
    },
    productReplaceList(params) { // 产品替换搜索产品单品列表
        let url = `/fullsearch-app/universal/product/replace/list`;
        return fetch(url, params, 'get', 'seekUrl');
    },
    amendType() { // 判断企业类型
        let url = `/v1/center/isMultipleFranchiserAccount`;
        return fetch(url, '', 'post', 'uc');
    },
    btnDisabled(params) { // B端修改手机号
        let url = `v2/user/center/modify2BUserMobile`;
        return fetch(url, params, 'post', 'uc');
    },
    modify2BUserMobileAndPassword(params) { // B端修改手机号及密碼
        let url = `/v2/user/center/modify2BUserMobileAndPassword`;
        return fetch(url, params, 'post', 'uc');
    },
    getDetailByIds(params) {
        let url = `web/app/search/getDetailByIds.htm`;
        return fetch(url, params, 'get', 'productSearch');
    },
    mydrawhouse(params) { // 我的绘制
        let url = `/app/web/home/myhouse/mydrawhouse.htm`;
        return fetch(url, params, 'get');
    },
    houseRecord(params) { // 使用记录
        let url = `/app/web/home/myhouse/record.htm`;
        return fetch(url, params, 'get');
    },

    // 我的钱包
    banklist(params) { //  获取银行列表GET
        let url = `/v1/union/bank/banklist`;
        return fetch(url, params, 'get', 'role');
    },
    checkCode(authCode, mobile) { // 校验银行预留手机号是否合法
        let url = `/v1/union/bank/checkCode?authCode=${authCode}&mobile=${mobile}`;
        return fetch(url, '', 'get', 'role');
    },
    unBind(id) { // 解绑银行卡
        let url = `/v1/union/bank/unBind?id=${id}`;
        return fetch(url, '', 'get', 'role');
    },
    getbanklist() { // 获取绑定银行卡列表信息
        let url = `/v1/union/bank/list`;
        return fetch(url, '', 'get', 'role');
    },
    bindbank(params) { // 绑定银行卡
        let url = `/v1/union/bank/bind`;
        return fetch(url, params, 'post', 'role');
    },
    mycommission(params) { // 我的钱包信息
        let url = `/v1/union/commission/mycommission`;
        return fetch(url, params, 'get', 'role');
    },
    mycommissioninfo(params) { // 我的佣金信息
        let url = `/v1/union/commission/mycommissioninfo`;
        return fetch(url, params, 'get', 'role');
    },
    myincomeexpenses(curPage, pageSize, year, month) { // 我的收支明细
        let url = `/v1/union/commission/myincomeexpenses?curPage=${curPage}&pageSize=${pageSize}&year=${year}&month=${month}`;
        return fetch(url, '', 'get', 'role');
    },
    checkisbind() { // 查看用户是否绑定过银行卡
        let url = `/v1/union/bank/checkisbind`;
        return fetch(url, '', 'get', 'role');
    },

    // 方案详情
    planDetail(id, type) { // 方案详情
        let url = `/designplan/getRecommendedDesignPlanDetail?id=${id}&type=${type}`;
        return fetch(url, '', 'get', 'min');
    },
    // 方案收藏
    setFavoriteOrUnfavorite(params) { // 收藏
        let url = `/designplanfavorite/setFavoriteOrUnfavorite`;
        return fetch(url, params, 'post', 'min');
    },
    // 方案点赞
    setLikeOrDislike(params) {
        let url = `/designPlanLike/setLikeOrDislike`;
        return fetch(url, params, 'post', 'min');
    },

    // socket
    userContactList() { // 会话信息列表
        let url = `/v1/msgCenter/userContact/list?userSessionId=${JSON.parse(localStorage.getItem('userInfo')).sessionId}`;
        return fetch(url, '', 'get', 'soc');
    },
    historyMsgList(data) { // 历史聊天记录
        let url = `/v1/msgCenter/historyMsg/list?userSessionId=${JSON.parse(localStorage.getItem('userInfo')).sessionId}&contactSessionId=${data.contactSessionId}&relatedObjType=${data.relatedObjType}&relatedObjId=${data.relatedObjId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&platformCode=mobile`;
        return fetch(url, '', 'get', 'soc');
    },
    resetUnreadMsg(contactSessionId, relatedObjType, relatedObjId) { // 重置消息为已读
        let url = `/v1/msgCenter/userContact/resetUnreadMsg?userSessionId=${JSON.parse(localStorage.getItem('userInfo')).sessionId}&contactSessionId=${contactSessionId}&relatedObjType=${relatedObjType}&relatedObjId=${relatedObjId}`;
        return fetch(url, '', 'post', 'soc');
    },
    removeContact(contactSessionId, relatedObjType, relatedObjId) { // 删除一组会话
        let url = `/v1/msgCenter/userContact/remove?userSessionId=${JSON.parse(localStorage.getItem('userInfo')).sessionId}&contactSessionId=${contactSessionId}&relatedObjType=${relatedObjType}&relatedObjId=${relatedObjId}`;
        return fetch(url, '', 'post', 'soc');
    },
    uploadMessImg(data) {
        let url = `v1/msgCenter/historyMsg/upload`;
        return fetch(url, data, 'post', 'soc')
    },
    //提交退款原因
    applicationRefund(params) {
        let url = '/app/mobile/decorateOrder/refund/application.htm'
        return fetch(url, params, 'post');
    },
    //获取订单详情
    getorderDetail(params) {
        let url = '/v1/mobile/decorateOrder/getDetail.htm'
        return fetch(url, params, 'get');
    },
    //
    getRobList(Mark) { // 限时快抢列表
        //let url = `/mobile2b-app_branch_decorate/app/mobile/decorateSeckill/getList.htm?start=${Mark.start}&cityCode=${Mark.cityCode}&decorateBudgetValue=${Mark.decorateBudgetValue}&limit=20`;
        let url = '/app/mobile/decorateSeckill/getList.htm';
        return fetch(url, Mark, 'post', '');
    },
    seckill(id) { // 限时快抢,抢单
        let url = `/app/mobile/decorateSeckill/seckill.htm?id=${id}`;
        return fetch(url, '', 'post', '');
    },
    getSelectList() { // 限时快抢, 装修方式 /v1/mobile/decorateOrder/getDetail
        let url = 'app/mobile/system/sysDictionary/getSelectList.htm?type=decorateType';
        return fetch(url, '', 'get', '');
    },
    getTimeRobDetails(id) { // 限时快抢单详情接口
        let url = `/app/mobile/decorateSeckill/getDetails.htm?id=${id}`;
        return fetch(url, '', 'get', '');
    },
    updateStatus(data) { // 限时快抢取消订单
        let url = `/app/mobile/decorateSeckill/updateStatus.htm`;
        return fetch(url, data, 'post', '');
    },
    getSelectStyleList() { // 限时快抢获取风格
        let url = `/app/mobile/system/sysDictionary/getSelectList.htm?type=goodStyle`;
        return fetch(url, '', 'get', '');
    },
    getBudGetList() { // 获取限时快抢预算下拉数据
        let url = `/app/mobile/system/sysDictionary/getSelectList.htm?type=decorateBudget`;
        return fetch(url, '', 'get', '');
    },
    getSeckillResidueCount() { // 获取今天抢单剩余次数接口
        let url = `/app/mobile/decorateSeckill/getSeckillResidueCount.htm`;
        return fetch(url, '', 'get', '');
    },
    timeRobPay(id) { // 限时抢度币支付
        let url = `/app/mobile/decoratePay/pay.htm?id=${id}&orderType=0`;
        return fetch(url, '', 'get', '');
    },
    myCummerPay(id) { // 我的客户度币支付
        let url = `/app/mobile/decoratePay/pay.htm?id=${id}&orderType=2`;
        return fetch(url, '', 'get', '');
    },
    getMyCumerList(Mark) { // 获取我的客户订单列表
        if (Mark.type == 0) {
            let url = `/v1/mobile/decorateOrder/getList.htm?userId=${JSON.parse(localStorage.getItem('userInfo')).id}&orderStatus=${Mark.status}&start=${Mark.start}&limit=${Mark.limit}`;
            return fetch(url, '', 'get', '');
        } else {
            let url = `/v1/mobile/decorateOrder/getList.htm?userId=${JSON.parse(localStorage.getItem('userInfo')).id}&contractStatus=0&start=${Mark.start}&limit=${Mark.limit}`;
            return fetch(url, '', 'get', '');
        }
    },
    getCumerDetail(orderId) { // 获取我的客户订单详情  /app/product/baseCompany/setup/dispatch.htm
        let url = `/v1/mobile/decorateOrder/getDetail.htm?orderId=${orderId}`;
        return fetch(url, '', 'get', '');
    },
    setDispatch(data) { // 我的客户设置修改
        let url = `/app/product/baseCompany/setup/dispatch.htm?isReceivePlatformDispatch=${data.isReceivePlatformDispatch}&isReceiveInteriorDispatch=${data.isReceiveInteriorDispatch}`;
        return fetch(url, '', 'post', '');
    },
    getDispatch() { // 获取我的客户设置
        let url = `/app/product/baseCompany/get/dispatch.htm`;
        return fetch(url, '', 'get', '');
    },
    updateRemark(Mark) { // 修改我的客户备注,订单状态
        let url = `/app/mobile/decorateOrder/update.htm`;
        return fetch(url, Mark, 'post', '');
    },
    //支付方案版权费接口 /v2/user/center/applyFormal
    payPlanPrice(params) {
        let url = baseAPI.tqLOcalurl + `/app/render/server/payDesignPlanCopyRight.htm`
        return fetch(url, params, 'post')
    },
    // 意见反馈
    feedbackAdd(params) { // 新增反馈
        let url = `/v1/feedback/web/feedbackAdd`
        return fetch(url, params, 'post', 'collect')
    },
    feedbackDetail(id) { // 反馈详情
        let url = `/v1/feedback/web/feedbackDetail?feedbackId=${id}`
        return fetch(url, '', 'get', 'collect')
    },
    feedbackEstimate(data) { // 反馈答复评价
        let url = `/v1/feedback/web/feedbackEstimate`
        return fetch(url, data, 'post', 'collect')
    },
    feedbackList() { // 反馈列表
        let url = `/v1/feedback/web/feedbackList?userId=${JSON.parse(localStorage.getItem('userInfo')).id}&platformId=1`
        return fetch(url, '', 'get', 'collect')
    },
    feedUploadImg(data) { // 意见反馈图片上传
        let url = `/v1/storage/upload`
        return fetch(url, data, 'post', 'admin')
    },
    // 申请VIP接口，限制部分功能，设计师入驻
    applyFormal() {
        let url = `/v2/user/center/applyFormal`
        return fetch(url, '', 'post', 'uc')
    },
    // 190108 rzd 电子名片
    // 校验用户是否有名片权限
    checkUserHaveUserCard(data) {
        let url = `/v1/core/userCard/checkUserHaveUserCard`
        return fetch(url, '', 'get', 'core')
    },
    // 获取登录用户的电子名片
    getUserCard(data) {
        let url = `/v1/core/userCard/getUserCard?userId=${JSON.parse(localStorage.getItem('userInfo')).id}`
        return fetch(url, '', 'get', 'core')
    },
    addUserCardTransmitRecord(data) {
        let url = `/v1/core/userCard/addUserCardTransmitRecord`
        return fetch(url, data, 'post', 'core')
    },
    // 新增或修改电子名片
    addOrUpdate(data) {
        let url = `/v1/core/userCard/addOrUpdate`
        return fetch(url, data, 'post', 'core')
    },
    // 名片分享获取小程序码
    getWXQRCode(userCardId) {
        let url = `/v1/core/userCard/getWXQRCode?companyId=${JSON.parse(localStorage.getItem('userInfo')).companyId}&userCardId=${userCardId}`
        return fetch(url, '', 'get', 'core')
    },
    // 访客列表
    getaccessrecord(data) {
        let url = `/v1/core/usercardaccess/getaccessrecord?userAccessId=${data.userAccessId}&currPage=${data.currPage}&pageSzie=10`
        return fetch(url, '', 'get', 'core')
    },
    // 意向列表
    getaccessoperation(data) {
        let url = `/v1/core/usercardaccess/getaccessoperation?userAccessId=${data.userAccessId}&currPage=${data.currPage}&pageSzie=10&purposeType=${data.purposeType}`
        return fetch(url, '', 'get', 'core')
    },
    // 访问数据
    getAccessCount(userAccessId) {
        let url = `/v1/core/usercardaccess/getAccessCount?userAccessId=${userAccessId}`
        return fetch(url, '', 'get', 'core')
    },
    // 设计模块调整
    myDesignPlanMobile(data) { // 我的设计
        let url = `/app/mobile/design/designPlan/myDesignPlanMobile.htm`
        return fetch(url, data, 'post', '')
    },
    updatePlanName(data) { // 修改方案名
        let url = `/app/mobile/design/designPlan/updatePlanName.htm`
        return fetch(url, data, 'post', '')
    },
    deleteMyDesignPlanAndTask(data) { // 我的设计
        let url = `/app/mobile/design/designPlan/deleteMyDesignPlanAndTask.htm`
        return fetch(url, data, 'post', '')
    },
    uploadtest(data) { //富文本上传图片
        let url = `/v1/storage/upload`
        return fetch(url, data, 'post', 'admin')
    },
    // 720 倒流
    getQRCodeTypeCount() { // 获取二维码应显示数量	
        let url = `/v1/share/getQRCodeTypeCount.htm`
        return fetch(url, '', 'get', 'render')
    },
    getWxacodeun(data) { // 获取二维码
        let url = `/v1/share/getWxacodeun.htm`
        return fetch(url, data, 'post', 'render', 'formData')
    },
    getRenderId(data) { // 获取renderId
        let url = `/v1/share/getRenderId.htm`
        return fetch(url, data, 'get', 'render')
    },
};