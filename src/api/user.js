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

export function logout() {
  return request({
    url: '/logout',
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
    data
  })
}

export function del(data) {
  return request({
    url: '/account/delete',
    method: 'post',
    data
  })
}

export function isExist(query) {
  return request({
    url: '/account/isExist',
    method: 'get',
    params: query
  })
}

export function resetPassword(data) {
  return request({
    url: '/account/resetPassword',
    method: 'post',
    data
  })
}

