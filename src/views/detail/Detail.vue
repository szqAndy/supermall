<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick"
                    ref="nav" />
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <!--<ul>-->
        <!--<li v-for="item in $store.state.cartList">{{item}}</li>-->
      <!--</ul>-->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommend"/>
    </scroll>
    <detail-button-bar @addCart="addToCart" />
    <back-tab @click.native="backClick" v-show="isShowBackTab"/>
    <!--<toast :message="message" :show="show" />-->
  </div>
</template>

<script>

  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DtailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailButtonBar from "./childComps/DetailButtonBar";
  // import Toast from 'components/common/toast/Toast'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail, Goods, getRecommend, Shop, GoodsParam} from "network/detail";
  import {debounce} from 'common/utils'
  import {itemListenterMixin, backTopMixin} from "common/mixin";

  import { mapActions }from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailButtonBar,
      GoodsList,
      DetailCommentInfo,
      DetailParamInfo,
      DetailGoodsInfo,
      Scroll,
      DetailShopInfo,
      DetailBaseInfo,
      DetailSwiper,
      DetailNavBar,
      // Toast
    },
    mixins: [itemListenterMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommend: [],
        themeTopYs: [],
        getThemeTopY: [],
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid


      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // console.log(res);
        // 0.获取数据
        const data = res.result
        // 1.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        // 6.取出评论的信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]

        }
        // console.log(this.commentInfo);

        // 第一次获取值
        // 值不对的原因：this.$refs.params.$el压根没渲染
        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs);

        // this.$nextTick()下一步
        // this.$nextTick(() => {
        //   // 第二次获取：值不对
        //   // 根据最新的数据，对应的DOM是已经被渲染出来
        //   // 但是图片依然是没有加载完的（目前获取的offsetTop是不包括其中的图片的）
        //   // offsetTop值不对的问题，都是因为图片的问题
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //   console.log(this.themeTopYs);
        // })
      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommend = res.data.list
      })

      // 给4.getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE) // 最大值
        console.log(this.themeTopYs);
      },100)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        // this.$refs.scroll.refresh()
        this.refresh()
        this.getThemeTopY()
        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs);

      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index],100)
      },
      contentScroll(position) {
        // console.log(position);
        // 1.获取y的值
        const positionY = -position.y

        // 2.positionY和主题的值对比
        // [0, 7938, 9120, 9452]
        // positionY 在 0 和 7938 之间， index = 0
        // positionY 在 7938 和 9120 之间， index = 1
        // positionY 在 9120 和 9452 之间， index = 2
        // positionY 超过 9452 时， index = 3
        let length = this.themeTopYs.length
        for (let i = 0; i < length-1; i++) {
          // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
          //   console.log(i);
          // }
          // 方法一：普通做法
          // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i]
          //   && positionY < this.themeTopYs[i+1]) ||
          //   (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i
          //   // console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }

          // 方法二：hack做法
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
              this.currentIndex = i
              // console.log(this.currentIndex);
              this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        // 3. 是否显示回到顶部
        this.listenShowBackTop(position)
      },
      addToCart() {
        // 1. 获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.newPrice = this.goods.realPrice
        product.iid = this.iid

        // 2. 将商品加入购物车(1. Promise 2. mapActions)
        // this.$store.cartList.push(product)
        // this.$store.commit('addCart', product)
        this.addCart(product).then(res => {
          // console.log(res);
          // this.show = true
          // this.message = res
          //
          // setInterval(() => {
          //   this.show = false
          //   this.message = ''
          // }, 1500)
          this.$toast.show(res, 2000)
          console.log(this.$toast);
        })
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);
        // })
      }
    },
    mounted() {

    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListenter)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    height: 100vh;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>
