import Vue from 'vue';
import { forEach } from 'lodash';

import BaseTab from 'components/BaseTab';
import CancelCollect from 'components/CancelCollect';
import Confirm from 'components/Confirm';
import CrossWise from 'components/CrossWise';
import Favorites from 'components/Favorites';
import LoadFail from 'components/LoadFail';
import Loading from 'components/Loading/index.vue';
import LoadMore from 'components/LoadMore/index.vue';
import Popup from 'components/Popup';
import Scroll from 'components/Scroll';
import robPay from 'components/robPay';
import robPayFail from 'components/robPayFail';
import Call from 'components/Call';
import Selarea from 'components/Selarea';
import Toast from 'components/Toast';
import BottomMenu from 'components/BottomMenu';
import Empty from 'components/Empty';
import DispatchTit from 'components/DispatchTit';
import limitAlert from 'components/limitAlert';
import sktSuc from 'components/sktSuc';
import cardPoster from 'components/cardPoster';

import LoadMoreDirective from 'components/LoadMore/index.js';
import AllLoadedDirective from 'components/AllLoaded/index.js';
import PopupTipDirective from 'components/PopupTip/index.js';

import ConfirmService from 'components/Confirm/index.js';
import ToastService from 'components/Toast/index.js';
import LoadingService from 'components/Loading/index.js';

[
    BaseTab,
    CancelCollect,
    Confirm,
    CrossWise,
    Favorites,
    LoadFail,
    Loading,
    LoadMore,
    Popup,
    Scroll,
    robPay,
    Call,
    robPayFail,
    Selarea,
    Toast,
    BottomMenu,
    Empty,
    DispatchTit,
    limitAlert,
    sktSuc,
    cardPoster
].forEach(item => {
    item.name && Vue.component(item.name, item);
});

forEach({
    LoadMore: LoadMoreDirective,
    AllLoaded: AllLoadedDirective,
    PopupTip: PopupTipDirective
}, (item, key) => {
    Vue.directive(key, item);
});

export default {
    install(Vue) {
        Vue.confirm = Vue.prototype.$confirm = ConfirmService;
        Vue.toast = Vue.prototype.$toast = ToastService;
        Vue.loading = Vue.prototype.$loading = LoadingService;
    }
};