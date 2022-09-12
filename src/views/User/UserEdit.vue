<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="profileInfo.photo"
            @click="$refs.iptFile.click()"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="profileInfo.name"
        @click="nameClickFn"
      />
      <van-cell
        title="生日"
        is-link
        :value="profileInfo.birthday"
        @click="birthdayDateFn"
      />
    </van-cell-group>

    <!-- 生日时间选择器 -->
    <van-popup v-model="birthdayDateShow" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="birthdayDateCancelFn"
        @confirm="birthdayDateConfirmFn"
      />
    </van-popup>

    <!-- 姓名修改 -->
    <van-dialog
      v-model="nameShow"
      title="修改昵称"
      show-cancel-button
      :beforeClose="beforeCloseFn"
    >
      <input type="text" v-getFocus v-model="userName" />
    </van-dialog>
  </div>
</template>

<script>
import {
  getProfileInfoAPI,
  updatePhotoAPI,
  editProfileInfoAPI
} from '@/api'
import { formateDate } from '@/utils/day'
import Notify from '@/utils/Notify'
export default {
  name: 'UserEdit',
  data () {
    return {
      profileInfo: {},
      nameShow: false,
      userName: '',
      birthdayDateShow: false,
      minDate: new Date(1922, 0, 1),
      maxDate: new Date(),
      currentDate: new Date()
    }
  },
  // 获取个人资料
  async created () {
    const result = await getProfileInfoAPI()
    this.profileInfo = result.data.data
  },
  methods: {
    // 修改头像
    async onFileChange (e) {
      if (e.target.files.length === 0) return
      const img = new FormData()
      img.append('photo', e.target.files[0])
      const result = await updatePhotoAPI(img)
      this.profileInfo.photo = result.data.data.photo
      this.$store.commit('GETUSERPHOTO', this.profileInfo.photo)
    },
    // 修改姓名
    nameClickFn () {
      this.nameShow = true
      this.userName = this.profileInfo.name
    },
    // 正则校验
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        const reg = /^[0-9A-Za-z\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.userName) === true) {
          await editProfileInfoAPI({ name: this.userName })
          this.profileInfo.name = this.userName
          this.$store.commit('GETUSERNAME', this.profileInfo.name)
          done()
        } else {
          Notify({ type: 'warning', message: '用户名只能是1-7位中英数字组合' })
          done(false)
        }
      } else {
        done()
      }
    },
    // 修改生日
    birthdayDateFn () {
      this.currentDate = new Date(this.profileInfo.birthday)
      this.birthdayDateShow = true
    },
    birthdayDateCancelFn () {
      this.birthdayDateShow = false
    },
    async birthdayDateConfirmFn () {
      await editProfileInfoAPI({
        birthday: formateDate(this.currentDate)
      })
      this.profileInfo.birthday = formateDate(this.currentDate)
      this.birthdayDateShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
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
/deep/ .van-dialog__content {
  text-align: center;
  input {
    padding: 2px;
    text-align: center;
    border: 0;
    font-size: 14px;
  }
}
</style>
