<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="selectRole" class="filter-item">
        <el-option v-for="item in roles" :key="item" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
        创建菜单
      </el-button>
      <el-button class="filter-item" :loading="loading.refreshCache" style="margin-left: 10px;" type="primary" icon="fas fa-sync-alt" @click="refreshCache">
        刷新缓存
      </el-button>
    </div>
    <el-table v-loading="loading.getList" row-key="id" :data="table.data" border fit highlight-current-row style="width: 100%;">
      <el-table-column prop="metaTitle" label="菜单显示名称" />
      <el-table-column label="菜单图标">
        <template slot-scope="{row}">
          <svg-icon :icon-class="row.icon" /> {{ row.icon }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="菜单标识" />
      <el-table-column label="是否显示">
        <template slot-scope="{row}">
          <el-tag v-if="row.metaShow === '1'" type="success">显示</el-tag>
          <el-tag v-else type="danger">不显示</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="菜单组件" />
      <el-table-column prop="metaTarget" label="外链" />
      <el-table-column prop="path" label="跳转地址" />
      <el-table-column prop="orderNum" label="顺序" />
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.parentId === undefined" type="primary" size="mini" @click="handleCreate(row)">
            创建
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="del(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="form" label-position="top" :inline="true" :model="form.data" :rules="form.rules">
        <el-form-item label="上级菜单">
          <el-input :value="form.parentMetaTitle" readonly />
        </el-form-item>
        <el-form-item label="菜单显示名称" prop="metaTitle">
          <el-input v-model="form.data.metaTitle" />
        </el-form-item>
        <el-form-item label="菜单标识" prop="name">
          <el-input v-model="form.data.name" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="metaIcon">
          <el-input v-model="form.data.metaIcon" />
        </el-form-item>
        <el-form-item label="是否显示" prop="metaShow">
          <el-select v-model="form.data.metaShow">
            <el-option label="显示" :value="1" />
            <el-option label="不显示" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单组件" prop="component">
          <el-select v-model="form.data.menuComponentId" filterable>
            <el-option v-for="item in menuComponents" :key="item" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="外链" prop="metaTarget">
          <el-select v-model="form.data.metaTarget" clearable>
            <el-option label="__blank" value="__blank" />
          </el-select>
        </el-form-item>
        <el-form-item prop="metaTarget" label="跳转地址">
          <el-input v-model="form.data.path" />
        </el-form-item>
        <el-form-item label="顺序" prop="orderNum">
          <el-input-number v-model="form.data.orderNum" :value="1" :min="1" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading.saveMenu" @click="save">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { list as listRole } from '@/api/role'
import { list as listMenuComponent } from '@/api/menuComponent'
import * as api from '@/api/menu.js'
export default {
  name: 'Menu',
  data() {
    return {
      roles: [],
      menuComponents: [],
      selectRole: null,
      loading: {
        getList: true,
        save: false,
        refreshCache: false
      },
      table: {
        data: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑菜单',
        create: '创建菜单'
      },
      form: {
        defData: {
          id: undefined,
          name: '',
          metaIcon: '',
          metaTitle: '',
          metaShow: 1,
          component: '',
          redirect: '',
          metaTarget: '',
          path: '',
          orderNum: 1
        },
        data: {
          id: undefined,
          name: '',
          metaIcon: '',
          metaTitle: '',
          metaShow: 1,
          component: '',
          redirect: '',
          metaTarget: '',
          path: '',
          orderNum: 1
        },
        rules: {
          metaTitle: [
            { required: true, message: '请输入菜单显示名称', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入菜单标识', trigger: 'blur' }
          ]
        },
        parentMetaTitle: ''
      }
    }
  },
  mounted() {
    this.getRoleList()
    this.getMenuComponents()
  },
  methods: {
    getRoleList() {
      listRole().then(res => {
        this.roles = res.data
        this.selectRole = this.roles[0].id
        this.getList()
      })
    },
    getList() {
      this.loading.getList = true
      api.list({ roleId: this.selectRole }).then(res => {
        this.table.data = res.data
        this.loading.getList = false
      }).catch(() => {
        this.loading.getList = false
      })
    },
    handleCreate(row) {
      Object.assign(this.form.data, this.form.defData)
      if (row !== undefined) {
        this.form.data.parentId = row.id
        this.form.parentMetaTitle = row.metaTitle
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleUpdate(row) {
      Object.assign(this.form.data, this.form.defData)
      Object.assign(this.form.data, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.form.parentMetaTitle = row.parentMetaTitle
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.data.roleId = this.selectRole
          this.loading.saveMenu = true
          api.save(this.form.data).then(() => {
            this.loading.saveMenu = false
            this.dialogFormVisible = false
            this.loadMenuByRole()
            this.$notify({ title: '成功', message: this.textMap[this.dialogStatus] + '成功', type: 'success', duration: 2000
            })
          }).catch(() => {
            this.loading.saveMenu = false
          })
        }
      })
    },
    refreshCache() {
      this.loading.refreshCache = true
      api.refreshCache().then(() => {
        this.$notify({ title: '成功', message: '刷新缓存成功', type: 'success', duration: 2000 })
        this.loading.refreshCache = false
      }).catch(() => {
        this.loading.refreshCache = false
      })
    },
    del(row) {
      this.$confirm('你确定要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.del({ id: row.id }).then(() => {
          this.$notify({ title: '成功', message: '删除菜单成功', type: 'success', duration: 2000 })
          this.loadMenuByRole()
        })
      })
    },
    getMenuComponents() {
      listMenuComponent().then(res => {
        this.menuComponents = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
