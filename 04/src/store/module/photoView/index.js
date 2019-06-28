import { queryPlanGallery, queryDesignGallery } from 'api/photoView';
import { forEach } from 'lodash';

const GET_GALLERY_LIST = 'GET_GALLERY_LIST';

export default {
    namespaced: true,
    state: {
        galleryList: ''
    },
    mutations: {
        [GET_GALLERY_LIST](state, data) {
            state.galleryList = forEach(data, (item, index) => { item.active = !index; });
        }
    },
    getters: {
        galleryList: state => state.galleryList
    },
    actions: {
        async queryGalleryList({ commit }, { page, id }) {
            if (page === 'plan') {
                let { datalist } = await queryPlanGallery({
                    planRecommendedId: id,
                    remark: 'photo'
                });
                return commit(GET_GALLERY_LIST, datalist);
            } else {
                let { datalist } = await queryDesignGallery({
                    id: id,
                    remark: 'photo'
                });
                return commit(GET_GALLERY_LIST, datalist);
            }
        }
    }
};