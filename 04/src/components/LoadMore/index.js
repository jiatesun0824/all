import Vue from 'vue';
import loadMore from './main';

const LoadMoreComponent = Vue.extend(loadMore);

const loadMoreEle = new LoadMoreComponent({ el: document.createElement('div') });

export default function(el, { value }) {
  loadMoreEle.$el.style.display = value ? 'block' : 'none';
  el.appendChild(loadMoreEle.$el);
}
