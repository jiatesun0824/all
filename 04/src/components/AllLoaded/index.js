import Vue from 'vue';
import allLoad from './index.vue';

const AllLoadComponent = Vue.extend(allLoad);

const AllLoadEle = new AllLoadComponent({ el: document.createElement('div') });

export default function(el, { value }) {
  AllLoadEle.$el.style.display = value ? 'block' : 'none';
  el.appendChild(AllLoadEle.$el);
}
