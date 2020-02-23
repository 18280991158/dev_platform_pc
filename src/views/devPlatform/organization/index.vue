<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="table.query.name" style="width: 200px;" placeholder="机构名称|编码" class="filter-item" />
      <el-select v-model="table.query.type" placeholder="机构类型" clearable class="filter-item" @change="getList">
        <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.value" />
      </el-select>
      <el-button :loading="loading.getList" class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <br>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
        创建
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-file-import" @click="dialogImportVisible = true">
        导入
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-file-export" @click="exportExcel">
        导出
      </el-button>
    </div>
    <el-table v-loading="loading.getList" row-key="id" :data="table.data" border default-expand-all fit highlight-current-row style="width: 100%;">
      <el-table-column prop="name" label="机构名称" />
      <el-table-column label="机构类型">
        <template slot-scope="{row}">
          <dictionary v-if="types.length !== 0" :dictionary-item="types" :value="row.type" />
        </template>
      </el-table-column>
      <el-table-column prop="code" label="机构编码" />
      <el-table-column prop="orderNum" label="顺序" />
      <el-table-column prop="description" label="备注" />
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleLook(row)">
            查看
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.code === 'root'" disabled title="根组织机构不允许被删除" size="mini" type="danger">
            删除
          </el-button>
          <el-button v-else size="mini" type="danger" @click="del(row)">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="handleCreate(row)">
            新增子项
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="35%">
      <el-form ref="form" label-position="top" inline :model="form.data" :rules="form.rules">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="form.data.name" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="机构编码" prop="code">
          <el-input v-model="form.data.code" :disabled="dialogStatus === 'look'" :readonly="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="上级机构" :prop="form.data.code === 'root'?'':'parents'">
          <el-cascader v-model="form.data.parents" :disabled="dialogStatus === 'look'" clearable :options="table.data" :props="{checkStrictly: true,value:'id',label:'name'}" />
        </el-form-item>
        <el-form-item label="机构类型" prop="type">
          <el-select v-model="form.data.type" :disabled="dialogStatus === 'look'">
            <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.data.orderNum" :disabled="dialogStatus === 'look'" :value="1" :min="1" />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.data.description" :disabled="dialogStatus === 'look'" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="dialogStatus === 'look'" :loading="loading.save" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="导入机构列表" :visible.sync="dialogImportVisible" :close-on-click-modal="false" width="30%">
      <el-alert v-if="importErrMsg !== ''" :closable="false" :title="importErrMsg" type="error" />
      <el-upload
        ref="import_excel"
        class="upload-demo"
        drag
        :action="importAction"
        with-credentials
        multiple
        accept=".xlsx"
        :on-success="handleImportSuccess"
        :limit="1"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/organization'
export default {
  data() {
    return {
      loading: {
        getList: false,
        save: false
      },
      table: {
        data: [],
        query: {}
      },
      form: {
        defData: {
          id: undefined,
          name: '',
          code: '',
          type: '',
          description: null,
          level: null,
          parents: [],
          orderNum: null
        },
        data: {
          id: undefined,
          name: '',
          code: '',
          type: '',
          description: null,
          level: null,
          parents: [],
          orderNum: null
        },
        rules: {
          name: { required: true, message: '请输入机构名称', trigger: 'blur' },
          code: { required: true, validator: this.validateCode, trigger: 'blur' },
          type: { required: true, message: '请选择机构类型', trigger: 'blur' },
          parents: { required: true, message: '请选择上级机构', trigger: 'blur' }

        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑机构',
        create: '创建机构',
        look: '查看机构'
      },
      types: [],
      dialogImportVisible: false,
      importErrMsg: '',
      importAction: process.env.VUE_APP_BASE_API + '/organization/importExcel'
    }
  },
  mounted() {
    this.getList()
    this.getTypes()
  },
  methods: {
    getList() {
      this.loading.getList = true
      api.list(this.table.query).then(res => {
        this.loading.getList = false
        this.table.data = res.data
      }).catch(() => {
        this.loading.getList = false
      })
    },
    getTypes() {
      this.$listDictionaryItem({ code: 'organization_type' }).then(res => {
        this.types = res.data
      })
    },
    validateCode(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入机构编码'))
        return
      }
      api.isExist({ code: this.form.data.code, id: this.form.data.id }).then(res => {
        if (res.data) {
          callback(new Error('机构编码已存在'))
        } else {
          callback()
        }
      })
    },
    handleCreate(row) {
      Object.assign(this.form.data, this.form.defData)
      if (row !== undefined) {
        let parents = row.parents
        if (parents === undefined) {
          parents = []
        } else {
          parents = JSON.parse(parents)
        }
        parents.push(row.id)
        this.form.data.parents = parents
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
          this.$notify({ title: '成功', message: '删除机构成功', type: 'success', duration: 2000 })
          this.getList()
        })
      })
    },
    exportExcel() {
      window.open(process.env.VUE_APP_BASE_API + '/organization/exportExcel')
    },
    handleImportSuccess(res) {
      if (res.code === 200) {
        this.importErrMsg = ''
        this.dialogImportVisible = false
        this.$refs['import_excel'].clearFiles()
        this.$notify({ title: '成功', message: '导入机构成功', type: 'success', duration: 2000 })
        this.getList()
        this.parent = null
      } else {
        this.importErrMsg = res.msg
      }
    }

  }

}
</script>
