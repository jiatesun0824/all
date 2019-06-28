import { uploadHouseInfo } from 'api/uploadHouseInfo';
import router from 'router';
import toast from 'components/Toast';

export default {
  namespaced: true,
  state: {

  },
  mutations: {

  },
  getters: {

  },
  actions: {
    async uploadHouseInfo({ commit }, data) {
      let { success } = await uploadHouseInfo(data);
      if (success) {
        await toast('户型上传成功！');
        router.back();
      }
    }
  }
};
