import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      images: [],
      name: ""
  },
  mutations: {
      set_images: (state,payload)=>{
          state.images=payload.images;
          state.name=payload.name;
      }
  },
  actions: {

  },
  modules: {
  }
})
