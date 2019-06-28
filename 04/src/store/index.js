import Vue from 'vue';
import Vuex from 'Vuex';

import { state, mutations, actions } from './global';

import bottomMenu from './module/bottomMenu';
import home from './module/home';
import release from './module/release';
import user from './module/user';
import register from './module/register';
import login from './module/login';
import common from './module/common';
import design from './module/design';
import tcdetail from './module/tcdetail';
import photoView from './module/photoView';
import area from './module/area';
import space from './module/space';
import areaDetail from './module/areaDetail';
import uploadHouseInfo from './module/uploadHouseInfo';
import fastDecorate from './module/fastDecorate';
import view720 from './module/view720';
import citySelector from './module/citySelector';
import search from './module/search';
import bank from './module/bank';
import caseDetail from './module/caseDetail';
import socket from './module/socket';
import recom from './module/recom';
import mycumser from './module/mycumser';
import rob from './module/rob';

Vue.use(Vuex);

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {
        bottomMenu,
        home,
        release,
        user,
        register,
        login,
        common,
        design,
        recom,
        tcdetail,
        photoView,
        area,
        space,
        areaDetail,
        uploadHouseInfo,
        fastDecorate,
        view720,
        citySelector,
        search,
        bank,
        caseDetail,
        socket,
        mycumser,
        rob
    }
});

export default store;