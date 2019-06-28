import request from 'utils/request'

export let age = 1

export function good() {
  return request.post('xx', { test: 1 })
}
