<template>
  <div v-if="Object.keys(detailInfo).length !== 0" class="goods-info">
    <div class="info-desc clear-fix">
      <div class="start"></div>
      <div class="desc">{{detailInfo.desc}}</div>
      <div class="end"></div>
    </div>
    <div class="info-key">{{detailInfo.detailImage[0].key}}</div>
    <div class="info-list">
      <img v-for="(item,index) in detailInfo.detailImage[0].list"
           :key="index"
           :src="item"
           @load="imgLoad"
           alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: "DetailGoodsInfo",
    props: {
      detailInfo: {
        type: Object
      }
    },
    data() {
      return {
        counter: 0,
        imageLength: 0
      }
    },
    methods: {
      imgLoad() {
        if (++this.counter === this.imageLength) {
          this.$emit('imageLoad')
        }
      },
    },
    watch: {
      detailInfo() {
        this.imageLength = this.detailInfo.detailImage[0].list.length
      }
    }
  }
</script>

<style scoped>

  .goods-info {
    padding: 0 10px;
  }

  .start,
  .end{
    position: relative;
    width: 30%;
    height: 2px;
    background-color: #c0c0c0;
    margin: 15px 0;
  }

  .start::after,
  .end::after {
    position: absolute;
    content: '';
    width: 5px;
    height: 5px;
    background-color: #000;
  }

  .start::after{
    bottom: 0;
    left: 0;
  }

  .end {
    float: right;
  }

  .end::after {
    bottom: 0;
    right: 0;
  }

  .desc {
    font-size: 14px;
  }

  .info-key {
    margin-bottom: 30px;
    color: #333;
  }

  .info-list img {
  width: 100%;
}
</style>
