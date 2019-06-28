import { getallsupplydemandcategory } from 'api/home';
import { uploadImg, release, updateRelease } from 'api/release';
import { forEach, map, get, find, merge, clone } from 'lodash';
import router from 'router';
import toast from 'components/Toast';
const CLEAR_ALL_DATA = 'CLEAR_ALL_DATA';
const GET_UPLOAD_IMAGE = 'GET_UPLOAD_IMAGE';
const DELETE_IMAGE = 'DELETE_IMAGE';
const CLEAR_IMAGE_LIST = 'CLEAR_IMAGE_LIST';
const GET_INFO_TYPE_LIST = 'GET_INFO_TYPE_LIST';
const GET_EDIT_DATA = 'GET_EDIT_DATA';

const initAreaSeleced = {
    provinceName: '',
    cityName: '',
    districtName: '',
    streetName: ''
};

const initReleaseData = {
    type: 1, // 信息类别(1:供应，2:需求)
    supplyDemandCategoryId: '', // 类别
    province: '', // 省份编码
    city: '', // 城市编码
    district: '', // 区
    street: '', // 街道
    address: '', // 详细地址
    title: '', // 信息标题
    description: '', // 描述
    // contact: '', // 联系人
    // phone: '', // 手机号
    decorationCompany: 1, // 装修公司是否可见(0:否，1:是)
    designer: 1, // 设计师是否可见(0:否，1:是)
    materialShop: 1, // 建材门店是否可见(0:否，1:是)
    proprietor: 1, // 业主是否可见(0:否，1:是)
    builder: 1, // 施工单位是否可见(0:否，1:是)
    pushStatus: 0, // 信息状态 (0:上架中,1:已下架),

};

export default {
    namespaced: true,
    state: {
        uploadImageList: [],
        releaseInfoTypeList: [],
        areaSeleced: clone(initAreaSeleced),
        releaseData: clone(initReleaseData),
        from: 'home' // 判断用户是从哪里进入选择发布页面
    },
    mutations: {
        setFrom(state, data) {
            state.from = data
        },
        [CLEAR_ALL_DATA](state) {
            state.uploadImageList = [];
            state.areaSeleced = clone(initAreaSeleced);
            state.releaseData = clone(initReleaseData);
        },
        [GET_UPLOAD_IMAGE](state, { index, id, url = '' }) {
            state.uploadImageList.splice(index, 1, Object.assign(state.uploadImageList[index] || {}, (url ? { id, url } : { id })));
        },
        [DELETE_IMAGE](state, index) {
            state.uploadImageList.splice(index, 1);
        },
        [CLEAR_IMAGE_LIST](state) {
            state.uploadImageList = [];
        },
        [GET_INFO_TYPE_LIST](state, infoList) {
            let typeId = state.releaseData.supplyDemandCategoryId && get(state.releaseData.supplyDemandCategoryId.split(','), '1');
            state.releaseInfoTypeList = infoList.map((item, index) => typeId ? merge(item, { active: item.id == typeId }) : merge(item, { active: !index }));
        },
        [GET_EDIT_DATA](state, { resourceURL, editData }) {
            state.releaseData.type = editData.typeName == '供应' ? 1 : 2;
            state.releaseData.title = editData.title;
            state.releaseData.description = editData.description;
            // state.releaseData.contact = editData.contact;
            // state.releaseData.phone = editData.phone;
            state.releaseData.province = editData.province;
            state.releaseData.city = editData.city;
            state.releaseData.district = editData.district;
            state.releaseData.street = editData.street;
            state.releaseData.address = editData.address;
            state.releaseData.supplyDemandCategoryId = `${editData.supplyDemandCategoryId},${editData.supplyDemandSmallCategoryId}`;

            state.areaSeleced.provinceName = editData.provinceAddress;
            state.areaSeleced.cityName = editData.cityAddress;
            state.areaSeleced.districtName = editData.districtAddress;
            state.areaSeleced.streetName = editData.streetAddress;

            state.uploadImageList = map(editData.supplyDemandPicList, item => {
                return {
                    id: item.id,
                    url: resourceURL + item.picPath
                };
            });

            forEach([
                'decorationCompany',
                'designer',
                'materialShop',
                'proprietor',
                'builder'
            ], item => {
                state.releaseData[item] = editData[item];
            });
        }
    },
    getters: {
        uploadImageList: state => state.uploadImageList,
        areaSeleced: state => state.areaSeleced,
        releaseInfoTypeList: state => state.releaseInfoTypeList,
        releaseData: state => state.releaseData,
        from: state => state.from
    },
    actions: {
        setFrom({ commit }, data) {
            commit('setFrom', data)
        },
        clearReleaseData({ commit }) {
            commit(CLEAR_ALL_DATA);
        },
        setCurrentImg({ commit }, { index, url }) {
            commit(GET_UPLOAD_IMAGE, { index, url, id: '' });
        },
        deleteCurrentImg({ commit }, index) {
            console.warn('删除图片', index);
            commit(DELETE_IMAGE, index);
        },
        clearImgList({ commit }) {
            commit(DELETE_IMAGE);
        },
        async uploadImg({ commit }, { index, file, fileName = '' }) {
            let imgData = new FormData();
            forEach({
                file: file,
                platform: 'mobile2b',
                type: 'image',
                module: 'supplyDemand'
            }, (value, key) => {
                if (key === 'file' && fileName) { return imgData.append(key, value, fileName); };
                imgData.append(key, value);
            });

            let { obj, status, message } = await uploadImg(imgData);

            if (!status) { toast(message); return false; }

            commit(GET_UPLOAD_IMAGE, { index, url: URL.createObjectURL(file), id: get(obj, 'resId') });

            return true;
        },
        async queryInfoTypeList({ commit }, type) {
            let { obj } = await getallsupplydemandcategory({ type: 1 });
            let { supplyDemandCategoryVos } = find(get(obj, '0.supplyDemandCategoryVos'), { id: type });
            commit(GET_INFO_TYPE_LIST, supplyDemandCategoryVos);
        },
        async releaseInfo({ commit }, data) {
            let isEdit = !!get(data, 'id');
            let { status, message } = isEdit ? await updateRelease(data) : await release(data);
            status ? await toast('发布成功！') : '';
            status ? (isEdit ? router.push('/user/issue') : router.push('/')) : toast(message);
        },
        initEditData({ commit, rootGetters }) {
            let editData = sessionStorage.getItem('editRelease') && JSON.parse(sessionStorage.getItem('editRelease'));
            commit(GET_EDIT_DATA, { resourceURL: get(rootGetters, 'common/userInfo.resourcesUrl'), editData });
        }
    }
};