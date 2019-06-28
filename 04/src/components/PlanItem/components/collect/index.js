import Vue from 'vue';
import Collect from './index.vue';

const CollectComponent = Vue.extend(Collect);

function CollectService(collectList) {
  let collectVm = new CollectComponent({ el: document.createElement('div') });
  collectVm.collectList = collectList;
  document.body.appendChild(collectVm.$el);

  return {
    success(fn) {
      collectVm.$on('success', function(fid) {
        fn && fn(fid, collectVm);
      });
    }
  };
}

export default CollectService;
