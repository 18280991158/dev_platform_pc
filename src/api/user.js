import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo() {
  return request({
    url: '/getUserInfo',
    method: 'get'
  })
}

export function listPage(data) {
  return request({
    url: '/account/listPage',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function save(data) {
  return request({
    url: '/account/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function del(query) {
  return request({
    url: '/account/delete',
    method: 'get',
    params: query
  })
}

export function isExist(query) {
  return request({
    url: '/account/isExist',
    method: 'get',
    params: query
  })
}
