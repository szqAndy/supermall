// 混入
import {debounce} from "./utils";
import BackTab from "components/content/backTab/BackTab";

export const itemListenterMixin = {
  data() {
    return {
      itemImgListenter: null,
      refresh: null
    }
  },
  mounted() {
    // 给防抖动函数传入值
   this.refresh =  debounce(this.$refs.scroll.refresh, 500)

    // 对监听的事件进行保存
    this.itemImgListenter = () => {
      // this.scroll && this.$refs.scroll.refresh()
      this.refresh()
    }

    // 3.监听item中图片加载完成（事件总线（接收完成图片加载事件））注：on前面要加上$
    this.$bus.$on('itemImageLoad', this.itemImgListenter)
    // console.log('我是混入的');
  }
}

export const backTopMixin = {
  components: {
    BackTab
  },
  data() {
    return {
      isShowBackTab: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenShowBackTop(position) {
      // 是否显示回到顶部
      this.isShowBackTab = (-position.y) > 1000
    }
  }
}
