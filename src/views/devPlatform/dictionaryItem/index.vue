<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ type === 1?'系统':'业务' }}字典列表</span>
          </div>
          <div class="text item">
            <dictionary-directory :type="type" @current-change="handleDictionaryChange" @delete="handleDirectoryDelete" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>[{{ currDirectory.name === undefined ? '暂无':currDirectory.name }}]{{ type === 1?'系统':'业务' }}字典详情</span>
          </div>
          <div class="text item">
            <div class="filter-container">
              <el-input v-model="table.query.name" :disabled="currDirectory.name === undefined" style="width: 200px;" placeholder="字典名称|键值" class="filter-item" />
              <el-button :disabled="currDirectory.name === undefined" :loading="loading.getList" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                搜索
              </el-button>
              <br>
              <el-button :disabled="currDirectory.name === undefined" class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
                创建
              </el-button>
              <el-button :disabled="currDirectory.name === undefined" class="filter-item" style="margin-left: 10px;" type="danger" icon="fas fa-trash-alt" @click="batchDel">
                删除
              </el-button>
            </div>
            <el-table v-loading="loading.getList" :data="table.data" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column label="字典编码">
                <template>
                  {{ currDirectory.code }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="字典名称" />
              <el-table-column prop="value" label="字典键值" />
              <el-table-column prop="orderNum" label="顺序" />
              <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                  <el-button type="primary" size="mini" @click="handleLook(row)">
                    查看
                  </el-button>
                  <el-button type="primary" size="mini" @click="handleUpdate(row)">
                    编辑
                  </el-button>
                  <el-button size="mini" type="danger" @click="del([row.id])">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="table.total>0" :total="table.total" :page.sync="table.query.current" :limit.sync="table.query.size" @pagination="getList" />
          </div>
        </el-card>

      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="20%">
      <el-form ref="form" label-position="top" :model="form.data" :rules="form.rules" label-width="120px">
        <el-form-item label="字典编码">
          <el-input v-model="currDirectory.code" :disabled="dialogStatus === 'look'" readonly />
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.data.name" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="字典键值" prop="value">
          <el-input v-model="form.data.value" :disabled="dialogStatus === 'look'" :readonly="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="顺序">
          <el-input-number v-model="form.data.orderNum" :disabled="dialogStatus === 'look'" :precision="0" :step="1" :min="1" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :disabled="dialogStatus === 'look'" type="primary" :loading="loading.save" @click="save">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import * as api from '@/api/dictionaryItem'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DictionaryDirectory from '../dictionaryDirectory'
export default {
  name: 'DictionaryItem',
  components: {
    DictionaryDirectory, Pagination
  },
  props: {
    type: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: {
        getList: false,
        save: false
      },
      table: {
        data: [],
        query: {
          size: 10,
          current: 1,
          name: ''
        }
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
        update: '编辑字典',
        create: '创建字典',
        look: '查看字典'
      },
      currDirectory: {},
      multipleSelection: []
    }
  },
  mounted() {
  },
  methods: {
    getList() {
      this.loading.getList = true
      this.table.query.dictionaryDirectoryId = this.currDirectory.id
      api.listPage(this.table.query).then(res => {
        this.loading.getList = false
        this.table.data = res.data.records
        this.table.total = res.data.total
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
      Object.assign(this.form.data, row)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
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
    cancelFormDialog() {
      this.dialogFormVisible = false
      this.dialogListVisible = true
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true
          this.form.data.dictionaryDirectoryId = this.currDirectory.id
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
    del(data) {
      this.$confirm('你确定要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.del(data).then(() => {
          this.$notify({ title: '成功', message: '删除字典成功', type: 'success', duration: 2000 })
          this.getList()
        })
      })
    },
    validateValue(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入字典键值'))
        return
      }
      api.isExist({ dictionaryDirectoryId: this.dictionaryDirectoryId, value, id: this.form.data.id }).then(res => {
        if (res.data) {
          callback(new Error('字典键值值已存在'))
        } else {
          callback()
        }
      })
    },
    validateName(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入字典名称'))
        return
      }

      api.isExist({ dictionaryDirectoryId: this.dictionaryDirectoryId, name: value, id: this.form.data.id }).then(res => {
        if (res.data) {
          callback(new Error('字典名称已存在'))
        } else {
          callback()
        }
      })
    },
    handleDictionaryChange(row) {
      this.currDirectory = row
      this.table.query.name = ''
      this.table.query.current = 1
      this.getList()
    },
    handleFilter() {
      this.table.query.current = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDel() {
      if (!this.$CheckSelection(true, this.multipleSelection)) {
        return
      }
      const data = []
      for (const row of this.multipleSelection) {
        data.push(row.id)
      }
      this.del(data)
    },
    handleDirectoryDelete() {
      this.currDirectory = {}
      this.table.query.current = 1
      this.table.total = 0
      this.table.data = []
    }

  }
}
</script>

<style scoped>

</style>
