export default {
  inserted(el) {
    const docHeight = document.documentElement.clientHeight;
    const bottomMenu = document.getElementsByClassName('BottomMenu__container');
    const bottomMenuHeight = bottomMenu.length && bottomMenu[0].clientHeight || 0;
    const emptyParentRectInfo = el.parentNode.getBoundingClientRect();
    el.style.height = (docHeight - bottomMenuHeight - emptyParentRectInfo.top) + 'px';
  }
}