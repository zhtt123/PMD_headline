<template>
  <div>
    <van-nav-bar title="移动端头条-登录" />
    <div>
      <van-form @submit="onSubmit">
  <van-field
    v-model="user.mobile"
    name="mobile"
    label="手机号"
    placeholder="请输入11位手机号"
    :rules="[{ required: true, message: '请填写手机号', pattern: /^1[3-9]\d{9}$/}]"
  />
  <van-field
    v-model="user.code"
    type="password"
    name="code"
    label="密码"
    placeholder="请输入6位密码"
    :rules="[{ required: true, message: '请填写密码', pattern: /^\d{6}$/}]"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit" :disabled="isLoading" :loading="isLoading" loading-text="正在登录中...">提交</van-button>
  </div>
</van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import Notify from '@/utils/Notify'
import { setToken } from '@/utils/token'
import { setStorage } from '@/utils/storage'
export default {
  data () {
    return {
      user: {
        mobile: '',
        code: '246810'
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit () {
      this.isLoading = true
      try {
        const result = await loginAPI(this.user)
        Notify({ type: 'success', message: '登录成功!' })
        setToken(result.data.data.token)
        setStorage('refresh_token', result.data.data.refresh_token)
        this.$router.replace(this.$route.query.path || '/layout')
      } catch (error) {
        Notify({ type: 'danger', message: '账号或密码错误!' })
      }
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #007bff;
}
// scoped会将组件里面的根标签的类名都加上一个data-v-hash值,/deep/ 就是把data-v-hash值选择器写到类名的前面,必须有lang="less"否则会报错
/deep/ .van-nav-bar__title {
  color: #fff;
}
</style>
