
import store from '../store/index'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${store.getters.systemName}`
  }
  return `${store.getters.systemName}`
}
