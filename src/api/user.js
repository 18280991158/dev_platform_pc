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

export function editMyPassword(query) {
  return request({
    url: '/account/editMyPassword',
    method: 'get',
    params: query
  })
}

export function editMyAvatar(query) {
  return request({
    url: '/account/editMyAvatar',
    method: 'get',
    params: query
  })
}

export function editMyInfo(data) {
  return request({
    url: '/account/editMyInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function listUserRoles() {
  return request({
    url: '/listUserRoles',
    method: 'get'
  })
}

export function getCurrRole() {
  return request({
    url: '/getCurrRole',
    method: 'get'
  })
}

export function getCurrRoleInfo() {
  return request({
    url: '/getCurrRoleInfo',
    method: 'get'
  })
}

export function setCurrRole(query) {
  return request({
    url: '/setCurrRole',
    method: 'get',
    params: query
  })
}

