<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- tab 订单表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          width="100px"
          prop="order_price"
        ></el-table-column>
        <el-table-column label="是否付款" width="91px" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          width="100px"
          prop="is_send"
        ></el-table-column>
        <el-table-column label="下单时间" width="150px" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="127px">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showBox"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location"
            size="mini"
            @click="showProgressBox"
          ></el-button>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[7, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressdialogVisible"
      width="47%"
      @close="editAddressDialogClosed"
    >
      <el-form
        :model="addressFrom"
        :rules="addressFromRules"
        ref="addressFromRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            :props="orderProps"
            v-model="addressFrom.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressFrom.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查看物理进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="setProgressDialogVisible"
      width="47%"
    >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  name: 'Order',
  data() {
    return {
      // 查询条件
      queryInfo: {
        query: '',
        // 当前页码值
        pagenum: 1,
        // 每页显示条数
        pagesize: 7,
      },
      //   总订单条数
      total: 0,
      //   订单管理列表数据
      orderList: [],
      //   控制修改地址对话框的显示与隐藏
      editAddressdialogVisible: false,
      //   地址信息
      addressFrom: {
        address1: [],
        address2: '',
      },
      //   地址信息的验证规则对象
      addressFromRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区/县',
            trigger: 'blur',
          },
        ],
        address2: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur',
          },
        ],
      },
      //   全国地址信息
      cityData,
      // 级联选择框的配置对象
      orderProps: {
        expandTrigger: 'hover',
      },
      progressInfo: [
        {
          time: '2022-05-10 09:39:00',
          ftime: '2022-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
        },
        {
          time: '2022-05-10 08:23:00',
          ftime: '2022-05-10 08:23:00',
          context:
            '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: '',
        },
        {
          time: '2022-05-10 07:32:00',
          ftime: '2022-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2022-05-10 02:03:00',
          ftime: '2022-05-10 02:03:00',
          context:
            '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2022-05-09 23:05:00',
          ftime: '2022-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2022-05-09 21:21:00',
          ftime: '2022-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2022-05-09 13:07:00',
          ftime: '2022-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: '',
        },
        {
          time: '2022-05-09 12:25:03',
          ftime: '2022-05-09 12:25:03',
          context: '卖家发货',
          location: '',
        },
        {
          time: '2022-05-09 12:22:24',
          ftime: '2022-05-09 12:22:24',
          context: '您的订单将由HLA(北京海淀区清河中街店)门店安排发货。',
          location: '',
        },
        {
          time: '2022-05-08 21:36:04',
          ftime: '2022-05-08 21:36:04',
          context: '商品已经下单',
          location: '',
        },
      ],
      //   控制查看物流进度对话框的显示与隐藏
      setProgressDialogVisible: false,
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$axios.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据列表失败!')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 监听页面显示条数的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页码的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 点击按钮,显示修改地址对话框
    showBox() {
      this.editAddressdialogVisible = true
    },
    // 监听修改地址对话框的关闭事件
    editAddressDialogClosed() {
      this.$refs.addressFromRef.resetFields()
    },
    // 点击按钮,显示查看物理进度对话框
    async showProgressBox() {
      this.setProgressDialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
</style>