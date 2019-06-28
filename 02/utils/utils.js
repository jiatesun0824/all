import {basePath} from './config.js'
const utils = {
  myForEach: (arr, callback) => { // forEach封装
    if (arr instanceof Array) {
      arr.forEach(callback)
    } else {
      return
    }
  },
  myFindIndex: (arr, callback) => { // 寻找对应的index
    let flag = -1
    utils.myForEach(arr, (value, index) => {
      if (callback(value)) {
        flag = index
        return
      }
    })
    return flag
  },
  mySplitUrl: (url) => { // 字符串裁切
    if (url.indexOf('?') === -1) {
      return
    } else {
      let index = url.indexOf('?')
      let newUrl = url.slice(index + 1).split('&')
      let urlObj = {}
      utils.myForEach(newUrl, (value) => {
        let index = value.indexOf('=')
        urlObj[value.slice(0, index)] = value.slice(index + 1)
      })
      urlObj.url = url.slice(0,index)
      return urlObj
    }
  },
  myCompoundUrl: (obj) => { // 把地址对象变为地址字符串
    if (!obj.url) {
      return ''
    } else {
      let url = obj.url + '?'
      for (var key in obj) {
        if (key !== 'url') {
         url += key + '=' + obj[key] + '&' 
        }
      }
      return url = url.slice(0,url.length - 1)   
    }
  },
  // rzd 190214 数据埋点封装 start
  sellingPoint: (API, event, nowPath, previousPath, pt) => {
    API.sellingPoint({
      uid: wx.getStorageSync('openId'),
      cp: nowPath,
      lp: previousPath,
      e: event ? event : '',
      pt: pt
    })
  },
  // ZB 190311 数据埋点封装 end
  myFindIndex: (arr, callBack) => {
    let flag = -1
    if (arr instanceof Array) {
      arr.forEach((value, index) => {
        if (callBack(value)) {
          flag = index
          return
        }
      })
      return flag
    } else {
      return false
    }
  },
  requestFn(params) {
    params.loading !== 'noLoading'? wx.showLoading({ title: '加载中' }) : null
    return new Promise((resolve, reject) => {
      wx.request({
        url: basePath[params.base] + params.url,
        data: params.params,
        method: params.type,
        header: {
          "Content-Type": params.contentType,
          'Authorization': wx.getStorageSync('token') || '',
          'Platform-Code': params.platformCode
        },
        success(res) {
          resolve(res.data)
          params.loading !== 'noLoading' ? wx.hideLoading() : null
        },
        fail(err) {
          reject(err)
          wx.hideLoading()
          params.loading !== 'noLoading' ? wx.showToast({ title: '加载失败', icon: 'none', duration: 2000 }) : null
        }
      })
    })
  },
  uploadFileFn(params) {
    wx.showLoading({ title: '加载中' })
    return new Promise((resolve, reject) => {
      let path = params.params.path
      delete params.params.path
      wx.uploadFile({
        url: basePath[params.base] + params.url,
        filePath: path,
        name: 'file',
        header: {
          'token': wx.getStorageSync('token'),
          "Content-Type": params.contentType,
          'Authorization': wx.getStorageSync('token') || '',
          'Platform-Code': params.platformCode
        },
        formData: params.params,
        success(res) {
          let data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data 
          resolve(data)
          wx.hideLoading()
        },
        fail(err) {
          reject(err)
          wx.hideLoading()
          wx.showToast({ title: '加载失败', icon: 'none', duration: 2000 })
        }
      })
    })
  },
  getNowTime(solt = '年月日') {
    let now = new Date()
    let year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate(), hours = now.getHours(), minutes = now.getMinutes(), second=now.getSeconds()
    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    return year + (solt[0] ? solt[0] : '') + month + (solt[1] ? solt[1] : '') + day + (solt[2] ? solt[2] : '') + ' ' + hours + ':' + minutes + ':' + second
  },
  /**时间转换 */
  changeTime(time) { // 转换时间
    let leadTime = new Date().getTime() - new Date(time.replace(/\-/g, '/')).getTime(),date;
    if (leadTime / 1000 / 60 < 1) {
      date = '刚刚';
    }
    if (leadTime / 1000 / 60 > 1 && leadTime / 1000 / 60 < 60) {
      date = (leadTime / 1000 / 60).toFixed(0) + '分钟前';
    }
    if (leadTime / 1000 / 3600 > 1 && leadTime / 1000 / 3600 < 59) {
      date = (leadTime / 1000 / 3600).toFixed(0) + '小时前';
    }
    if (leadTime / 1000 / 3600 / 24 > 1 && leadTime / 1000 / 3600 / 24 < 30) {
      date = (leadTime / 1000 / 3600 / 24).toFixed(0) + '天前';
    }
    if (leadTime / 1000 / 3600 / 24 > 30) {
      let leadTime2 = leadTime / 1000 / 3600 / 24 / 30;
      let month = Math.floor(leadTime2);
      date = `${month}个月前`
    }
   
    return date;
  },
}

module.exports = utils