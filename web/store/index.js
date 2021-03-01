export const state = () => ({
  site: {}
})

export const getters = {
  site(state) {
    return state.site
  }
}

export const mutations = {
  site(state, content) {
    state.site = content
  }
}
