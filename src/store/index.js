import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.CBSLTkaar6S3UeNVGnZpXgHaHa?pid=ImgDet&rs=1',
    username: ''
  },
  getters: {
  },
  mutations: {
    GETUSERPHOTO (state, value) {
      state.userPhoto = value
    },
    GETUSERNAME (state, value) {
      state.username = value
    }
  },
  actions: {
  },
  modules: {
  }
})
