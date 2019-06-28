import baseUrlObj from '@/api/domain-name'
import API from '@/api/api'
import storage from 'good-storage'

class Situation {
  setVuePrototype (vue) {
    vue.prototype.resourceURL = baseUrlObj.resourceURL
    vue.prototype.recommendCaseRouterUrl = baseUrlObj.recommendCaseRouterUrl
    vue.prototype.API = API
    vue.prototype.errorLoadingImg = (event) => { event.target.src = '/static/images/goods_pic_no.png' }
  }

  setVuexStorage (key, state) {
    return storage.session.get(key) ? state : storage.session.set(key, state)
  }
}

export default new Situation()
