<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{$store.getters.cartLength}})</div>
    </nav-bar>

    <!--商品列表-->
    <cart-list/>

    <!--底部汇总-->
    <cart-buttom-bar/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";

  // getters解构，mapGetters是vuex内部的辅助函数，作用：将store中的getters映射到局部计算属性
  import { mapGetters } from 'vuex'
  import CartButtomBar from "./childComps/CartButtomBar";

  export default {
    name: "Cart",
    components: {CartButtomBar, CartList, NavBar},
    computed: {
      // ...mapGetters

      // 两种写法
      ...mapGetters(['cartLength'])
      // ...mapGetters({ length: cartLength, list: cartList})
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
