// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible'
import Vuex from 'vuex'
import store from '@/store'
import Situations from '@/utils/situations'
import AwesomePicker from 'vue-awesome-picker'
import baseUrlObj from '@/api/domain-name'
import '@/css/base.scss'
import Toast from '@/utils/toast'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// import Vconsole from 'vconsole' // 调试工具
// const vconsole = new Vconsole()
Vue.prototype.baseUrl = baseUrlObj;
Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(AwesomePicker)
Vue.use(Toast);
Situations.setVuePrototype(Vue)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    store
})
