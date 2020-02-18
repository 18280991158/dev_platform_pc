import request from '@/utils/request'
import qs from 'qs'

export function loadCurrUserMenu() {
  return request({
    url: '/menu/loadCurrUserMenu',
    method: 'get'
  })
}

export function list(query) {
  return request({
    url: '/menu/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/menu/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function refreshCache() {
  return request({
    url: '/menu/refreshCache',
    method: 'get'
  })
}

export function del(query) {
  return request({
    url: '/menu/delete',
    method: 'get',
    params: query
  })
}
