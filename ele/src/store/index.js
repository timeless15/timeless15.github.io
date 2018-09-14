import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

axios.get

export default new Vuex.Store({
    state: {
			foods: []
    },
    mutations: {
			_initFood(state, allfood){
				allfood.forEach(food => {
					state.foods.push(food)
				})
			}
    },
    getters: {
			foodList(state) {
				const foods = [];
				state.foods.forEach(food => {
					if(food.count){
						foods.push(food)
					}
				})
				return foods;
			},
    }
})
