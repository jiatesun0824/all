import axios from 'axios';
import qs from 'qs';
import router from 'router';
import store from 'store';
import { omit, get as getValue, merge } from 'lodash';
import baseAPI from 'api/baseAPI';
import toast from 'components/Toast';

/**
 * baseURL 接口基础地址
 *  1.根据不同页面可能接口地址不同，作出了请求封装
 *  2.共用接口地址的话，就直接用defualt输出，使用即可
 * get方法
 *  @url  请求接口
 *  @data 请求数据
 *  @option 请求配置项，如header设置，
 *      token: false,设置为false,即请求不加token
 * post方法
 *  @url  请求接口
 *  @data 请求数据
 *  @option 请求配置项，如header设置，
 *      token: false,设置为false,即请求不加token
 */

function request(baseURL) {
    const service = axios.create({
        baseURL: baseURL,
        timeout: 20000
    });
    service.interceptors.request.use(config => {
        return config;
    });
    service.interceptors.response.use(async response => {
        if (response.data.message && response.data.message.indexOf('登录') > -1) {
            await toast('当前账号在其他设备登录，请重新登录！', 1500);
            store.dispatch('common/clearToken');
            router.push('/login');
        }
        return response.data;
    }, err => {
        // toast('系统出错，请重试！');
        return Promise.reject(err);
    });

    return {
        get(url, data, option) {
            let requestData = {
                method: 'get',
                url,
                params: data,
                ...omit(option, 'token')
            };

            if ((getValue(option, 'token') === undefined || getValue(option, 'token')) && store.state.common.token) {
                requestData = merge(requestData, {
                    headers: {
                        Authorization: store.state.common.token,
                        "Platform-Code": 'mobile2b'
                    }
                });
            }

            return service(requestData);
        },
        post(url, data, option) {
            let requestData = merge({
                method: 'post',
                url,
                data,
                headers: {
                    'Content-Type': 'application/json', // 'application/x-www-form-urlencoded'
                    'Platform-Code': 'mobile2b'
                },
                transformRequest: [
                    function(data) {
                        if (Object.prototype.toString.call(data).indexOf('FormData') > -1) {
                            return data;
                        }
                        return JSON.stringify(data);
                    }
                ]
            }, omit(option, 'token'));
            if ((getValue(option, 'token') === undefined || getValue(option, 'token')) && store.state.common.token) {
                requestData.headers['Authorization'] = store.state.common.token;
            }

            return service(requestData);
        },
        formPost(url, data, option) {
            let requestData = merge({
                method: 'post',
                url,
                data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: [
                    function(data) {
                        return qs.stringify(data);
                    }
                ]
            }, omit(option, 'token'));
            if ((getValue(option, 'token') === undefined || getValue(option, 'token')) && store.state.common.token) {
                requestData.headers['Authorization'] = store.state.common.token;
            }

            return service(requestData);
        }
    };
}

const loginService = request(baseAPI.loginURL);
const registerService = request(baseAPI.registerURL);
const baseService = request(baseAPI.baseURL);
const renderService = request(baseAPI.renderURL);
const tcService = request(baseAPI.serviceURL);
const advService = request(baseAPI.advURL);
const inviteService = request(baseAPI.inviteURL);
const payService = request(baseAPI.payURL);
const bannerService = request(baseAPI.bannerResourcURL);
const planService = request(baseAPI.planURL);
const ucService = request(baseAPI.ucURL);
const miniService = request(baseAPI.miniprogramUrl);
const tqService = request(baseAPI.tqLOcalurl);
const resourceURL = request(baseAPI.resourceURL);
const locPayurl = request(baseAPI.locPayurl);
const seekURL = request(baseAPI.seekURL);
const adminUrl = request(baseAPI.adminUrl);
const lsnURL = request(baseAPI.lsUrln);
export {
    loginService,
    registerService,
    baseService,
    renderService,
    tcService,
    advService,
    inviteService,
    payService,
    bannerService,
    planService,
    ucService,
    miniService,
    tqService,
    resourceURL,
    locPayurl,
    seekURL,
    lsnURL
};

export default request(baseAPI.roleURL);
