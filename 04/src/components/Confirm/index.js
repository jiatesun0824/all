import Vue from 'vue'
import Comfirm from './comfirm'

const ComfirmComponent = Vue.extend(Comfirm)

function comfirmService(comfirmInfo) {
  let comfirmVM = new ComfirmComponent({ el: document.createElement('div') })

  comfirmVM.comfirmInfo = comfirmInfo

  document.body.appendChild(comfirmVM.$el)

  return {
    success(fn) {
      comfirmVM.$on('success', function() {
        fn && fn(comfirmVM)
      })
      return this
    },
    cancel(fn) {
      comfirmVM.$on('cancel', function() {
        fn && fn()
      })
      return this
    }
  }
}

export default comfirmService
