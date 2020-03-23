<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>资源目录</span>
          </div>
          <div class="text item">
            <resource-directory @current-change="handleDictionaryChange" @delete="handleDirectoryDelete" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>[{{ currDirectory.name === undefined ? '暂无':currDirectory.name }}]资源列表</span>
          </div>
          <div class="text item">
            <div class="filter-container">
              <el-input v-model="table.query.name" style="width: 200px;" placeholder="资源名称|URL" class="filter-item" />
              <el-select v-model="table.query.filterType" placeholder="拦截类型" clearable class="filter-item" @change="handleFilter">
                <el-option v-for="item in filterTypes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
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
              <el-table-column label="资源名称" prop="name" />
              <el-table-column label="url" prop="url" />
              <el-table-column label="拦截方式">
                <template slot-scope="{row}">
                  <dictionary v-if="filterTypes.length !== 0" :dictionary-item="filterTypes " :value="row.filterType" />
                </template>
              </el-table-column>
              <el-table-column label="顺序" prop="orderNum" />
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

    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="35%">
      <el-form ref="form" label-position="top" inline :model="form.data" :rules="form.rules">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="form.data.name" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="资源目录">
          <el-input v-model="currDirectory.name" readonly :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="url" prop="url">
          <el-input v-model="form.data.url" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="拦截方式" prop="filterType">
          <el-select v-model="form.data.filterType" :disabled="dialogStatus === 'look'">
            <el-option v-for="item in filterTypes" :key="item.id" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="顺序" prop="orderNum">
          <el-input-number v-model="form.data.orderNum" :disabled="dialogStatus === 'look'" :value="1" :min="1" />
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
import * as api from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ResourceDirectory from '../resourceDirectory'
export default {
  components: {
    ResourceDirectory, Pagination
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
        },
        total: 0
      },
      form: {
        defData: {
          id: undefined,
          name: '',
          url: '',
          resourceDirectoryId: null,
          filterType: null
        },
        data: {
          id: undefined,
          name: '',
          url: '',
          resourceDirectoryId: null,
          filterType: null
        },
        rules: {
          url: { required: true, validator: this.validateUrl, trigger: 'blur' },
          name: { required: true, message: '请输入资源名称', trigger: 'blur' },
          resourceDirectoryId: { required: true, message: '请选择资源目录', trigger: 'blur' },
          filterType: { required: true, message: '请选择资源拦截方式', trigger: 'blur' }
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑资源',
        create: '创建资源',
        look: '查看资源'
      },
      currDirectory: {},
      filterTypes: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.getFilterTypes()
  },
  methods: {
    validateUrl(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入资源URL'))
        return
      }
      api.isExist({ url: this.form.data.url, id: this.form.data.id }).then(res => {
        if (res.data) {
          callback(new Error('资源URL已存在'))
        } else {
          callback()
        }
      })
    },
    handleDictionaryChange(row) {
      this.currDirectory = row
      this.table.query.resourceDirectoryId = this.currDirectory.id
      this.table.query.name = ''
      this.table.filterType = ''
      this.table.query.current = 1
      this.getList()
    },
    getFilterTypes() {
      this.$listDictionaryItem({ code: 'resource_filter_type' }).then(res => {
        this.filterTypes = res.data
      })
    },
    getList() {
      this.table.getList = true
      api.list(this.table.query).then(res => {
        this.table.getList = false
        this.table.data = res.data.records
        this.table.total = res.data.total
      }).catch(() => {
        this.table.getList = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    handleLook(row) {
      Object.assign(this.form.data, this.form.defData)
      Object.assign(this.form.data, row)
      this.dialogStatus = 'look'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true
          this.form.data.resourceDirectoryId = this.currDirectory.id
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
    del(ids) {
      this.$confirm('你确定要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.del(ids).then(() => {
          this.$notify({ title: '成功', message: '删除资源成功', type: 'success', duration: 2000 })
          this.getList()
        })
      })
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
    handleFilter() {
      this.table.query.current = 1
      this.getList()
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
