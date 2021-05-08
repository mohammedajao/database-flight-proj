const state =  {
  user: null,
  token: null
}

const getters = {
  user: (state) => {
    return state.user
  },
  token: (state) => {
    return state.token
  }
}
const mutations = {
  login(state, payload) {
    state.user = payload.user
    state.token = payload.token
  },
  logout(state) {
    state.user = null
    state.token = null
  }
}
const actions = {
  login(context, payload) {
    context.commit('login', payload)
  },
  logout(context) {
    context.commit('logout')
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
}
