import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      images: [],
      name: "",
      file_name: "",
  },
  mutations: {
      set_images: (state,payload)=>{
          state.images=payload.images;
          state.name=payload.name;
          state.file_name=payload.file_name;
      }
  },
  actions: {
      // get_book_images: ({ commit, state }, params)=>{
      //     return new Promise((req,res)=>{
      //         Vue.prototype.axios.get('http://localhost:8089/book', {params: {s: params.s},withCredentials: true}).then(v=>{
      //             console.log('请求结果dd：',v);
      //             if(v.data.code ===202){
      //                 setTimeout(()=>this.get_book_images(s),2000)
      //                 return
      //             }
      //             if(v.data.code ===404){
      //                 req(v.data);
      //             }
      //             if(params.self.route.query.s !== params.s){
      //                 params.self.router.push({  query: { s: params.s }})
      //             }
      //             commit('set_images', {images: v.data.images, name: v.data.name});
      //             req(v.data);
      //
      //         }).catch((error)=>{
      //             console.log(error);
      //         });
      //     })
      // }
  },
  modules: {
  }
})
