<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
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
          @dislikeFn="dislikeFn"
          @reportFn="reportFn"
          @click.native="$router.push(`/article_detail/${article.art_id}`)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import { getAllArticleListAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
import Notify from '@/utils/Notify'
export default {
  components: {
    ArticleItem
  },
  data () {
    return {
      articleList: [],
      theTime: new Date().getTime(),
      loading: false,
      finished: false,
      isLoading: false
    }
  },
  props: ['channelId'],
  async created () {
    this.getArticleList()
  },
  methods: {
    // 发送请求得到数据
    async getArticleList () {
      const res = await getAllArticleListAPI({
        channel_id: this.channelId,
        timestamp: this.theTime
      })
      this.articleList = [...this.articleList, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp
      this.loading = false
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }
      this.isLoading = false
    },
    // 上拉加载数据
    async onLoad () {
      if (this.articleList.length > 0) {
        this.getArticleList()
      } else {
        this.loading = false
      }
    },
    // 下拉刷新
    async onRefresh () {
      this.articleList = []
      this.theTime = new Date().getTime()
      this.getArticleList()
    },
    // 反馈意见
    async dislikeFn (id) {
      await dislikeArticleAPI({ artId: id })
      Notify({ type: 'success', message: '反馈成功!' })
      this.show = false
    },
    async reportFn ({ artId, type, remark }) {
      await reportArticleAPI({ artId, type, remark })
      Notify({ type: 'success', message: '反馈成功!' })
    }
  }
}
</script>

<style></style>
