import request from '@/utils/request'
import qs from 'qs'

export function listPage(data) {
  return request({
    url: '/dictionaryDirectory/listPage',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function save(data) {
  return request({
    url: '/dictionaryDirectory/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function del(data) {
  return request({
    url: '/dictionaryDirectory/delete',
    method: 'post',
    data
  })
}

export function refreshCache() {
  return request({
    url: '/dictionaryDirectory/refreshCache',
    method: 'get'
  })
}

export function isExist(query) {
  return request({
    url: '/dictionaryDirectory/isExist',
    method: 'get',
    params: query
  })
}

