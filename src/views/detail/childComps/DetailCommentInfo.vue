<template>
  <div v-if="Object.keys(commentInfo).length !== 0" class="comment-info">
    <div class="info-header">
      <div class="header-title">用户评论</div>
      <div class="header-more">
        更多
        <i class="arrow-right"></i>
      </div>
    </div>
    <div class="info-user">
      <img :src="commentInfo.user.avatar" alt="">
      <span>{{commentInfo.user.uname}}</span>
    </div>

    <div class="info-detail">
      <p>{{commentInfo.content}}</p>
      <div class="info-other">
        <span class="data">{{commentInfo.created | showDate}}</span>
        <span>{{commentInfo.style}}</span>
      </div>
      <div class="info-imgs">
        <img :src="item" v-for="(item, index) in commentInfo.image" :key="index" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  // 导入封装好的时间转换函数
  import {formatDate} from "common/utils";

  export default {
    name: "DetailCommentInfo",
    props: {
      commentInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    filters: {
      showDate(value) {
        // 1.将时间戳转换为Date对象
        // const date = new Date(1535694719 * 1000)
        const date = new Date(value * 1000) //Date对象里面是毫秒； *1000转换为秒

        // 2.将date进行格式化
        /**
         * y：year年
         * M: Month月
         * d: day日
         * h: hours小时
         * m: minutes分钟
         * s: seconds秒钟
         * */
        return formatDate(date, 'yyyy-MM-dd')
      }
    }
  }
</script>

<style scoped>

</style>
