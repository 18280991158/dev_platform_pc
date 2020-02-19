<template>
  <div>
    <div class="filter-container">
      <el-button v-show="dialogListVisible" class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
        创建数据项
      </el-button>
    </div>
    <el-table v-show="dialogListVisible" v-loading="loading.getList" :data="table.data" border fit highlight-current-row style="width: 100%;">
      <el-table-column prop="name" label="数据项名称" />
      <el-table-column prop="value" label="数据项值" />
      <el-table-column prop="orderNum" label="顺序" />
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="del(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="dialogFormVisible" style="width: 40%">
      <el-form ref="form" label-position="top" :model="form.data" :rules="form.rules" label-width="120px">
        <el-form-item label="数据项名称" prop="name">
          <el-input v-model="form.data.name" />
        </el-form-item>
        <el-form-item label="数据项值" prop="value">
          <el-input v-model="form.data.value" :readonly="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="顺序">
          <el-input-number v-model="form.data.orderNum" :precision="0" :step="1" :min="1" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">确定</el-button>
          <el-button @click="cancelFormDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import * as api from '@/api/dictionaryItem'
export default {
  name: 'DictionaryItem',
  props: {
    dictionaryDirectoryId: {
      required: true,
      type: Number
    }
  },
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
          value: '',
          name: '',
          orderNum: null
        },
        data: {
          id: undefined,
          value: '',
          name: '',
          orderNum: null
        },
        rules: {
          value: { required: true, validator: this.validateValue, trigger: 'blur' },
          name: { required: true, validator: this.validateName, trigger: 'blur' }
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑数据项',
        create: '创建数据项'
      },
      dialogListVisible: true
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      api.list({ dictionaryDirectoryId: this.dictionaryDirectoryId }).then(res => {
        this.loading.getList = false
        this.table.data = res.data
      }).catch(() => {
        this.loading.getList = false
      })
    },
    handleCreate() {
      Object.assign(this.form.data, this.form.defData)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.dialogListVisible = false
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleUpdate(row) {
      Object.assign(this.form.data, row)
      this.dialogFormVisible = true
      this.dialogListVisible = false
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    cancelFormDialog() {
      this.dialogFormVisible = false
      this.dialogListVisible = true
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true
          this.form.data.dictionaryDirectoryId = this.dictionaryDirectoryId
          api.save(this.form.data).then(() => {
            this.loading.save = false
            this.dialogFormVisible = false
            this.dialogListVisible = true
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
          this.$notify({ title: '成功', message: '删除数据项成功', type: 'success', duration: 2000 })
          this.getList()
        })
      })
    },
    validateValue(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入数据项值'))
        return
      }
      api.isExist({ dictionaryDirectoryId: this.dictionaryDirectoryId, value, id: this.form.data.id }).then(res => {
        if (res.data) {
          callback(new Error('数据项值已存在'))
        } else {
          callback()
        }
      })
    },
    validateName(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入数据项名称'))
        return
      }

      api.isExist({ dictionaryDirectoryId: this.dictionaryDirectoryId, name: value, id: this.form.data.id }).then(res => {
        if (res.data) {
          callback(new Error('数据项名称已存在'))
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
