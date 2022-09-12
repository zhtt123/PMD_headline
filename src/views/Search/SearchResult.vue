<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <ArticleItem
          v-for="article in articleList"
          :key="article.art_id"
          :article="article"
          :isShow="false"
          @click.native="$router.push(`/article_detail/${article.art_id}`)"
        ></ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { getResultListAPI } from '@/api'
import ArticleItem from '../../components/ArticleItem.vue'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1,
      articleList: [],
      loading: false,
      finished: false
    }
  },
  components: { ArticleItem },
  async created () {
    this.getSearchResultFn()
  },
  methods: {
    onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        this.getSearchResultFn()
      }
    },
    async getSearchResultFn () {
      const result = await getResultListAPI({
        page: this.page,
        keywords: this.$route.params.keywords // 拿到关键词, keywords来源于router/index.js你定义的动态路由参数名
      })
      if (result.data.data.results.length === 0) {
        this.finished = true
        return
      }
      this.articleList = [...this.articleList, ...result.data.data.results]
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
/deep/ .van-nav-bar__content {
  background-color: #007bff;
}
/deep/ .van-nav-bar__title {
  color: #fff;
}
/deep/ .van-nav-bar__arrow {
  color: #fff;
}
</style>
