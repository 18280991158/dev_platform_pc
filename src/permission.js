import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasRoles = store.getters.roles && store.getters.roles.length > 0
  if (hasRoles) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
      return
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      try {
        await store.dispatch('user/getInfo')
        // generate accessible routes map based on roles
        let accessRoutes = null
        await store.dispatch('permission/generateRoutes').then(res => {
          accessRoutes = res
        })
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        next({ ...to, replace: true })
        NProgress.done()
      } catch (error) {
        console.info(error)
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
