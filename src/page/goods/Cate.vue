<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: #09c95f"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
        >
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="37%"
      @close="cateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="cateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="setCateDialogVisible"
      width="37%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateFrom"
        :rules="editCateFromRules"
        ref="editCateFromRef"
        label-width="100px"
      >
        <el-form-item label="新分类名称:" prop="cat_name">
          <el-input v-model="editCateFrom.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      //   查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //  商品分类的数据列表
      cateList: [],
      //   总数据条数
      total: 0,
      //   为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示,将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'isOk',
        },
        {
          label: '排序',
          // 表示,将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'order',
        },
        {
          label: '操作',
          // 表示,将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'opt',
        },
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类名称的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的ID
        cat_pid: 0,
        // 分类的等级.默认要添加的是一级分类
        cat_level: 0,
      },
      // 添加分类名称的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入要添加的分类名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 6,
            message: '分类名称长度在 2 到 6 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 父级分类数据列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true,
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],

      // 控制编辑分类对话框的显示与隐藏
      setCateDialogVisible: false,
      // 修改的分类对象
      editCateFrom: {},
      // 修改分类名称的验证规则对象
      editCateFromRules: {
        cat_name: [
          {
            required: true,
            message: '请输入要修改的分类名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 6,
            message: '分类名称长度在 2 到 6 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败!')
      }
      //   把数据列表赋值给 this.cateList
      this.cateList = res.data.result
      //   为总数据条数赋值
      this.total = res.data.total
      //   this.getCateList()
    },
    // 监听页面显示条数的改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听页面页码的改变事件
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击按钮,显示添加分类对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: { type: 2 },
      })
      this.parentCateList = res.data
    },
    // 添加分类对话框的父级分类数据发生变化触发这个函数
    parentCateChange() {
      // 如果 selectKeys数组中的length大于0,则说明选中了父级分类
      // 如果length=0,则说明没有选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮,添加分类
    addCate() {
      this.$refs.cateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!')
        }
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加分类对话框的关闭事件 重置表单数据
    cateDialogClosed() {
      this.$refs.cateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 展示编辑分类对话框
    async showEditCateDialog(id) {
      const { data: res } = await this.$axios.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取编辑分类信息失败!')
      }
      this.editCateFrom = res.data
      this.setCateDialogVisible = true
    },
    // 提交修改分类名称数据
    editCate() {
      this.$refs.editCateFromRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.put(
          'categories/' + this.editCateFrom.cat_id,
          { cat_name: this.editCateFrom.cat_name }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新分类名称失败!')
        }

        this.$message.success('更新分类名称成功!')
        this.getCateList()
        this.setCateDialogVisible = false
      })
    },

    // 监听编辑分类名称的关闭事件
    editCateDialogClosed() {
      this.$refs.editCateFromRef.resetFields()
    },
    // 删除分类
    async deleteCate(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$axios.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败!')
      }
      // 提示删除成功的信息
      this.$message.success('删除分类成功!')
      // 刷新用户列表数据
      this.getCateList()
    },
  },
}
</script>

<style>
</style>