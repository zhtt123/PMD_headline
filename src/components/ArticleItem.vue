<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ article.title }}</span>
          <van-image
            :src="article.cover.images[0]"
            class="thumb"
            v-if="article.cover.type === 1"
            lazy-load
          >
            <template v-slot:error>加载失败</template>
          </van-image>
        </div>
        <div class="thumb-box" v-if="article.cover.type > 1">
          <van-image
            :src="imgUrl"
            v-for="(imgUrl, index) in article.cover.images"
            :key="index"
            class="thumb"
            lazy-load
          >
            <template v-slot:error>加载失败</template>
          </van-image>
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ article.aut_name }}</span>
            <span>{{ article.comm_count }}评论</span>
            <span>{{ timeAgo(article.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-show="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 遮罩层 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      get-container="body"
      :cancel-text="cancel"
      @cancel="cancelFn"
      @close="closeFn"
    />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/day'
import { firstActions, secondActions } from '@/api/report'

export default {
  props: {
    article: Object,
    isShow: {
      type: Boolean, // 类型是布尔值
      default: true
    }
  },
  methods: {
    timeAgo: timeAgo,
    onSelect (action, item) {
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.cancel = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('dislikeFn', this.article.art_id)
        this.show = false
      } else {
        this.$emit('reportFn', {
          artId: this.article.art_id,
          type: action.value,
          remark: action.name
        })
        this.show = false
      }
    },
    cancelFn () {
      if (this.cancel === '返回') {
        this.show = true
        this.actions = firstActions
        this.cancel = '取消'
      }
    },
    closeFn () {
      this.actions = firstActions
      this.cancel = '取消'
    }
  },
  data () {
    return {
      show: false,
      actions: firstActions,
      cancel: '取消'
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例:0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
