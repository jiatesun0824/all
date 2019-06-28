/**
 * @param file 传入views页面文件
 * 开发环境直接使用打包到一个文件。
 */
module.exports.importComponent = file => require('components/' + file + '.vue');
module.exports.importView = file => require('views/' + file + '.vue');
