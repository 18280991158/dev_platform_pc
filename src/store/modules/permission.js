import { constantRoutes } from '@/router'
import { loadCurrUserMenu } from '@/api/menu.js'
import components from '@/router/modules/components.js'

/* Layout */
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function convertMenu(accessedRoutes) {
  const routes = []
  let i = 0
  for (const route of accessedRoutes) {
    let menu = null
    if (i === 0) {
      menu = {
        path: '/',
        component: Layout,
        redirect: route.path,
        hidden: route.metaShow === '0',
        children: [
          {
            path: route.path,
            component: components[route.component],
            name: route.name,
            meta: { title: route.metaTitle, icon: route.icon, affix: true }
          }
        ]
      }
    } else {
      if (route.children === undefined) {
        menu = {
          path: route.path,
          component: Layout,
          hidden: route.metaShow === '0',
          children: [
            {
              path: 'index',
              component: components[route.component],
              name: route.name,
              meta: { title: route.metaTitle, icon: route.icon }
            }
          ]
        }
      } else {
        menu = {
          path: route.path,
          component: Layout,
          name: route.name,
          alwaysShow: true,
          hidden: route.metaShow === '0',
          meta: {
            title: route.metaTitle,
            icon: route.icon
          }
        }
        menu.children = []

        for (const _route of route.children) {
          const _menu = {
            path: _route.path,
            component: components[_route.component],
            name: _route.name,
            hidden: _route.metaShow === '0',
            meta: { title: _route.metaTitle }
          }
          if (_route.icon !== undefined) {
            _menu.meta.icon = _route.icon
          }
          menu.children.push(_menu)
        }
      }
    }
    routes.push(menu)
    i++
  }
  return routes
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      loadCurrUserMenu().then(res => {
        const accessedRoutes = convertMenu(res.data)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
