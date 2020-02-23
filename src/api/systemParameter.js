import request from '@/utils/request'
import qs from 'qs'

export function listPage(data) {
  return request({
    url: '/systemParameter/listPage',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function save(data) {
  return request({
    url: '/systemParameter/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function del(data) {
  return request({
    url: '/systemParameter/delete',
    method: 'post',
    data
  })
}

export function isExist(query) {
  return request({
    url: '/systemParameter/isExist',
    method: 'get',
    params: query
  })
}

export function getParamValue(query) {
  return request({
    url: '/systemParameter/getParamValue',
    method: 'get',
    params: query
  })
}

export function refreshCache() {
  return request({
    url: '/systemParameter/refreshCache',
    method: 'get'
  })
}

