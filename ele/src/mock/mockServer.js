import Mock from 'mockjs'
import apiData from './data.json'

Mock.mock('/api2/seller', {
  code: 0,
  data: apiData.seller
})
Mock.mock('/api2/goods', {
  code: 0,
  data: apiData.goods
})
Mock.mock('/api2/foods', {
  code: 0,
  data: apiData.foods
})
Mock.mock('/api2/ratings', {
  code: 0,
  data: apiData.ratings
})
