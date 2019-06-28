import axios from 'axios'
import store from '@/store'
import baseUrlObj from '@/api/domain-name'


function fetch(base) {
    const instance = axios.create({ baseURL: baseUrlObj[base], timeout: 20000 })
    instance.interceptors.request.use((config) => { return config }, (error) => { return Promise.reject(error) })
    instance.interceptors.response.use((res) => { return res.data }, (error) => { return Promise.reject(error) })
    store.dispatch('showLoading', true)
    let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzaWduZmxhdCI6Im1pbmlfcHJvZ3JhbV91c2VyX3Rva2VuOiIsImV4dCI6MTU0ODQ4NDI2NDA1OCwidWlkIjozNjM0NywidW5hbWUiOiJDRFgiLCJ1dHlwZSI6OCwiYXBwS2V5IjoiN2JkNTI3MWI2YjIyNDQ2MzhmZmM2NmNiZDBjNjlkNjkiLCJzZXNzaW9uVGltZW91dCI6MjU5MjAwfQ._blkFB1BS221CsJsQChQe9QXbtcNruJgV3J-WboDnuE'
    return {
        get(url, params) {
            let data = {
                method: 'get',
                url,
                params,
                headers: {
                    'Authorization': store.state.main.token || token,
                    'Content-Type': 'application/json',
                    'Platform-Code': 'miniProgram',
                    'Custom-Referer': store.state.main.referer || 'https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html'
                }
            }
            return instance(data).then(res => { store.dispatch('showLoading', false); return res })
        },
        post(url, data) {
            let params = {
                method: 'post',
                url,
                data,
                headers: {
                    'Authorization': store.state.main.token || token,
                    'Content-Type': 'application/json',
                    'Platform-Code': 'miniProgram',
                    'Custom-Referer': store.state.main.referer || 'https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html'
                }
            }
            return instance(params).then(res => { store.dispatch('showLoading', false); return res })
        },
        formData(url, data) {
            let params = {
                method: 'post',
                url,
                data,
                headers: {
                    'Authorization': store.state.main.token || token,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Platform-Code': 'miniProgram',
                    'Custom-Referer': store.state.main.referer || 'https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html'
                },
                transformRequest: [function(data) {
                    let ret = ''
                    for (let key in data) { ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&' }
                    return ret
                }]
            }
            return instance(params).then(res => { store.dispatch('showLoading', false); return res })
        }
    }
}

export default fetch
