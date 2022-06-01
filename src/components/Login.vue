<template>
  <div class="login_container">
    <!-- 头像区域 -->
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 表单登录区域 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="80px"
        class="login_from"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 用户密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 4,
            max: 8,
            message: '用户名长度在 4 到 8 个字符',
            trigger: 'blur',
          },
        ],
        // 验证用户密码是否合法
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '用户密码长度在 6 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 点击重置按钮,重置表单内容
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    // 对表单内容进行预验证
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post('/login', this.loginForm) //await只能应用在被async修饰的方法中
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功!')
        // 1.将登录成功之后的token,保存到客户端的sessionStorage中
        // 1.1项目中除了登录之外的其他API接口,必须在登录之后才能访问
        // 1.2token 只应在当前网站打开期间生效,所以将token保存在sessionStorage中
        sessionStorage.setItem('token', res.data.token)
        console.log(res.data.token)
        // 2.通过编程式导航跳转到后台主页,路由地址是 / home
        this.$router.push('/home') // push 重定向  replace不会在浏览器历史history中留下浏览记录,无法回退,push则可以
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  border-radius: 7px;
  background-color: #fefefe;
}

.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  line-height: 130px;
  padding: 4px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 3px #eee;
  background-color: #eee;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    display: block;
    border-radius: 50%;
  }
}
.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 17px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>