import 'utils/Blob';
import 'babel-polyfill';
import 'assets/js/flexible';
import 'utils/fastclick';

import Vue from 'vue';
import customService from 'components';
import App from './App';
import router from './router';
import store from './store';
import api from 'api/api.js';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
// import VueTouch from 'vue-touch';
import VueLazyload from 'vue-lazyload';
import { Tab, TabItem, Toast, ToastPlugin } from 'vux';
import baseApi from 'api/baseAPI';
import AwesomePicker from 'vue-awesome-picker';
import VConsole from 'vconsole';
import VueCordova from 'vue-cordova'

import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
import $jq from 'jquery';

const timer = setInterval(() => {
    if (store.state.common.token) {
        Vue.use(VueSocketio, socketio(`${process.env.BUILD_SOCKET}?userSessionId=${(JSON.parse(localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).sessionId : '')}&appId=1`), store);
        clearInterval(timer)
    }
}, 500)

if (process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'ci') {
    new VConsole();
}

Vue.config.productionTip = false;

// 移动端点击300ms处理
// FastClick.attach(document.body);
Vue.use(VueCordova);
Vue.cordova.on('deviceready', () => {
    console.log('Cordova : device is ready !');
});


Vue.use(AwesomePicker);
Vue.use(VueAwesomeSwiper);
Vue.use(customService);

// Vue.use(VueTouch, {
//   name: 'v-touch'
// });

Vue.use(VueLazyload, {
    error: require('assets/images/no_img.jpg'), // 请求失败后显示的图片
    loading: require('assets/images/no_img.jpg'), // 加载的loading过渡效果
    try: 10 // 这个是加载图片数量
});

Vue.component('toast', Toast);
Vue.use(ToastPlugin);
// vuxui顶部导航栏
Vue.component('tab', Tab);
Vue.component('tab-item', TabItem);
Vue.prototype.API = api;
Vue.prototype.$JQ = $jq;
Vue.prototype.resourceURL = baseApi.resourceURL;
Vue.prototype.view720BaseUrl = baseApi.view720BaseUrl;

// let app = Vue.extend(App);
Vue.filter('filterImg', function(value) { // 全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
    if (value) {
        return baseApi.resourceURL + value;
    }
});

Vue.filter('urlFilter', function(value) { // 全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
    if (value) {
        return baseApi.resourceURL + value;
    } else {
        return baseApi.serviceURL + '/default/list_def_detail.png';
    }
});

Vue.filter('logoFilter', function(value) { // 全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
    if (value) {
        return baseApi.resourceURL + value;
    } else {
        return baseApi.serviceURL + '/default/list_def_logo.png';
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store,
    components: {
        App
    },
    // watch: {
    //   '$route': 'checkLogin'
    // },
    // created() {
    //   this.checkLogin();
    // },
    methods: {
        // checkLogin() {
        //   // 检查是否登录
        //   if (localStorage.getItem('isLogined') && localStorage.getItem('isLogined') === '1') {
        //     console.log('已登录');
        //   }
        // }
    }
});