<template>
  <div>
    <div>
      <!-- 头部导航 -->
      <van-nav-bar fixed>
        <template v-slot:left>
          <img src="@/assets/logo.png" class="logo" />
        </template>
        <template #right>
          <van-icon
            name="search"
            size="0.48rem"
            color="#fff"
            @click="$router.push('/search')"
          />
        </template>
      </van-nav-bar>
      <div>
        <van-tabs v-model="channelId" sticky offset-top="1.22667rem" animated @change="changeFn">
          <!-- 文章列表 -->
          <van-tab
            :title="channel.name"
            v-for="channel in userChannelsList"
            :key="channel.id"
            :name="channel.id"
          >
            <ArticleList :channelId="channelId"></ArticleList>
          </van-tab>
        </van-tabs>
        <!-- 编辑频道图标 -->
        <van-icon
          name="plus"
          size="0.37333334rem"
          class="moreChannels"
          @click="showPopup"
        />
        <!-- 弹出层 -->
        <van-popup v-model="show" get-container="body" class="edit_wrap">
          <ChannelEdit
            :userChannelsList="userChannelsList"
            :unCheckChannelsList="unCheckChannelsList"
            @addFn="addFn"
            @deleteFn="deleteFn"
            @closeFn="show = false"
            v-model="channelId"
          ></ChannelEdit>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getUserChannelsAPI,
  getAllChannelsAPI,
  addChannelsAPI,
  deleteChannelsAPI
} from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
export default {
  data () {
    return {
      channelId: 0,
      // 用户频道数据
      userChannelsList: [],
      // 所有频道数据
      allChannelsList: [],
      show: false,
      scrollTabT: {} // 每一个tab条对应的滚动条位置
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  async created () {
    const result = await getUserChannelsAPI()
    this.userChannelsList = result.data.data.channels
    const res = await getAllChannelsAPI()
    this.allChannelsList = res.data.data.channels
  },
  methods: {
    showPopup () {
      this.show = true
    },
    // 添加频道
    async addFn (unCheckChannel) {
      this.userChannelsList.push(unCheckChannel)
      // 先过滤掉id为0的推荐频道, 把剩余的数组返回
      const arr = this.userChannelsList.filter((obj) => {
        return obj.id !== 0
      })
      // map会收集每次遍历return的值形成一个新数组
      const channelList = arr.map((item, index) => {
        const newObj = { ...item } // 浅拷贝(让对象和原数组脱离关系)
        newObj.seq = index
        delete newObj.name // 删除对象里name键值对
        return newObj
      })
      await addChannelsAPI({ channels: channelList })
    },
    // 删除频道
    async deleteFn (userChannel) {
      const index = this.userChannelsList.findIndex((obj) => {
        return obj.id === userChannel.id
      })
      this.userChannelsList.splice(index, 1)
      await deleteChannelsAPI({ channelId: userChannel.id })
    },
    // 保存滚动条的位置
    scrollFn () {
      // 谷歌浏览器的内核与安卓手机内置的浏览器内核不是同一个，获取scrollTop的方式不同
      // 谷歌浏览器用的是HTML的scrollTop，有的浏览器用的是body的scrollTop
      this.$route.meta.scrollT = document.documentElement.scrollTop || document.body.scrollTop
      this.scrollTabT[this.channelId] = this.$route.meta.scrollT
    },
    // tab栏切换不是路由的跳转,不能执行activated和deactivated,只能在change事件中执行
    changeFn () {
      // tab且回来的时候height=0，所以document.documentElement.scrollTop设置不成功
      // this.$nextTick是DOM更新完了再执行
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.scrollTabT[this.channelId]
        document.body.scrollTop = this.scrollTabT[this.channelId]
      })
    }
  },
  computed: {
    // 更多频道数据
    unCheckChannelsList () {
      const newArr = this.allChannelsList.filter((allChannels) => {
        const index = this.userChannelsList.findIndex((userChannels) => {
          return userChannels.id === allChannels.id
        })
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  activated () {
    // 组件缓存,就要使用activated绑定addEventListener监听事件和deactivated来执行removeEventListener解绑事件
    // 组件缓存,created和destroyed就不执行了,只有keep-alive这个组件才有activated,deactivated在这两个生命周期
    window.addEventListener('scroll', this.scrollFn)
    // document.documentElement.scrollTop获取的是HTML的滚动高度
    document.documentElement.scrollTop = this.$route.meta.scrollT
    document.body.scrollTop = this.$route.meta.scrollT
  },
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #007bff;
}
.logo {
  width: 100px;
  height: 30px;
}
/deep/ .van-tabs__line {
  background-color: #007bff;
}
.van-tabs {
  padding-top: 46px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.edit_wrap {
  width: 100vw;
  height: 100vh;
}
</style>
