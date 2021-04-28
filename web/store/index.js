export const state = () => ({
  site: {},
  log: [],
  logFilter: ''
})

export const getters = {
  site(state) {
    return state.site
  },
  log(state) {
    return state.log
  },
  logFilter(state) {
    return state.logFilter
  }
}

export const mutations = {
  site(state, content) {
    state.site = content
  },
  log(state, content) {
    state.log = content
  },
  logFilter(state, content) {
    state.logFilter = content
  }
}
