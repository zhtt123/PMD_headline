<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小思同学"
    ></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(obj,index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="obj.name !== 'me'">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{obj.msg}}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{obj.msg}}</div>
          <van-image
            fit="cover"
            round
            :src="$store.state.userPhoto"
          />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field placeholder="说点什么..." v-model="word">
        <template #button>
          <span style="font-size: 12px; color: #999" @click="sendFn">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token'
export default {
  name: 'Chat',
  data () {
    return {
      word: '',
      list: [
        { name: 'xs', msg: 'hi,你好!我是小思' },
        { name: 'me', msg: '我是编程小王子' }
      ],
      socket: null
    }
  },
  created () {
    // 创建客户端 websocket 的实例
    this.socket = io('http://toutiao.itheima.net', {
      query: {
        token: getToken()
      },
      transports: ['websocket']
    })

    // this.socket.on('connect', () => {
    //   console.log('数据连接成功')
    // })

    // 接收后端发回来的消息
    this.socket.on('message', obj => {
      this.list.push({
        name: 'xs',
        msg: obj.msg
      })

      // 获取最后一条消息
      setTimeout(() => {
        const theLastDiv = document.querySelector('.chat-list>div:last-child')
        theLastDiv.scrollIntoView({
          behavior: 'smooth'
        })
      }, 0)
    })
  },
  methods: {
    sendFn () {
      if (this.word.trim().length === 0) return
      // 向后端发送请求
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime()
      })
      this.list.push({
        name: 'me',
        msg: this.word
      })
      this.word = ''

      // 获取最后一条消息
      setTimeout(() => {
        const theLastDiv = document.querySelector('.chat-list>div:last-child')
        theLastDiv.scrollIntoView({
          behavior: 'smooth'
        })
      }, 0)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__content {
    background-color: #007bff;
}
/deep/ .van-nav-bar__title {
    color: #fff;
}
/deep/ .van-nav-bar__arrow {
    color: #fff;
}
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
