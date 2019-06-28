import Vue from 'vue';
import Loading from './loading';

const LoadingComponent = Vue.extend(Loading);

const loadingVm = new LoadingComponent({el: document.createElement('div')});

function LoadingService() {
  document.body.appendChild(loadingVm.$el);
}

LoadingService.close = function() {
  loadingVm.$el.parentNode && loadingVm.$el.parentNode.removeChild(loadingVm.$el);
};

export default LoadingService;
