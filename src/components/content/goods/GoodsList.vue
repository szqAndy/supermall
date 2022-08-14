<template>
  <div class="goods">
    <goods-list-itme v-for="item in goods" :goods-item="item"/>
  </div>
</template>

<script>
  import GoodsListItme from "./GoodsListItme";

  export default {
    name: "GoodsList",
    components: {GoodsListItme},
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }


</style>
