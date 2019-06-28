import { checkPhone, getCode, register, getSourceCompany, resetpw } from 'api/register';
import { getMarkedMessage } from 'api/api';
import { SET_USER_INFO, SET_TOKEN } from 'store/types';
import { GET_ACCOUNT, GET_PASSWORD } from 'store/module/login';
import { SET_MESSAGE } from 'store/module/home';
import router from 'router';
import { pick } from 'lodash';
import md5 from 'utils/md5';
import toast from 'components/Toast';

const GET_SOURCE_COMPANY_LIST = 'GET_SOURCE_COMPANY_LIST';

export default {
    namespaced: true,
    state: {
        registerInfo: {
            mobile: '',
            password: '',
            authCode: '',
            userType: 11
        },
        RegstData: { // 用于用户离开注册页面到达用户协议页面后返回，保证数据仍在
            mobile: '',
            authCode: '',
            password: '',
            sourceCompany: '',
            invitationCode: '',
        },
        sourceCompanyList: []
    },
    mutations: {
        setRegisterInfo(state, info) {
            state.registerInfo = info;
        },
        saveRegstData(state, info) {
            state.RegstData = info;
        },
        [GET_SOURCE_COMPANY_LIST](state, sourceCompanyList) {
            state.sourceCompanyList = sourceCompanyList;
        }
    },
    getters: {
        registerInfo: state => state.registerInfo,
        sourceCompanyList: state => state.sourceCompanyList,
        RegstData: state => state.RegstData
    },
    actions: {
        saveRegstData({ commit }, data) {
            commit('saveRegstData', data)
        },
        setregisterInfo({ commit }, info) {
            commit('setRegisterInfo', info)
        },
        checkPhone({ commit }, phone) {
            if (/^(13|14|15|16|17|18|19)\d{9}$/.test(phone)) {
                return checkPhone(phone);
            }
            toast('请输入正确的手机号码！');
        },
        async getCode({ commit }, phoneNumber) {
            let data = {
                phoneNumber: phoneNumber,
                functionType: 0
            }
            let { success } = await getCode(data);
            success && toast('验证码已发送');
        },
        async queryCompanyList({ commit, getters }) {
            if (getters.sourceCompanyList.length) return;
            let { success, obj } = await getSourceCompany();
            success && commit(GET_SOURCE_COMPANY_LIST, obj);
        },
        async register({ commit, getters, dispatch }, { sourceCompany = '', invitationCode = null } = {}) {
            console.log(getters.registerInfo)
            let password = md5(md5('WeB' + getters.registerInfo.password));
            let { success, message, exceptionCode } = await register({...pick(getters.registerInfo, ['mobile', 'authCode', 'userType']), password, sourceCompany, invitationCode });
            if (success) {
                await toast(message);
                commit(`login/${GET_ACCOUNT}`, getters.registerInfo.mobile, { root: true });
                commit(`login/${GET_PASSWORD}`, getters.registerInfo.password, { root: true });
                await dispatch('login/login', {}, { root: true });

                // 账号初次登录
                localStorage.setItem('firstLogin', 1)
                router.push('/');
            } else {
                if (exceptionCode == 10010040) {
                    toast('未配相应套餐，请联系客服开通！');
                    router.push('/cumstomer');
                    return false
                }
                toast(message);
            }
        },
        async resetpw({ commit, getters }) {
            console.log(getters.registerInfo)
            let password = md5(md5('WeB' + getters.registerInfo.password));
            let { success, message } = await resetpw({
                newPassword: password,
                ...pick(getters.registerInfo, ['mobile', 'authCode'])
            });

            if (success) {
                commit(`common/${SET_USER_INFO}`, '', { root: true });
                commit(`common/${SET_TOKEN}`, '', { root: true });
                await toast(message);
                router.push('/login');
            } else {
                toast(message);
            }
        }
    }
};