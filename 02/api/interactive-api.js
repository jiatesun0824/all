import request from './request.js';
const interactiveAPI = {
  getTopicList(params = {}) { // 所有主题列表接口
    return request('coreUrl').get('core/interactiveZoneTopic/list', params)
  },
  getTopicDetail(params = {}) { // 所有主题详情接口
    return request('coreUrl').get(`core/interactiveZoneTopic/sxw/topic/${params.id}`, params)
  },
  getReplyList(params = {}) { // 评论回复列表接口
    return request('coreUrl').get(`core/interactiveZoneReply/list`, params)
  },
  getUploadRespic(params = {}) { // 发布问答/回复/参与讨论添加图片
    return request('unionUrl').post('union/supplydemandpic/uploadrespic', params)
  },
  getZoneTopicAdd(params = {}) { // 主题添加
    return request('coreUrl').post('core/interactiveZoneTopic/add', params)
  },
  getZoneTopicUpdate(params = {}) { // 所有主题修改接口
    return request('coreUrl').post('core/interactiveZoneTopic/update', params)
  },
  getZoneReplyAdd(params = {}) { // 所有评论回复接口
    return request('coreUrl').post('core/interactiveZoneReply/add', params)
  },
  getZoneReplyUpdate(params = {}) { // 所有评论回复修改接口
    return request('coreUrl').post('core/interactiveZoneReply/update', params)
  },
  getZoneStatus(params = {}) { // 点赞收藏接口
    return request('coreUrl').post('core/interactiveZoneTopic/status', params)
  },
  getHouseDetail(parms = {}){
    return request('coreUrl').get(`core/interactiveZoneTopic/${parms.id}`)
  },
  getPlanDetail(parms = {}) {
    return request('coreUrl').get(`core/interactiveZoneTopic/${parms.id}/${parms.type}`)
  },
  getFavoriteAsk(parms = {}) {//收藏问答帖子
    return request('coreUrl').get(`/core/interactiveZoneTopic/askAndAnswer/favorite`, parms)
  },
  getFavoriteTopic(parms = {}) {//收藏话题
    return request('coreUrl').get(`/core/interactiveZoneTopic/topic/favorite`, parms)
  },
  getFavoriteShare(parms = {}) {//收藏大咖分享
    return request('coreUrl').get(`/core/interactiveZoneTopic/share/favorite`, parms)
  },
  getFavoriteDesign(parms = {}) {//收藏设计改造
    return request('coreUrl').get(`/core/interactiveZoneTopic/designReform/favorite`, parms)
  },
  getMessageList(parms = {}){  //互动消息列表接口
    return request('coreUrl').get(`core/message/interaction/${parms.curPage}/${parms.pageSize}`)
  },
  getMessageRead(parms = {}){ //消息红点
    return request('coreUrl').post(`core/message/interaction/read`,parms)
  },
  getFavoriteCount(parms = {}) {  //收藏帖子数
    return request('coreUrl').get(`core/interactiveZoneTopic/favoriteCount`,parms)
  },
  getInteractiveLastMessage(parms = {}) {
    return request('coreUrl').get(`core/message/interaction/getInteractiveLastMessage`,parms)
  },
  getInteractiveLastTotal(parms = {}) { // 互动未读消息数
    return request('coreUrl').get(`core/message/interaction/total`, parms)
  }
}
export default interactiveAPI