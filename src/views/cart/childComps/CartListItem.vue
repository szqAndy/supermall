<template>
  <div class="shop-item">
    <div class="item-selector">
      <!--@checkBtnClick="checkedChange" :value="itemInfo.checked"-->
      <checkButton :is-checked="itemInfo.checked" @click.native="checkClick" />
    </div>
    <div class="item-img">
      <img :src="itemInfo.image" alt="商品图片">
    </div>
    <div class="item-info">
      <div class="item-title">{{itemInfo.title}}</div>
      <div class="item-desc">{{itemInfo.desc}}</div>
      <div class="info-bottom">
        <div class="item-price left">￥{{itemInfo.newPrice}}</div>
        <div class="item-price right">x{{itemInfo.count}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  export default {
    name: "CartListItem",
    components: {CheckButton},
    props: {
      itemInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      checkClick() {
        this.itemInfo.checked = !this.itemInfo.checked
      }
    }
  }
</script>

<style scoped>
  .shop-item {
    width: 100%;
    display: flex;
    font-size: 0;
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }

  .item-selector {
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-title, .item-desc {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  
  .item-img {
    padding: 5px;
  }
  
  .item-img img {
    display: block;
    width: 80px;
    height: 100px;
    border-radius: 5px;
  }
  
  .item-info {
    position: relative;
    padding: 5px 10px;
    font-size: 17px;
    color: #333;
    overflow: hidden;
  }
  
  .item-info .item-desc {
    font-size: 14px;
    margin-top: 15px;
    color: #666;
  }

  .info-bottom {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    margin-top: 10px;
  }

  .info-bottom .item-price {
    color: orangered;
  }
</style>
