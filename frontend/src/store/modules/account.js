const state = {
  user: {
    signedIn: false,
    Name: null,
    Email: null,
    Image: null,
  },
}

const getters = {
  getInfo: state => state.user,
}

const mutations = {
  setInfo (state, data) {
    state.user = data
  },
}

const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
