<template>
  <!-- 侧边栏菜单区域 -->
  <el-menu
    class="el-menu-vertical-demo"
    background-color="#323743"
    text-color="#fff"
    active-text-color="#3f9ffe"
    unique-opened
    :collapse="isCollapse"
    :collapse-transition="false"
    router
    :default-active="activePath"
  >
    <!-- 一级菜单 -->
    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
      <!-- 一级菜单的模板区域 -->
      <template slot="title">
        <!-- 字体图标 -->
        <i :class="iconsObj[item.id]"></i>
        <!-- 文本 -->
        <span>{{ item.authName }}</span>
      </template>
      <!-- 二级菜单 -->
      <el-menu-item
        :index="'/home/' + subItem.path"
        v-for="subItem in item.children"
        :key="subItem.id"
        @click="saveNavState('/home/' + subItem.path)"
      >
        <!-- 二级菜单的模板区域 -->
        <template slot="title">
          <!-- 字体图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{ subItem.authName }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'Sidebar',
  props: ['menulist', 'iconsObj', 'isCollapse'],
  data() {
    return {
      activePath: '',
    }
  },
  created() {
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    // 保存链接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style lang="less" >
.iconfont {
  margin-right: 7px;
}
</style>