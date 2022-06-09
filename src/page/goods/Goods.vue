<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- tab 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template></el-table-column
        >
        <el-table-column label="操作" width="125px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改商品信息对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="setGoodsDialogVisible"
      width="37%"
      @clise="setEditGoddsDialogClosed"
    >
      <el-form
        :model="editGoodsFrom"
        :rules="editGoodsFromRules"
        ref="editGoodsFromRef"
        label-width="100px"
      >
        <el-form-item label="商品名称:">
          <span>{{ editGoodsFrom.goods_name }}</span>
        </el-form-item>
        <el-form-item label="商品价格:" prop="goods_price">
          <el-input v-model="editGoodsFrom.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量:" prop="goods_weight">
          <el-input v-model="editGoodsFrom.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEditGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  nmae: 'Goods',
  data() {
    // 验证商品价格和重量的规则
    var checkNumber = (rule, value, callback) => {
      // 验证商品价格和重量的正则表达式
      const regEmail = /^\d+$|^\d+[.]?\d+$/
      if (regEmail.test(value)) {
        // 合法的数字
        return callback()
      }
      callback(new Error('只能为数字!'))
    }
    return {
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 商品数据列表
      goodsList: [],
      // 商品数据总条数
      total: 0,
      // 控制修改商品对话框的显示与隐藏
      setGoodsDialogVisible: false,
      // 需要修改的商品列表对象
      editGoodsFrom: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: 0,
      },
      // 需要修改的商品列表验证规则对象
      editGoodsFromRules: {
        goods_price: [
          {
            required: true,
            message: '请输入要修改的商品价格',
            trigger: 'blur',
          },
          { validator: checkNumber, trigger: 'blur' },
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入要修改的商品重量(kg)',
            trigger: 'blur',
          },
          { validator: checkNumber, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 得到所有的商品列表
    async getGoodsList() {
      const { data: res } = await this.$axios.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      //  把商品数据列表赋值给 this.goodsList
      this.goodsList = res.data.goods
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听页面显示条数的改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听页面页码的改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 点击按钮,删除商品
    async deleteGoods(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 如果用户确认删除,则返回的结果为字符串 confirm
      // 如果用户取消删除,则返回的结果为字符串 cancel
      // console.log(res)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$axios.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败!')
      }
      // 提示删除成功的信息
      this.$message.success('删除商品成功!')
      // 刷新商品列表数据
      this.getGoodsList()
    },
    goAddPage() {
      this.$router.push('/home/goods/add')
    },
    // 点击按钮,显示修改商品对话框
    async editGoods(id) {
      const { data: res } = await this.$axios.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.editGoodsFrom = res.data
      this.setGoodsDialogVisible = true
    },
    // 点击按钮,提交修改的商品数据
    addEditGoods() {
      this.$refs.editGoodsFromRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.put(
          'goods/' + this.editGoodsFrom.goods_id,
          this.editGoodsFrom
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改商品信息失败!')
        }
        this.$message.success('修改商品信息成功!')
        this.getGoodsList()
        this.setGoodsDialogVisible = false
      })
    },
    // 监听修改商品信息对话框的关闭事件
    setEditGoddsDialogClosed() {
      this.$refs.editGoodsFromRef.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
</style>