<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="table.query.paramName" style="width: 200px;" placeholder="参数名称|键名" class="filter-item" />
      <el-button :loading="loading.getList" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <br>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
        创建
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="fas fa-trash-alt" @click="batchDel">
        删除
      </el-button>
      <el-button class="filter-item" :loading="loading.refreshCache" style="margin-left: 10px;" type="primary" icon="fas fa-sync-alt" @click="refreshCache">
        刷新缓存
      </el-button>
    </div>
    <el-table v-loading="loading.getList" :data="table.data" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="参数名称" prop="paramName" />
      <el-table-column label="参数键名" prop="paramKey" />
      <el-table-column label="键值类型">
        <template slot-scope="{row}">
          <dictionary v-if="paramTypes.length !== 0" :dictionary-item="paramTypes " :value="row.paramType" />
        </template>
      </el-table-column>
      <el-table-column label="参数键值" prop="paramValue" />
      <el-table-column label="备注" prop="remark" />
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

    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="20%">
      <el-form ref="form" label-position="top" :model="form.data" :rules="form.rules">
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="form.data.paramName" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="参数键名" prop="paramKey">
          <el-input v-model="form.data.paramKey" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="键值类型" prop="paramType">
          <el-select v-model="form.data.paramType" :disabled="dialogStatus === 'look'">
            <el-option v-for="item in paramTypes" :key="item.id" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.data.paramType === '1'" label="参数键值" prop="paramValue">
          <el-input v-model="form.data.paramValue" type="textarea" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item v-if="form.data.paramType === '2'" prop="paramValue">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadAction"
            with-credentials
            :on-success="handleUploadSuccess"
            multiple
            :limit="1"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.data.remark" type="textarea" :disabled="dialogStatus === 'look'" />
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
import * as api from '@/api/systemParameter'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'SystemParameter',
  components: {
    Pagination
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
          current: 1
        },
        total: 0
      },
      form: {
        defData: {
          id: undefined,
          paramName: '',
          paramKey: '',
          paramValue: null,
          paramType: null,
          remark: null
        },
        data: {
          id: undefined,
          paramName: '',
          paramKey: '',
          paramValue: null,
          paramType: null,
          remark: null
        },
        rules: {
          paramName: { required: true, message: '请输入参数名称', trigger: 'blur' },
          paramKey: { required: true, validator: this.validateParamKey, trigger: 'blur' },
          paramValue: { required: true, message: '请输入参数值', trigger: 'blur' },
          paramType: { required: true, message: '请选择键值类型', trigger: 'blur' }
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑系统参数',
        create: '创建系统参数',
        look: '查看系统参数'
      },
      multipleSelection: [],
      paramTypes: [],
      uploadAction: this.$store.getters.fileServerUrl + '/upload?folder=/systemParameter'
    }
  },
  mounted() {
    this.getList()
    this.getParamTypes()
  },
  methods: {
    validateParamKey(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入参数键名'))
        return
      }
      api.isExist({ paramKey: this.form.data.paramKey, id: this.form.data.id }).then(res => {
        if (res.data) {
          callback(new Error('参数键名已存在'))
        } else {
          callback()
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.loading.getList = true
      api.listPage(this.table.query).then(res => {
        this.loading.getList = false
        this.table.data = res.data.records
        this.table.total = res.data.total
      }).catch(() => {
        this.loading.getList = false
      })
    },
    handleFilter() {
      this.table.query.current = 1
      this.getList()
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
          this.$notify({ title: '成功', message: '删除系统参数成功', type: 'success', duration: 2000 })
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
    refreshCache() {
      this.loading.refreshCache = true
      api.refreshCache().then(() => {
        this.$notify({ title: '成功', message: '刷新缓存成功', type: 'success', duration: 2000 })
        this.loading.refreshCache = false
      }).catch(() => {
        this.loading.refreshCache = false
      })
    },
    getParamTypes() {
      this.$listDictionaryItem({ code: 'system_parameter_param_value_type' }).then(res => {
        this.paramTypes = res.data
      })
    },
    handleUploadSuccess(res) {
      if (res.code === 200) {
        this.form.data.paramValue = res.data
      } else {
        this.$notify.error({
          title: '错误',
          message: res.msg
        })
      }
    }

  }
}
</script>

<style>

</style>
