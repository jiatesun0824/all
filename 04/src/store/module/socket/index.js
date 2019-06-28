export default {
    namespaced: true,
    state: {
        haveUnRead: false, // 是否有未读消息
        fromWhere: 1, // 从店铺进来为1，从供求为2,是从哪里进入聊天界面的
        relatedObj: { // 创建会话上传位置信息
            relatedObjId: '', // 供求或店铺ID
            contactSessionId: '' // 会话对方的id
        },

        chatMessage: [], // 实时接收消息
        haveStystemUnRead: false,
        cardOptNum: 0,
        cardComeNUm: 0

    },
    mutations: {
        setCardComeNUm(state, data) {
            state.cardComeNUm = data;
        },
        setCardOptNum(state, data) {
            state.cardOptNum = data;
        },
        setUnRead(state, data) {
            state.haveUnRead = data;
        },
        sethaveStystemUnRead(state, data) {
            state.haveStystemUnRead = data;
        },
        setFromWhere(state, data) {
            state.fromWhere = data;
        },
        setRelateObj(state, data) {
            state.relatedObj = data;
        },
        setChatMessage(state, data) {
            if (data == 'setNull') {
                state.chatMessage = []
            } else if (data.isPullup) {
                state.chatMessage.unshift(data.item);
            } else {
                state.chatMessage.push(data.item);
            }
        },
        'SOCKET_CONNECT' (state) {
            console.log('链接成功1')
        },
        'SOCKET_IM_CHAT_MSG_EVENT' (state, value) { // 接收数据
            state.chatMessage.push(Object.assign(value, { showTime: false }))
        },
        'SOCKET_IM_PUSH_MSG_EVENT' (state, value) { // 系统消息
            switch (value.msgCode) {
                case "PUSH_CARD_ACCESS_OPERATION_LOG_MSG":
                    state.cardOptNum = JSON.parse(value.msgContent).unReadMsgCount;
                    break;
                case "PUSH_CARD_ACCESS_MSG":
                    state.cardComeNUm = JSON.parse(value.msgContent).unReadMsgCount;
                    break;
                default:
                    state.haveStystemUnRead = true;
                    break;
            }
        },
        'SOCKET_IM_UNREAD_MSG_EVENT' (state, value) { // 未读消息
            state.haveUnRead = (value == `{'hasUnreadMsg':1}`)
        }
    },
    getters: {
        haveUnRead: state => state.haveUnRead,
        haveStystemUnRead: state => state.haveStystemUnRead,
        fromWhere: state => state.fromWhere,
        relatedObj: state => state.relatedObj,
        chatMessage: state => state.chatMessage,
        chatMessageBoll: state => state.chatMessageBoll,
        cardOptNum: state => state.cardOptNum,
        cardComeNUm: state => state.cardComeNUm
    },
    actions: {
        setCardComeNUm({ commit }, data) {
            commit('setCardComeNUm', data);
        },
        setCardOptNum({ commit }, data) {
            commit('setCardOptNum', data);
        },
        setUnRead({ commit }, data) {
            commit('setUnRead', data);
        },
        sethaveStystemUnRead({ commit }, data) {
            commit('sethaveStystemUnRead', data);
        },
        setFromWhere({ commit }, data) {
            commit('setFromWhere', data);
        },
        setRelateObj({ commit }, data) {
            commit('setRelateObj', data);
        },
        setChatMessage({ commit }, data) {
            commit('setChatMessage', data);
        },
    }
};