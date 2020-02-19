<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="table.query.name" style="width: 200px;" placeholder="字典目录名称|标识" class="filter-item" />
      <el-button v-waves :loading="loading.getList" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
        创建字典目录
      </el-button>
      <el-button class="filter-item" :loading="loading.refreshCache" style="margin-left: 10px;" type="primary" icon="fas fa-sync-alt" @click="refreshCache">
        刷新缓存
      </el-button>
    </div>

    <el-table v-loading="loading.getList" :data="table.data" border fit highlight-current-row style="width: 100%;">
      <el-table-column prop="name" label="字典目录名称" />
      <el-table-column prop="code" label="字典目录标识" />
      <el-table-column prop="itemNum" label="数据项" />
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleOpenDialogValListVisible(row)">
            数据项
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
    <pagination v-show="table.total>0" :total="table.total" :page.sync="table.query.current" :limit.sync="table.query.size" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="form" label-position="top" :model="form.data" :rules="form.rules" label-width="120px">
        <el-form-item label="字典目录名称" prop="name">
          <el-input v-model="form.data.name" />
        </el-form-item>
        <el-form-item label="字典目录标识" prop="code">
          <el-input v-model="form.data.code" :readonly="dialogStatus === 'update'" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading.save" @click="save">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="字典数据项列表" :close-on-click-modal="false" :visible.sync="dialogValListVisible" @close="getList">
      <dictionary-item v-if="dialogValListVisible" :dictionary-directory-id="table.currRow.id" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import * as api from '@/api/dictionaryDirectory'
import DictionaryItem from '../dictionaryItem'
export default {
  components: {
    Pagination, DictionaryItem
  },
  data() {
    return {
      loading: {
        getList: false,
        save: false,
        refreshCache: false
      },
      table: {
        data: [],
        currRow: {},
        query: {
          size: 10,
          current: 1
        },
        total: 0
      },
      form: {
        defData: {
          id: undefined,
          name: '',
          code: ''
        },
        data: {
          id: undefined,
          name: '',
          code: ''
        },
        rules: {
          name: { required: true, message: '请输入字典目录名称', trigger: 'blur' },
          code: { required: true, validator: this.validateCode, trigger: 'blur' }
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑数据项',
        create: '创建数据项'
      },
      dialogValListVisible: false

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading.getList = true
      api.listPage(this.table.query).then(res => {
        this.loading.getList = false
        this.table.total = res.data.total
        this.table.data = res.data.records
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
    validateCode(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入字典目录标识'))
        return
      }
      api.isExist({ code: this.form.data.code, id: this.form.data.id }).then(res => {
        if (res.data) {
          callback(new Error('字典目录标识已存在'))
        } else {
          callback()
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
          this.$notify({ title: '成功', message: '删除字典目录成功', type: 'success', duration: 2000 })
          this.getList()
        })
      })
    },
    refreshCache() {
      this.loading.refreshCache = true
      api.refreshCache().then(res => {
        this.$notify({ title: '成功', message: '刷新缓存成功', type: 'success', duration: 2000 })
        this.loading.refreshCache = false
      }).catch(() => {
        this.loading.refreshCache = false
      })
    },
    handleOpenDialogValListVisible(row) {
      this.table.currRow = row
      console.info(this.table.currRow)
      this.dialogValListVisible = true
    },
    handleFilter() {
      this.table.query.current = 1
      this.getList()
    }
  }

}
</script>

<style>

</style>
