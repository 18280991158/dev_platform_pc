import Vue from 'vue'
import store from './store'
import { Notification } from 'element-ui'

import '@fortawesome/fontawesome-free/css/all.css'

store.dispatch('config/setFileServerUrl')
store.dispatch('config/setLogo')

import { listCache } from '@/api/dictionaryItem'
Vue.prototype.$listDictionaryItem = listCache

import Dictionary from '@/components/Dictionary'
Vue.component('Dictionary', Dictionary) // 初始化组件

Vue.prototype.$CheckSelection = (isMultipleChoice, multipleSelection) => {
  if (multipleSelection.length === 0) {
    Notification.warning({ title: '警告', message: '请至少选中一项' })
    return false
  }
  if (!isMultipleChoice) {
    if (multipleSelection.length > 1) {
      Notification.warning({ title: '警告', message: '只能选择一项数据' })
      return false
    }
  }
  return true
}
