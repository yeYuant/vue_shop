<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2.为 echarts 准备一个具备大小(宽高)的 Dom -->
      <div id="main" style="width: 970px; height: 570px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入 echarts
import * as echarts from 'echarts'
export default {
  name: 'Report',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#272424',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  created() {},
  //   在mouted中,页面上的元素已经都渲染完毕了
  async mounted() {
    //  3.基于准备好的dom,初始化 echarts实例
    var myEcharts = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$axios.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error9('获取折线图数据失败!')
    }

    // 4.准备数据和配置项

    const result = Object.assign(this.options, res.data)
    // 5.展示数据
    myEcharts.setOption(result)
  },
  methods: {},
}
</script>

<style>
/* * {
    background-color: rgb(39, 36, 36);
} */
</style>