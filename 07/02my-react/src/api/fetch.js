import axios from 'axios'
import storage from 'good-storage'
// import store from '@/store'
import baseUrlObj from './domain-name'

function fetch (base) {
  const instance = axios.create({ baseURL: baseUrlObj[base], timeout: 20000 })
  instance.interceptors.request.use((config) => { return config }, (error) => { return Promise.reject(error) })
  instance.interceptors.response.use((res) => { return res.data }, (error) => { return Promise.reject(error) })
  // store.dispatch('setLoadingShow', 1)
  return {
    get (url, params) {
      let data = {
        method: 'get',
        url,
        params,
        headers: {
          'Authorization': storage.session.get('token') || '',
          'Content-Type': 'application/json',
          'Platform-Code': storage.session.get('platformNewCode') || 'miniProgram',
          'Platform-New-Code': storage.session.get('platformNewCode') || '',
          'Custom-Referer': storage.session.get('customReferer') || 'https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html'
        }
      }
      return instance(data).then(res => {  return res })
    },
    post (url, data) {
      let params = {
        method: 'post',
        url,
        data,
        headers: {
          Authorization: storage.session.get('') || '',
          'Content-Type': 'application/json',
          'Platform-Code': storage.session.get('platformNewCode') || '',
          'Platform-New-Code': storage.session.get('platformNewCode') || '',
          'Custom-Referer': storage.session.get('customReferer') || ''
        }
      }
      return instance(params).then(res => { return res })
    },
    formData (url, data) {
      let params = {
        method: 'post',
        url,
        data,
        headers: {
          Authorization: storage.session.get('token') || '',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Platform-Code': storage.session.get('platformNewCode') || '',
          'Platform-New-Code': storage.session.get('platformNewCode') || '',
          'Custom-Referer': storage.session.get('customReferer') || ''
        },
        transformRequest: [function (data) {
          let ret = ''
          for (let key in data) { ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&' }
          return ret
        }]
      }
      return instance(params).then(res => { return res })
    }
  }
}

export default fetch
