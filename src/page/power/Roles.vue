<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['dbtop', i1 === 0 ? 'dbbtottom' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环,嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'dbtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deleteRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" :class="[i3 === 0 ? '' : 'dbtop']" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="deleteRightById(scope.row, item3.id)">{{
                      item3.authName
                    }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <!-- 索引列 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRolesById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="showSetRgihtsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addRoles" :rules="addFromRules" ref="addRolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改角色信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editRolesFrom" :rules="editFromRules" ref="editRolesFromRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="37%">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 添加角色的表单数据
      addRoles: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色表单的验证规则对象
      addFromRules: {
        roleName: [
          {
            required: true,
            message: '请输入要添加的职位名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 6,
            message: '角色名称长度在 2 到 6 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入添加角色的角色描述',
            trigger: 'blur',
          },
          {
            min: 4,
            max: 20,
            message: '角色描述长度在 4 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editRolesFrom: {},
      // 修改表单的验证规则对象/添加角色的表单规则验证
      editFromRules: {
        roleName: [
          {
            required: true,
            message: '请输入要修改的角色名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 6,
            message: '角色名称长度在 2 到 6 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入修改后的角色描述',
            trigger: 'blur',
          },
          {
            min: 4,
            max: 20,
            message: '角色描述长度在 4 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 控制分配权限对话框的显示与隐藏
      setRightsDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认展开的结点的ID值数组
      defKeys: [],
      // 当前即将分配权限的角色ID
      roleId: '',
    }
  },
  created() {
    // 获取所有角色列表数据
    this.getRoleList()
  },
  methods: {
    // 获取角色列表数据
    async getRoleList() {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有橘色列表数据失败!')
      }
      this.roleList = res.data
    },
    // 点击按钮,添加角色
    addRoleInfo() {
      this.$refs.addRolesFormRef.validate(async (valid) => {
        if (!valid) return
        //当验证通过时,发起添加用户的网络请求
        const { data: res } = await this.$axios.post('roles', this.addRoles)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功!')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户的数据列表
        this.getRoleList()
      })
    },
    // 监听添加用户对话框的关闭/清空事件
    addDialogClosed() {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 展示修改角色信息对话框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色失败!')
      }
      this.editRolesFrom = res.data
      // console.log(this.editRolesFrom)
      this.editDialogVisible = true
    },
    // 监听修改角色信息对话框的重置/清空事件
    editDialogClosed() {
      this.$refs.editRolesFromRef.resetFields()
    },
    // 修改角色信息并提交
    editRoleInfo() {
      this.$refs.editRolesFromRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.put('roles/' + this.editRolesFrom.roleId, {
          roleName: this.editRolesFrom.roleName,
          roleDesc: this.editRolesFrom.roleDesc,
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败!')
        }
        // 提示用户信息修改成功
        this.$message.success('修改角色信息成功!')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getRoleList()
      })
    },
    //  根据id删除指定的角色
    async deleteRolesById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      // 如果用户确认删除,则返回的结果为字符串 confirm
      // 如果用户取消删除,则返回的结果为字符串 cancel
      // console.log(res)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$axios.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败!')
      }
      // 提示删除成功的信息
      this.$message.success('删除用户成功!')
      // 刷新用户列表数据
      this.getRoleList()
    },
    // 根据id删除指定的权限
    async deleteRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      // 如果用户确认删除,则返回的结果为字符串 confirm
      // 如果用户取消删除,则返回的结果为字符串 cancel
      // console.log(res)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败!')
      }
      // 提示删除成功的信息
      this.$message.success('删除权限成功!')
      // 刷新用户列表数据
      // this.getRoleList()  不建议调用这个函数进行渲染页面,因为会发生页面的完整渲染!!
      role.children = res.data
    },
    // 显示分配权限对话框
    async showSetRgihtsDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分配权限列表失败!')
      }
      // 将获取成功的权限列表赋值给rightsList
      this.rightsList = res.data
      // 递归获取三级结点的id
      this.defKeys = []
      this.getLeafkeys(role, this.defKeys)
      this.setRightsDialogVisible = true
    },
    // 通过递归的形式,获取所有三级结点的id,并保存到defKeys数组中
    getLeafkeys(node, arr) {
      // 如果当前的node不包含chilrden属性,则是三级结点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafkeys(item, arr))
    },
    // 点击确定按钮,给当前角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色权限失败!')
      }
      this.$message.success('分配角色权限成功!')
      // 刷新角色列表数据
      this.getRoleList()
      // 关闭权限列表对话框
      this.setRightsDialogVisible = false
    },
  },
}
</script>

<style >
.el-tag {
  margin: 7px 0px 7px 57px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>