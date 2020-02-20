import request from '@/utils/request'
import qs from 'qs'

export function save(data) {
  return request({
    url: '/resource/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function list(data) {
  return request({
    url: '/resource/list',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function del(data) {
  return request({
    url: '/resource/del',
    method: 'post',
    data
  })
}

export function isExist(data) {
  return request({
    url: '/resource/isExist',
    method: 'post',
    data
  })
}

