<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
        创建角色
      </el-button>
    </div>
    <el-table v-loading="loading.getList" :data="table.data" border fit highlight-current-row style="width: 100%;">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="code" label="角色标识" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.internal === '1'" disabled title="内置角色不能被删除" size="mini" type="danger">
            删除
          </el-button>
          <el-button v-else size="mini" type="danger" @click="del(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="form" label-position="top" :model="form.data" :rules="form.rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.data.name" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="form.data.code" :readonly="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.data.description" type="textarea" />
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
import * as api from '@/api/role.js'
export default {
  name: 'Role',
  data() {
    return {
      loading: {
        getList: true,
        save: false
      },
      table: {
        data: []
      },
      form: {
        defData: {
          id: undefined,
          name: '',
          code: '',
          description: '',
          internal: null
        },
        data: {
          id: undefined,
          name: '',
          code: '',
          description: '',
          internal: null
        },
        rules: {
          name: { required: true, message: '请输入角色名称', trigger: 'blur' },
          code: { required: true, validator: this.validateCode, trigger: 'blur' }
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '创建角色'
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      api.list().then(res => {
        this.loading.getList = false
        this.table.data = res.data
      }).catch(() => {
        this.loading.listRole = false
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true
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
          this.$notify({ title: '成功', message: '删除角色成功', type: 'success', duration: 2000 })
          this.getList()
        })
      })
    },
    validateCode(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入角色标识'))
        return
      }
      api.isExist({ code: this.form.data.code, id: this.form.data.id }).then(res => {
        if (res.data) {
          callback(new Error('角色标识已存在'))
        } else {
          callback()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
