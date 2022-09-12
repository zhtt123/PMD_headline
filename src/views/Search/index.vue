<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-getFocus
        v-model.trim="keywords"
        @input="inputFn"
        @search="searchFn(keywords)"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list"  v-if="keywords.length !== 0">
      <div
        class="sugg-item"
        v-for="(suggest, index) in suggestList"
        :key="index"
        v-html="lightFn(suggest, keywords)"
        @click="suggestClickFn(suggest)"
      >
        {{ suggest }}
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(history, index) in historyList"
          :key="index"
          @click="historyClickFn(history)"
          >{{ history }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getSuggestListAPI } from '@/api'
import { getStorage, setStorage } from '@/utils/storage'
export default {
  name: 'Search',
  data () {
    return {
      keywords: '', // 搜索关键字
      timer: null,
      suggestList: [],
      historyList: JSON.parse(getStorage('HISTORY')) || []// 搜索历史
    }
  },
  methods: {
    inputFn () {
      clearTimeout(this.timer)
      if (this.keywords.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          const result = await getSuggestListAPI({ keywords: this.keywords })
          if (result.data.data.options[0] === null) {
            this.suggestList = []
          } else {
            this.suggestList = result.data.data.options
          }
        }, 300)
      }
    },
    // 转换高亮文字的方法,str 要被处理的字符串,target 要匹配关键字
    lightFn (suggest, keywords) {
      const reg = new RegExp(keywords, 'ig')
      return suggest.replace(reg, (match) => {
        // match是关键字匹配的值(尽量保持原样)
        return `<span style="color: red">${match}</span>`
      })
    },
    // 跳转到结果页面
    moveFn (key) {
      // 异步任务，好让历史记录先存储起来
      setTimeout(() => {
        this.$router.push({ path: `/search_result/${key}` })
      }, 0)
    },
    // 回车跳转到结果页
    searchFn (keywords) {
      if (keywords.length === 0) return
      this.historyList.push(keywords) // 保存搜索关键字
      this.moveFn(keywords)
    },
    // 点击联想建议跳转到结果页
    suggestClickFn (suggest) {
      this.historyList.push(suggest) // 保存搜索关键字
      this.moveFn(suggest)
    },
    // 点击历史记录跳转到结果页
    historyClickFn (history) {
      this.moveFn(history)
    },
    // 清空历史记录
    clearFn () {
      this.historyList = []
    }
  },
  watch: {
    historyList: {
      deep: true,
      handler () {
        // ES6新增语法，传入的数组如果有重复的元素就过滤掉，返回无重复的Set对象
        const setArr = new Set(this.historyList)
        // Set类对象 -> Array数组
        const arr = Array.from(setArr)
        setStorage('HISTORY', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
