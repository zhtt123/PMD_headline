<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- Object.keys()能将一个对象转化成一个数组,也可以使用对象里面的任意一个元素的值是'undefined' -->
    <van-loading color="#1989fa" v-if="Object.keys(articleDetail).length === 0">
      文章加载中...
    </van-loading>

    <!-- 文章信息区域 -->
    <div class="article-container" v-else>
      <!-- 文章标题 -->
      <h1 class="art-title">{{ articleDetail.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="articleDetail.aut_name"
        :label="timeAgo(articleDetail.pubdate)"
      >
        <template #icon>
          <img :src="articleDetail.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button
              type="info"
              size="mini"
              v-if="articleDetail.is_followed"
              @click="followedFn(true)"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              v-else
              size="mini"
              plain
              @click="followedFn(false)"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articleDetail.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="articleDetail.attitude === 1"
          @click="attitudeFn(true)"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="attitudeFn(false)"
          >点赞</van-button
        >
      </div>

      <!-- 文章评论列表 -->
      <div>
        <CommentList :is_collected="articleDetail.is_collected" @collectFn="collectFn"></CommentList>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticleDetailAPI,
  followedUserAPI,
  unFollowedUserAPI,
  loveArticleAPI,
  unLoveArticleAPI,
  collectionCommentAPI,
  unCollectionCommentAPI
} from '@/api'
import { timeAgo } from '@/utils/day'
import CommentList from './CommentList.vue'
export default {
  name: 'ArticleDetail',
  data () {
    return {
      articleDetail: {}
    }
  },
  components: { CommentList },
  methods: {
    timeAgo: timeAgo,
    // 关注
    async followedFn (bool) {
      if (bool === true) {
        this.articleDetail.is_followed = false
        await unFollowedUserAPI({ autId: this.articleDetail.aut_id })
      } else {
        this.articleDetail.is_followed = true
        await followedUserAPI({ autId: this.articleDetail.aut_id })
      }
    },
    // 点赞
    async attitudeFn (bool) {
      if (bool === true) {
        this.articleDetail.attitude = 0
        await unLoveArticleAPI({ artId: this.articleDetail.art_id })
      } else {
        this.articleDetail.attitude = 1
        await loveArticleAPI({ artId: this.articleDetail.art_id })
      }
    },
    // 收藏
    async collectFn (bool) {
      if (bool === true) {
        this.articleDetail.is_collected = false
        await unCollectionCommentAPI({ artId: this.articleDetail.art_id })
      } else {
        this.articleDetail.is_collected = true
        await collectionCommentAPI({ artId: this.articleDetail.art_id })
      }
    }
  },
  async created () {
    const result = await getArticleDetailAPI({
      artId: this.$route.params.artId
    })
    this.articleDetail = result.data.data
  }
}
</script>

<style scoped lang="less">
/deep/ .van-nav-bar__content {
  background-color: #007bff;
}
/deep/ .van-nav-bar__title {
  color: #fff;
}
/deep/ .van-nav-bar__arrow {
  color: #fff;
}
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

.van-loading {
  text-align: center;
  padding-top: 46px;
}
</style>
