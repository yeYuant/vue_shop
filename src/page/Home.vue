<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/shop_logo.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="leaveLogin">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <Sidebar :menulist="menulist" :iconsObj="iconsObj" :isCollapse="isCollapse" />
      </el-aside>
      <!-- 右侧内容主体区 -->
      <el-main>
        <!-- 放置路由占位符  指定路由视图 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from '../components/Sidebar'
export default {
  name: 'Home',
  components: { Sidebar },
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    leaveLogin() {
      // sessionStorage.removeItem('token');
      sessionStorage.clear() // 点击退出登录按钮,退出当前页面,并清空当前的饿token值,且重定向到 /login
      this.$router.replace('/login') //重定向到 登录login页面  replace不会在浏览器历史history中留下浏览记录,无法回退,push则可以
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return res.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style scope>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #363d40;
}
.el-header div {
  display: flex;
  align-items: center;
  margin-left: -17px;
}
.el-header div span {
  margin-left: 7px;
  font-size: 20px;
  color: #fefefe;
}
.el-aside {
  background-color: #313743;
}
.toggle_button {
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  color: #fefefe;
  letter-spacing: 0.2em;
  cursor: pointer;
  background-color: #475163;
}
.el-main {
  background-color: #e9edf1;
}
</style>