<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li class="menu-item" v-for="(item,index) in goods" :key="index"
              :class="{current:currentIndex===index}" @click="clickMenuItem(index,$event)">
            <span class="text border-1px">
              <span class="icon" v-if="item.type>0" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li class="food-list food-list-hook" v-for="(good,index) in goods" :key="index" >
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item border-1px" v-for="(foodId, index) in good.foods" :key="index"
                  @click="clickFood(findFood(foodId), $event)">
                <div class="icon">
                  <img width="57" height="57" :src="findFood(foodId).icon">
                </div>
                <div class="content">
                  <h2 class="name">{{findFood(foodId).name}}</h2>
                  <p class="desc" v-show="findFood(foodId).description">{{findFood(foodId).description}}</p>
                  <div class="extra">
                    <span class="count">月售{{findFood(foodId).sellCount}}份</span>
                    <span>好评率{{findFood(foodId).rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{findFood(foodId).price}}</span>
                    <span class="old" v-show="findFood(foodId).oldPrice">￥{{findFood(foodId).oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="findFood(foodId)" :update-food-count="updateFoodCount"></cartcontrol>
                  </div>
                </div>
              </li> 
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :food-list="foodList" :min-price="seller.minPrice"
                :delivery-price="seller.deliveryPrice" :update-food-count="updateFoodCount"
                :clear-cart="clearCart" ref="shopcart"> </shopcart>
    </div>
    <food :food="selectFood" :update-food-count="updateFoodCount" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue' 
import axios from 'axios'
import BScroll from 'better-scroll'
import {mapState,mapMutations,mapGetter,mapActions, mapGetters} from 'vuex'
import store from '../store/index'
import cartcontrol from '../components/cartcontrol'
import shopcart from './goods/shopcart'
import food from './goods/food'

export default {
  props: {
    seller: Object
  },
  data() {
    return {
      goods:[],
      tops: [],
      scrollY: 0,
      selectFood: {}
    }
  },
  created() {
    this.$store.dispatch('getFoodsApi'),
    axios.get('/api2/goods').then((response) => {
      const result = response.data
      if (result.code === 0) {
        this.goods = result.data; 
        this.$nextTick(() => {
          this._initScroll()
          this._initTops()
        })
      }
    }),
    this.classMap = ["decrease", "discount",  "special", "guarantee", "invoice"]
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['updateFoodCount', 'clearCart']),
    ...mapActions(['getFoodsApi']),
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper,{
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
        click: true,
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _initTops() {
      const foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let top = 0;
      this.tops.push(top);
      for(let i=0; i<foodList.length;i++){
        let item = foodList[i];
        top += item.clientHeight;
        this.tops.push(top);
      }
    },
    clickMenuItem(index, event){
      if(!event._constructed) { //better-scroll派发的scroll事件
        return 
      }
      const foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      const el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300)
    },
    clickFood(food, event){
      if(!event._constructed){
        return 
      }
      this.selectFood = food;
      this.$refs.food.show(true); //指向food组件，food组件内的指向dom
    },
    findFood (id) {
      const index = this.foods.findIndex((ele) => {
        return ele.id === id
      })
      return this.foods[index]
    },
  },
  computed: {
    currentIndex() {
      return this.tops.findIndex((top, index)=>{
        return this.scrollY>=top && this.scrollY<this.tops[index+1]
      })
    },
    ...mapState(['foods']),
    ...mapGetters(['foodList'])
  },
  components: {
    cartcontrol,
    shopcart,
    food
  },
  store
}
</script>

<style lang="stylus" type="stylesheet/stylus">
@import "../assets/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
    .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px

</style>
