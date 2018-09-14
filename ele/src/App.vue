<template>
  <div>
    <ele-header :seller="seller"></ele-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
import header from './views/header'

const OK = 0

export default {
  data() {
    return {
      seller: {}
    }
  },
  created() {
    axios.get('/api2/seller').then((response) => {
      const result = response.data
      if (result.code === OK) {
        this.seller = result.data
      }
    })
  },
  components: {
    'ele-header': header
  }
}
</script>

<style lang="stylus" type="stylesheet/stylus">
@import './assets/stylus/mixins.styl'

.tab
  display flex
  width 100%
  height 40px
  line-height 40px
  border-1px(rgba(7,17,27,.1))
  .tab-item
    flex 1
    text-align center
    & > a
      display block
      font-size 14px
      color rgb(77,85,83)
      &.router-link-active
        color rgb(240,20,20)
</style>
