import fetch from './fetch'
import commonJs from './common'
export default Object.assign({
  getRecommendationplan (params = {}) { // 获取方案
    return fetch('allSearchUrl').post('/fullsearch-app/all/recommendationplan/search/mini/list', params)
  },
  getCase (params = {}) { // 获取案例
    return fetch('shopUrl').get('/sandu/mini/companyshop/projectCaseList', params)
  },
  getAllCityData (parmas = {}) { // 获取地理位置
    return fetch('sevenUrl').get('/base/basearea/getAllArea')
  },
  submitOnlineSensationForm (params) { // 提交网红表单
    return fetch('systemUrl').post('/proprietor', params)
  },
  isFavoriteCase (params = {}) { // 收藏方案
    return fetch('sevenUrl').post('/designplanfavorite/setFavoriteOrUnfavorite', params)
  },
  isLikeCase (params = {}) { // 点赞方案
    return fetch('sevenUrl').post('/designPlanLike/setLikeOrDislike', params)
  },
  getVerificationCode (params = {}) { // 获取验证码
    return fetch('userUrl').formData('/v1/center/getSms', params)
  },
  setAppointment (params = {}) {
    return fetch('shopUrl').post('/sandu/mini/proprietorInfo/save', params)
  },
  getUserMessage (params = {}) { // 获取用户信息
    return fetch('shopUrl').get('/sandu/mini/proprietorInfo/getUserInfo', params)
  },
  getShopHeadPic (params = {}) { // 获取店铺头像
    return fetch('shopUrl').get('/sandu/mini/companyshop/detail', params)
  },
  /* --------------------------------------------砍价活动------------------------------------------------ */
  getRegStatus (params = {}) { // 获取活动状态
    return fetch('systemUrl').get('/act/bargain/reg/getRegStatus', params)
  },
  getActAndRegDetails (params = {}) { // 获取活动详情接口
    return fetch('systemUrl').get('/act/bargain/getActAndRegDetails', params)
  },
  cutPriceByMyself (params = {}) { // 砍价接口(自己砍价)
    return fetch('systemUrl').formData('/act/bargain/reg/cutPriceByMyself', params)
  },
  getWxActBargainAwardMsgRandomList (params = {}) { // 领取奖励消息列表接口
    return fetch('systemUrl').get('/act/bargain/awardmsg/getWxActBargainAwardMsgRandomList', params)
  },
  getInviteRecordList (params = {}) { // 砍价记录
    return fetch('systemUrl').get('/act/bargain/reg/invite/getInviteRecordList', params)
  },
  getSms (params = {}) { // 获取验证码
    return fetch('userUrl').get('/v1/center/getSms', params)
  },
  addAwardRecord (params = {}) { // 砍价成功领奖品接口
    return fetch('systemUrl').formData('/act/bargain/award/addAwardRecord', params)
  },
  getInviteCutStatus (params = {}) { // 好友进入 砍价活动
    return fetch('systemUrl').get('/act/bargain/reg/getInviteCutStatus', params)
  },
  cutPriceByInvite (params = {}) { // 好友进入 进行砍价
    return fetch('systemUrl').formData('/act/bargain/reg/cutPriceByInvite', params)
  },
  getQrminiProgramCode (params = {}) { // 获取二维码
    return fetch('unionUrl').get('/v1/union/sxw/noticecode', params)
  },
    /*--------------------------------------------元旦活动------------------------------------------------*/
  getUserRedPacketActAndRegDetails(params = {}) { // 获取活动详情
    return fetch('systemUrl').get('/act2/redpacket/getUserRedPacketActAndRegDetails', params)
  },
  recordInvitation(params = {}) { // 记录邀请信息(好友通过分享链接进入时)
    return fetch('systemUrl').post('/act2/redpacket/reg/recordInvitation', params)
  },
  isRechargeMobileBind(params = {}) { // 用户是否已绑定充值手机
    return fetch('systemUrl').get('/act2/redpacket/reg/isRechargeMobileBind', params)
  },
  getYSms(params = {}) { // 获取领奖验证码
    return fetch('userUrl').get('/v1/center/getSms', params)
  },
  bindRechargeMobile(params = {}) { // 绑定充值手机
    return fetch('systemUrl').formData('/act2/redpacket/reg/bindRechargeMobile', params)
  },
  receiveRedPacket(params = {}) { // 领取红包
    return fetch('systemUrl').formData('/act2/redpacket/reg/receiveRedPacket', params)
  },
  /*********************************************春节活动 *************************************************************/
  getUserSignInRecordList (params = {}) { // 春节活动签到列表
    return fetch('coreUrl').get('/core/userSignInRecord/getUserSignInRecordList', params)
  },
  getsignIn (params = {}) { // 春节活动签到领红包
    return fetch('coreUrl').get('/core/userSignInRecord/signIn', params)
  },
  getAwardList (params = {}) { // 抽奖转盘列表
    return fetch('systemUrl').get('/act3/luckywheel/prize/list', params)
  },
  getLottery (params = {}) { // 抽奖
    return fetch('coreUrl').formData('/core/lotterywheel/lottery', params)
  },
  getPrizeList (params = {}) { // 奖品列表
    return fetch('systemUrl').get('act3/luckywheel/lottery/record/list', params)
  },
  getLotteryWheelNeedData (params = {}) { // 用户参加抽奖信息
    return fetch('coreUrl').get('/core/lotterywheel/getLotteryWheelNeedData', params)
  },
  getCardsList (params = {}) { // 获取卡片列表
    return fetch('coreUrl').get('/core/filmTicketActivity/cards', params)
  },
  getUserTaskState (params = {}) { // 获取任务的状态
    return fetch('coreUrl').get('/core/filmTicketActivity/getUserTaskState', params)
  },
  getdoTask (params = {}) { // 领取任务
    return fetch('coreUrl').formData('/core/filmTicketActivity/doTask', params)
  },
  getdoneTask (params = {}) { // 完成任务
    return fetch('coreUrl').get('/core/filmTicketActivity/doneTask', params)
  },
  getInviteRecord (params = {}) { // 邀请记录
    return fetch('coreUrl').get('/core/filmTicketActivity/getInviteRecord', params)
  },
  bindingMobile (params = {}) { // 绑定手机号
    return fetch('coreUrl').formData('/core/filmTicketActivity/bindingMobile', params)
  },
  getSms (params = {}) { // 获取验证码
    return fetch('userUrl').get('/v1/center/getSms', params)
  },
  giveMeFive (params = {}) { // 好友助力
    return fetch('coreUrl').formData('/core/filmTicketActivity/giveMeFive', params)
  },
  redPoint (params = {}) { // 消息红点
    return fetch('coreUrl').get('/core/filmTicketActivity/redPoint', params)
  },
  getFilmTicket (params = {}) { // 获取电影票码
    return fetch('coreUrl').get('/core/filmTicketActivity/getFilmTicket', params)
  },
  getUnReceivedCard (params = {}) { // 获取用户未领取的卡片
    return fetch('coreUrl').get('/core/filmTicketActivity/getUnReceivedCard', params)
  },
  getRewardList (params = {}) { // 获取用户未领取的卡片
    return fetch('coreUrl').get(`/core/filmTicketActivity/${params.activityId}/ticket/fetched/users/10`, {})
  }
}, commonJs)
