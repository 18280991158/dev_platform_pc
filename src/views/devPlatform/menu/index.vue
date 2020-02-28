<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
        创建
      </el-button>
    </div>
    <el-table v-loading="loading.getList" row-key="id" :data="table.data" border default-expand-all fit highlight-current-row style="width: 100%;">
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
          <el-button type="primary" size="mini" @click="handleLook(row)">
            查看
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="35%">
      <el-form ref="form" label-position="top" inline :model="form.data" :rules="form.rules">
        <el-form-item label="上级菜单">
          <el-cascader v-model="form.data.parents" :disabled="dialogStatus === 'look'" clearable :options="table.data" :props="{checkStrictly: true,value:'id',label:'metaTitle'}" />
        </el-form-item>
        <el-form-item label="菜单显示名称" prop="metaTitle">
          <el-input v-model="form.data.metaTitle" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="菜单标识" prop="name">
          <el-input v-model="form.data.name" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="metaIcon">
          <el-popover v-model="dialogIconVisible" :disabled="dialogStatus === 'look'" placement="right" width="400" trigger="click">
            <icon-list style="height:400px;overflow: auto" @confirm-select="confirmIconSelect" />
            <el-input slot="reference" readonly :value="form.data.icon" />
          </el-popover>

        </el-form-item>
        <el-form-item label="是否显示" prop="metaShow">
          <el-select v-model="form.data.metaShow" :disabled="dialogStatus === 'look'">
            <el-option label="显示" value="1" />
            <el-option label="不显示" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单组件" prop="component">
          <el-select v-model="form.data.menuComponentId" :disabled="dialogStatus === 'look'" clearable filterable>
            <el-option v-for="item in menuComponents" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="外链" prop="metaTarget">
          <el-select v-model="form.data.metaTarget" :disabled="dialogStatus === 'look'" clearable>
            <el-option label="__blank" value="__blank" />
          </el-select>
        </el-form-item>
        <el-form-item prop="metaTarget" label="跳转地址">
          <el-input v-model="form.data.path" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="顺序" prop="orderNum">
          <el-input-number v-model="form.data.orderNum" :disabled="dialogStatus === 'look'" :value="1" :min="1" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="dialogStatus === 'look'" :loading="loading.saveMenu" @click="save">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { list as listMenuComponent } from '@/api/menuComponent'
import * as api from '@/api/menu.js'
import IconList from './iconList'
export default {
  name: 'Menu',
  components: { IconList },
  data() {
    return {
      menuComponents: [],
      loading: {
        getList: false,
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
        create: '创建菜单',
        look: '查看菜单'
      },
      form: {
        defData: {
          id: undefined,
          name: '',
          menuIconId: '',
          metaTitle: '',
          metaShow: '1',
          menuComponentId: null,
          redirect: '',
          metaTarget: '',
          path: '',
          orderNum: 1,
          parentMetaTitle: undefined,
          icon: undefined,
          parentId: null,
          parents: []
        },
        data: {
          id: undefined,
          name: '',
          menuIconId: '',
          metaTitle: '',
          metaShow: '1',
          menuComponentId: null,
          redirect: '',
          metaTarget: '',
          path: '',
          orderNum: 1,
          parentMetaTitle: undefined,
          icon: undefined,
          parentId: null,
          parents: []
        },
        rules: {
          metaTitle: [
            { required: true, message: '请输入菜单显示名称', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入菜单标识', trigger: 'blur' }
          ]
        }
      },
      dialogIconVisible: false
    }
  },
  mounted() {
    this.getMenuComponents()
    this.getList()
  },
  methods: {
    getList() {
      this.loading.getList = true
      api.list({}).then(res => {
        this.table.data = res.data
        this.loading.getList = false
      }).catch(() => {
        this.loading.getList = false
      })
    },
    handleCreate() {
      Object.assign(this.form.data, this.form.defData)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleUpdate(row) {
      Object.assign(this.form.data, this.form.defData)
      Object.assign(this.form.data, row)
      if (row.parents !== undefined) {
        this.form.data.parents = JSON.parse(row.parents)
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleLook(row) {
      Object.assign(this.form.data, this.form.defData)
      Object.assign(this.form.data, row)
      if (row.parents !== undefined) {
        this.form.data.parents = JSON.parse(row.parents)
      }
      this.dialogStatus = 'look'
      this.dialogFormVisible = true
      this.form.parentMetaTitle = row.parentMetaTitle
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true
          const parents = this.form.data.parents
          if (parents.length !== 0) {
            this.form.data.parentId = parents[parents.length - 1]
            this.form.data.parents = JSON.stringify(parents)
          }
          api.save(this.form.data).then(() => {
            this.loading.save = false
            this.dialogFormVisible = false
            this.getList()
            this.$notify({ title: '成功', message: this.textMap[this.dialogStatus] + '成功', type: 'success', duration: 2000
            })
          }).catch(() => {
            this.loading.save = false
          })
        }
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
          this.getList()
        })
      })
    },
    getMenuComponents() {
      listMenuComponent().then(res => {
        this.menuComponents = res.data
      })
    },
    confirmIconSelect(icon) {
      this.form.data.icon = icon.name
      this.form.data.menuIconId = icon.id
      this.dialogIconVisible = false
    }
  }
}
</script>
