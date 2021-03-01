export const state = () => ({
  site: {
    overlayActive: false
  }
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
