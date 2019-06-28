/**
 * @param file 传入views页面文件
 * 生产环境将页面按需加载方式导入。
 */
module.exports.importComponent = file => () => import('components/' + file + '.vue');
module.exports.importView = file => () => import('views/' + file + '.vue');
