import { login, logout, getInfo, listUserRoles, getCurrRoleInfo } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  id: null,
  name: '',
  avatar: '',
  roles: [],
  currRole: null
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_CURR_ROLE: (state, currRole) => {
    state.currRole = currRole
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.code !== 200) {
          reject(response.msg)
        } else {
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        const { name, avatar } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ID', data.id)

        listUserRoles().then(res => {
          commit('SET_ROLES', res.data)
        })
        getCurrRoleInfo().then(res => {
          commit('SET_CURR_ROLE', res.data)
        })

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_ROLES', [])
        commit('SET_ID', null)
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
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
