<template>
  <div>
    <el-button type="info" @click="leaveLogin">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    leaveLogin() {
      // sessionStorage.removeItem('token');
      sessionStorage.clear() // 点击退出登录按钮,退出当前页面,并清空当前的饿token值,且重定向到 /login
      this.$router.replace('/login') //重定向到 登录login页面  replace不会在浏览器历史history中留下浏览记录,无法回退,push则可以
    },
  },
}
</script>

<style>
</style>