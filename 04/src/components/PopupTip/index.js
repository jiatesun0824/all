import Vue from 'vue';
import popupTip from './index.vue';

const PopupTipComponent = Vue.extend(popupTip);

export default function($el, { value }) {
  const PopupTipEle = new PopupTipComponent({ el: document.createElement('div') });

  Vue.nextTick(() => {
    $el.style.whiteSpace = 'normal';
    let contentHeight = $el.scrollHeight;
    $el.removeAttribute('style');

    if (contentHeight <= $el.offsetHeight) return;

    if ($el.hasClick) return;

    $el.hasClick = true;

    $el.addEventListener('click', function(e) {
      e.stopPropagation();
      if (e._constructed) return;
      let elRectInfo = this.getBoundingClientRect();
      PopupTipEle.content = value;
      document.body.appendChild(PopupTipEle.$el);
      setTimeout(() => {
        PopupTipEle.top = elRectInfo.top - PopupTipEle.$refs.tipContent.offsetHeight / 2;
        PopupTipEle.left = (elRectInfo.left + elRectInfo.width) / 2 - PopupTipEle.$refs.tipContent.offsetWidth / 2;
        PopupTipEle.show = true;
      });
    }, 0);
  });
}
