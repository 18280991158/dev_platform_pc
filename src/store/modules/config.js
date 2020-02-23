import { getParamValue } from '@/api/systemParameter'
const state = {
  fileServerUrl: null,
  systemName: null,
  logo: null
}

const mutations = {
  SET_FILE_SERVER_URL: (state, fileServerUrl) => {
    state.fileServerUrl = fileServerUrl
  },
  SET_SYSTEM_NAME: (state, systemName) => {
    state.systemName = systemName
  },
  SET_LOGO: (state, logo) => {
    state.logo = logo
  }
}

const actions = {
  setFileServerUrl({ commit }) {
    getParamValue({ paramKey: 'file:fileServer' }).then(res => {
      commit('SET_FILE_SERVER_URL', res.data)
    })
  },
  setSystemName({ commit }) {
    getParamValue({ paramKey: 'platform:systemName' }).then(res => {
      commit('SET_SYSTEM_NAME', res.data)
    })
  },
  setLogo({ commit }) {
    getParamValue({ paramKey: 'platform:systemLogo' }).then(res => {
      commit('SET_LOGO', res.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

