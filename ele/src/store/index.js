import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    foods: []
  },
  mutations: {
    _initFood (state, allfood) {
      allfood.forEach(food => {
        state.foods.push(food)
      })
    },
    updateFoodCount (state, payload) {
      if (!payload.event._constructed) {
        return
      }
      const index = state.foods.findIndex((ele) => {
        return ele.id === payload.id
      })
      const food = state.foods[index]
      if (payload.isAdd) {
        if (!food.count) {
          Vue.set(food, 'count', 1)
        } else {
          food.count++
        }
      } else {
        if (food.count) {
          food.count--
        }
      }
    },
    clearCart (state) {
      state.foods.forEach(food => {
        food.count = 0
      })
    }
  },
  getters: {
    foodList (state) {
      const foods = []
      state.foods.forEach(food => {
        if (food.count) {
          foods.push(food)
        }
      })
      return foods
    }
  },
  actions: {
    getFoodsApi ({commit}) {
      axios.get('/api2/foods').then((response) => {
        commit('_initFood', response.data.data)
      })
    }
  }
})
