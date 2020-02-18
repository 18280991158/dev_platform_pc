import { getFileServer } from '@/api/config'
const state = {
  fileServerUrl: null
}

const mutations = {
  SET_FILE_SERVER_URL: (state, fileServerUrl) => {
    state.fileServerUrl = fileServerUrl
  }
}

const actions = {
  setFileServerUrl({ commit }) {
    getFileServer().then(res => {
      commit('SET_FILE_SERVER_URL', res.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

