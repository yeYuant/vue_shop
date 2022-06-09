<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- alert 警告区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab 标签区域 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                class="ipt-number"
                v-model="addGoodsForm.goods_price"
                type="number"
                onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                class="ipt-number"
                v-model="addGoodsForm.goods_number"
                type="number"
                onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量(kg)" prop="goods_weight">
              <el-input
                class="ipt-number"
                v-model="addGoodsForm.goods_weight"
                type="number"
                onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 是图片要上传到的后台API的地址 -->
            <el-upload
              :action="uploadRUL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headeObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="addCate"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片缩略图区域 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="47%">
      <img :src="this.previewPath" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      activeIndex: '0',
      // 添加商品的数据对象
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: [],
      },
      // 添加商品的验证规则对象
      addGoodsFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入要添加的商品名称',
            trigger: 'blur',
          },
        ],
        goods_price: [
          {
            required: true,
            message: '请输入要添加的商品价格',
            trigger: 'blur',
          },
        ],
        goods_number: [
          {
            required: true,
            message: '请输入要添加的商品数量',
            trigger: 'blur',
          },
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入要添加的商品重量',
            trigger: 'blur',
          },
        ],
        goods_cat: [
          {
            required: true,
            message: '请输入要添加的商品分类',
            trigger: 'blur',
          },
        ],
      },
      // 商品分类数据列表
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 图片要上传的RUL地址
      uploadRUL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 设置用户图片上传的请求头对象
      headeObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 缩略图路径
      previewPath: '',
      // 控制缩略图的显示与隐藏
      previewVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表数据
    async getCateList() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败!')
      }
      this.cateList = res.data
    },
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // 离开 基本信息分类时触发
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    async tabClicked() {
      // activaIndex = 1,说明访问的是商品参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败!')
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })

        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性列表失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 处理图片的预览操作
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
      console.log(this.previewPath)
    },
    // 处理图片的移除操作
    handleRemove(file) {
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中,找到这个图片对应的索引值
      const index = this.addGoodsForm.pics.findIndex(
        (currentValue) => currentValue.pic === filePath
      )
      // 3.调用数组的 splice 方法,把图片信息对象,从pics数组中移除
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 监听图片上传成功的函数
    handleSuccess(response) {
      // 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path,
      }
      this.addGoodsForm.pics.push(picInfo)
    },
    // 点击按钮,添加商品
    addCate() {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项!')
        }
        // 预校验成功 执行添加商品的业务逻辑
        // 在 JS 中 ,JSON.parse(JSON.stringify(xxx)) 也可以实现深拷贝
        const from = JSON.parse(JSON.stringify(this.addGoodsForm))
        from.goods_cat = from.goods_cat.join(',')

        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(','),
          }
          this.addGoodsForm.attrs.push(newInfo)
        })

        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodsForm.attrs.push(newInfo)
        })
        from.attrs = this.addGoodsForm.attrs

        // 发起添加商品的 请求
        const { data: res } = await this.$axios.post('goods', from)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }
        this.$message.success('添加商品成功!')
        this.$router.push('/home/goods')
      })
    },
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 270px;
}
.el-checkbox {
  margin: 5px 17px 0 0 !important;
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
// 防止type为number类型的input出现上下箭头
/deep/ input[type='number'] {
  -moz-appearance: textfield;
}

.el-upload-list__item-thumbnail {
  width: 77px;
}
.el-upload-list__item {
  height: 93px;
}
.btnAdd {
  margin-top: 17px;
}
</style>