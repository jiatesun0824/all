import { login } from 'api/login';
import { SET_USER_INFO, SET_TOKEN } from 'store/types';
import { pick } from 'lodash';
import md5 from 'utils/md5';
import toast from 'components/Toast';
import router from 'router';
import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
export const GET_ACCOUNT = 'GET_ACCOUNT';
export const GET_PASSWORD = 'GET_PASSWORD';

export default {
    namespaced: true,
    state: {
        account: localStorage.getItem('rememberPhone') || '',
        password: localStorage.getItem('rememberPassword') && window.atob(localStorage.getItem('rememberPassword')) || ''
    },
    mutations: {
        [GET_ACCOUNT](state, account) {
            state.account = account;
        },
        [GET_PASSWORD](state, password) {
            state.password = password;
        }
    },
    getters: {
        account: state => state.account,
        password: state => state.password
    },
    actions: {
        getAccount({ commit }, account) {
            commit(GET_ACCOUNT, account);
        },
        getPassword({ commit }, password) {
            commit(GET_PASSWORD, password);
        },
        checkPhone({ getters }) {
            // if (/^(13|14|15|16|17|18|19)\d{9}$/.test(getters.account) || getters.account.length === 19) {
            //     return checkPhone(getters.account);
            // }
            // toast('请输入正确的手机号码！');
            return false;
        },
        async login({ commit, getters, dispatch }) {
            let { success } = await dispatch('checkPhone') || { success: '' };
            if (success) { toast('输入手机号尚未注册！'); return false; };
            // if (success === false) {
            if (true) {
                let password = md5(md5('WeB' + getters.password));
                let { flag, obj, message, exceptionCode } = await login({...pick(getters, ['account']), password });
                if (flag) {
                    // if (!(obj.userType === 11 || obj.userType === 13)) { toast('该账号未授权！'); return false; };
                    commit(`common/${SET_USER_INFO}`, obj, { root: true });
                    commit(`common/${SET_TOKEN}`, obj.token, { root: true });
                    localStorage.removeItem('firstInHomeFlag');
                    if (obj.passwordUpdateFlag === 1) { router.push('/setAccount'); return false; };
                    if (obj.maturityFlag && obj.userType != 5) {
                        toast('套餐到期，请联系客服！');
                        commit(`common/${SET_TOKEN}`, '', { root: true });
                        router.push('/cumstomer');
                        return false;
                    } else if (obj.promptUpdatePassword == 1) {
                        localStorage.setItem('firstLogin', 1);
                        localStorage.setItem('rememberPhone', getters.account);
                        localStorage.setItem('rememberPassword', window.btoa(getters.password));
                        localStorage.setItem('pwd', password);
                        router.push('/');
                        // Vue.use(VueSocketio, socketio(`${process.env.BUILD_SOCKET}?userSessionId=${(JSON.parse(localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).sessionId : '')}&appId=1`));                        
                        return true;
                    } else {
                        localStorage.setItem('rememberPhone', getters.account);
                        localStorage.setItem('rememberPassword', window.btoa(getters.password));
                        localStorage.setItem('pwd', password);
                        router.push('/');
                        // Vue.use(VueSocketio, socketio(`${process.env.BUILD_SOCKET}?userSessionId=${(JSON.parse(localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).sessionId : '')}&appId=1`));
                    }
                } else {
                    if (message == '未开通此平台权限,请联系客服.') {
                        toast(message);
                        commit(`common/${SET_TOKEN}`, '', { root: true });
                        router.push('/cumstomer');
                        return false;
                    }
                    if (exceptionCode == 10010040) {
                        commit(`common/${SET_TOKEN}`, '', { root: true });
                        toast('账号到期，请联系客服！');
                        router.push('/cumstomer');
                        return false;
                    }
                    toast(message);
                }
            }
        }
    }
};