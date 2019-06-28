import Vue from 'vue'
import Toast from './toast'

const ToastComponent = Vue.extend(Toast)

function ToastService(msg, time) {
  let toastVM = new ToastComponent({ el: document.createElement('div') })

  toastVM.msg = msg

  if (time) toastVM.time = time

  document.body.appendChild(toastVM.$el)

  return new Promise(resolve => {
    setTimeout(() => { resolve(true) }, toastVM.time)
  })
}

export default ToastService
