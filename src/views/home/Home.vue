<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control" v-show="isTabFiexd"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!--当需要监听一个组件的原生事件时，必须给对应的事件加上.native修饰符，才能进行监听-->
    <back-tab @click.native="backClick" v-show="isShowBackTab"/>
  </div>
</template>

<script>
  import RecommendView from "./childComps/RecommendView";
  import HomeSwiper from './childComps/HomeSwiper'
  import FeatureView from "./childComps/FeatureView";

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from  'components/common/scroll/Scroll'

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {debounce} from "common/utils";
  import {itemListenterMixin, backTopMixin} from "common/mixin";

  export default {
    name: "home",
    components: {
      GoodsList,
      TabControl,
      FeatureView,
      RecommendView,
      NavBar,
      HomeSwiper,
      Scroll
    },
    mixins: [itemListenterMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        taboffsetTop: 0,
        isTabFiexd: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    beforeDestroy() {
      // 关闭事件总线； 解决找不到refresh函数的报错
      this.$bus.$off()
    },

    activated() {
      // console.log('activated');
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 1.保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      // console.log('deactivated');

      // 2.取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListenter)
    },

    mounted() {


    },

    methods: {
      /**
       * 事件监听相关的方法
       * */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },

      contentScroll(position) {
        // console.log(position);
        // 1. 判断BackTop是否显示
        this.listenShowBackTop(position)

        // 2.决定tabControl是否吸顶（position: fixed）
        this.isTabFiexd = (-position.y) > this.taboffsetTop
      },

      loadMore() {
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)

        // // 解决异步请求图片时，造成可滚动的区域不精确时，将重新计算
        this.$refs.scroll.refresh()
      },

      // 吸顶效果：原来获取tabControl的offsetTop的值是不正确的，原因是因为图片是异步请求过来的，所有值是不算上的
      // 获取正确的值：监听HomeSwiper中img的加载完成，然后再发送事件到Home.vue。
      swiperImageLoad() {
        // 获取tabControl的offsetTop
        // 所有组件都有一个属性$el：用于获取组件中的元素
        this.taboffsetTop = this.$refs.tabControl2.$el.offsetTop
        // console.log(this.$refs.tabControl.$el.offsetTop);
      },

      /**
       * 网络请求相关的方法
       * */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },

      getHomeGoods(type) {
        const page = this.goods[type].page + 1  // 每次请求时页数+1
        getHomeGoods(type, page).then(res => {
          // console.log(res.data);
          this.goods[type].list.push(...res.data.list) // 保存请求过来的数据
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp() // 持续上拉加载
        })
      }

    }
  }
</script>

<style scoped>
  #home {
    position: relative;
    /*padding-top: 44px;*/
    height: 100vh;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /*在使用浏览器原生滚动时， 为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9999;*/
  }

  /*.tab-control {*/
    /*position: sticky; !*粘性定位，滚动到某个位置时停留*!*/
    /*top: 44px;*/
    /*z-index: 999;*/
  /*}*/

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
  }

  .tab-control {
    position: relative;
    z-index: 9999;
  }

  /*.content {*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 51px;*/
  /*}*/
</style>
