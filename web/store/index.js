export const state = () => ({
  site: {},
  contact: {},
  log: [],
  logFilter: '',
  backgroundColor: 'yellow'
})

export const getters = {
  site(state) {
    return state.site
  },
  contact(state) {
    return state.contact
  },
  log(state) {
    return state.log
  },
  logFilter(state) {
    return state.logFilter
  },
  backgroundColor(state) {
    return state.backgroundColor
  }
}

export const mutations = {
  site(state, content) {
    state.site = content
  },
  contact(state, content) {
    state.contact = content
  },
  log(state, content) {
    state.log = content
  },
  logFilter(state, content) {
    state.logFilter = content
  },
  backgroundColor(state, content) {
    state.backgroundColor = content
  }
}
