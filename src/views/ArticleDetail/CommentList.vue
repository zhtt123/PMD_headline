<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{ 'art-cmt-container-1': isShow, 'art-cmt-container-2': !isShow }"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多评论了,请发布评论!"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <!-- 评论的 Item 项 -->
        <div
          class="cmt-item"
          v-for="comment in commentsList"
          :key="comment.com_id"
        >
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="comment.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ comment.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="comment.is_liking"
                @click="likeFn(true, comment)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeFn(false, comment)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">{{ comment.content }}</div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(comment.pubdate) }}</div>
        </div>
      </van-list>

      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShow">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="isShowFn()">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
            <van-icon name="comment-o" size="0.53333334rem" @click="moveFn" />
          </van-badge>
          <van-icon
            name="star"
            size="0.53333334rem"
            color="red"
            v-if="is_collected"
            @click="collectFn(true)"
          />
          <van-icon
            name="star-o"
            size="0.53333334rem"
            color="gray"
            v-else
            @click="collectFn(false)"
          />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          v-model="comValue"
          placeholder="友善评论、理性发言、阳光心灵"
          v-getFocus
          @blur="blurFn"
        ></textarea>
        <van-button type="default" :disabled="isShow" @click="publishFn"
          >发布</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCommentListAPI,
  likeCommentAPI,
  dislikeCommentAPI,
  getCommentAPI
} from '@/api'
import { timeAgo } from '@/utils/day'
export default {
  data () {
    return {
      commentsList: [],
      totalCount: 0,
      isShow: true,
      comValue: '',
      newComment: {},
      lastId: '',
      loading: false,
      finished: false
    }
  },
  props: ['is_collected'],
  methods: {
    timeAgo: timeAgo,
    // 点赞
    async likeFn (bool, comment) {
      if (bool === true) {
        comment.is_liking = false
        await dislikeCommentAPI({ comId: comment.com_id })
      } else {
        comment.is_liking = true
        await likeCommentAPI({ comId: comment.com_id })
      }
    },
    isShowFn () {
      this.isShow = false
    },
    blurFn () {
      setTimeout(() => {
        this.isShow = true
      }, 0)
    },
    // 发布评论
    async publishFn () {
      const result = await getCommentAPI({
        id: this.$route.params.artId,
        content: this.comValue
      })
      this.newComment = result.data.data.new_obj
      this.commentsList.unshift(this.newComment)
      this.totalCount++
      this.comValue = ''
      this.moveFn()
    },
    collectFn (bool) {
      this.$emit('collectFn', bool)
    },
    // 获取文章数据
    async getData () {
      const result = await getCommentListAPI({
        id: this.$route.params.artId,
        offset: this.lastId
      })
      this.commentsList = [...this.commentsList, ...result.data.data.results]
      this.totalCount = result.data.data.total_count
      this.lastId = result.data.data.last_id
      this.loading = false
      // 判断是否还有数据
      if (result.data.data.last_id === null) {
        this.finished = true
      }
    },
    onLoad () {
      if (this.commentsList.length === 0) {
        this.loading = false
        return
      }
      this.getData()
    },
    moveFn () {
      // // 没有动画效果，很生硬
      // const articleHeight = document.querySelector('.article-container').scrollHeight
      // window.scrollTo(0, articleHeight)
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    }
  },
  async created () {
    this.getData()
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
