import { 
	getPrivateMessageList,
	getprivatemessageinfolist,
	adduserprivatemessage,
	deluserprivatemessage,
	getallsupplydemandinfo,
	updatemysupplydemandstatus,
	systemMsgList
} from 'api/user';
import { GET_MY_INFO } from 'store/types';
const GET_SYS_MSG = 'GET_SYS_MSG';

export default {
  namespaced: true, // 声明模块可重复封装利用
  state: {
    myInfo: {},
    // 留言模块
    MessageList: {},    // 留言列表
    page: {
    curPage: 1,
    pageSize: 10,
      type: 1
    },
    friendId: {         //  商户ID
      friendId: 0,
      friendName: '',
      type: 1
    },
    messageInfoList: {},     // 留言详情
    Message: {               // 发送留言传参
      messageContent: '',
      friendId: 0,
      messageType: 1,
      curPage: 1,
      pageSize: 10,
      type: 1
    },
    userPrivateMessag: {},    // 用户发送消息后返回值
    deluserprivatemessage: [], // 用户删除会话后的返回值

    // 发布模块
    allsupplydemandinfo: [],      //  用户发布列表
    supplyItem: {},              //  用户发布列表中的item

    systemMsgList: '',
    systemMsgCount: 0
  },
  mutations: {
    [GET_MY_INFO](state, data) {
      state.myInfo = data;
    },
    // 留言
    getMessageList(state, data) {
      state.MessageList = data;
    },
    getprivatemessageinfolist(state, data) {
      state.messageInfoList = data;
    },
    setFriendId(state, friendId) {
      state.friendId = friendId;
    },
    adduserprivatemessage(state, data) {
      state.userPrivateMessag = data;
    },
    setMessage(state, Message) {
      state.Message = Message;
    },
    deluserprivatemessage(state, data) {
      state.deluserprivatemessage.push(data);
    },
    // 发布
    getallsupplydemandinfo(state, data) {
      state.allsupplydemandinfo = data;
    },
    setsupplyItem(state, data) {
      state.supplyItem = data;
    },
    [GET_SYS_MSG](state, {start, datalist, totalCount}) {
			state.systemMsgList = start ? [...state.systemMsgList, ...datalist] : datalist;
			state.systemMsgCount = totalCount;
    }
  },
  getters: {
    myInfo: state => state.myInfo,
    // 留言
    MessageList: state => state.MessageList,
    page: state => state.page,
    friendId: state => state.friendId,
    messageInfoList: state => state.messageInfoList,
    Message: state => state.Message,
    userPrivateMessag: state => state.userPrivateMessag,

    // 发布
    allsupplydemandinfo: state => state.allsupplydemandinfo,
		supplyItem: state => state.supplyItem,
		systemMsgList: state => state.systemMsgList,
		systemMsgCount: state => state.systemMsgCount
  },
  actions: {
    // 获取我的消息列表
    async queryPrivateMessageList({ commit, getters }) {
      let data = await getPrivateMessageList(getters.page);
      commit('getMessageList', data);
    },
    // 获取我的消息详情
    async queryPrivateMessageInfoList({ commit, getters }) {
      let data = await getprivatemessageinfolist(getters.friendId);
      data.status ? commit('getprivatemessageinfolist', data) : console.log(data.message);
    },
    // 设置商家ID
    setFriendId({ commit }, friendId) {
      commit('setFriendId', friendId);
    },
    // 发送消息
    async queryAdduserPrivateMessage({ commit, getters }) {
      let data = await adduserprivatemessage(getters.Message);
      data.status ? commit('adduserprivatemessage', data) : console.log(data.message);
    },
    // 设置发送消息接口请求传参
    setMessage({ commit }, Message) {
      commit('setMessage', Message);
    },
    // 删除一组会话
    async queryDeluserPrivateMessage({ commit }, friendId) {
      let data = await deluserprivatemessage(friendId);
      data.status ? commit('deluserprivatemessage', data) : console.log(data.message);
    },

    // 获取我的发布列表
    async queryGetallSupplyDemandinfo({ commit }, Mark) {
      let data = await getallsupplydemandinfo(Mark);
      data.status ? commit('getallsupplydemandinfo', data) : console.log(data.message);
    },
    setsupplyItem({ commit }, data) {
      commit('setsupplyItem', data);
    },
    async querySysMsg({ commit, rootGetters }, { start = 0, limit = 10, order = 'gmtModified', orderNum = 'desc' } = {}) {
			let data = {
				limit,
				start: start * limit,
				order,
				orderNum,
				userId: rootGetters['common/userInfo']['id']
			};

			let { totalCount, datalist } = await systemMsgList(data);

			commit(GET_SYS_MSG, {start, datalist, totalCount});

    }
	}
};
