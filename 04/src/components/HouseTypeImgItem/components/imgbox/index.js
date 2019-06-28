import Vue from 'vue';
import ImgBox from './imgbox';

const ImgBoxComponent = Vue.extend(ImgBox);

export default function(url) {
  let imgBoxVm = new ImgBoxComponent({ el: document.createElement('div') });
  imgBoxVm.imgUrl = url;
  document.body.appendChild(imgBoxVm.$el);
}
