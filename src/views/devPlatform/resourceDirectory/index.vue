<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
        创建
      </el-button>
    </div>
    <el-table v-loading="loading.getList" row-key="id" :data="table.data" border default-expand-all fit highlight-current-row style="width: 100%;" @current-change="handleCurrentChange">
      <el-table-column prop="name" label="目录名称" />
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
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="20%">
      <el-form ref="form" label-position="top" :model="form.data" :rules="form.rules">
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="form.data.name" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="上级目录">
          <el-cascader v-model="form.data.parents" :disabled="dialogStatus === 'look'" clearable :options="table.data" :props="{checkStrictly: true,value:'id',label:'name'}" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="dialogStatus === 'look'" :loading="loading.save" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/resourceDirectory'
export default {
  name: 'ResourceDirectory',
  data() {
    return {
      loading: {
        getList: false,
        save: false
      },
      table: {
        data: []
      },
      form: {
        defData: {
          id: undefined,
          name: '',
          parents: []
        },
        data: {
          id: undefined,
          name: '',
          parents: []
        },
        rules: {
          name: { required: true, message: '请输入资源目录名称', trigger: 'blur' }
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑资源目录',
        create: '创建资源目录',
        look: '查看资源目录'
      }

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading.getList = true
      api.list().then(res => {
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
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.dialogFormVisible = true
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true
          const parents = this.form.data.parents
          if (parents.length !== 0) {
            this.form.data.parentId = parents[parents.length - 1]
          }
          this.form.data.parents = JSON.stringify(parents)
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
          this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 })
          this.$emit('delete')
          this.getList()
        })
      })
    },
    handleCurrentChange(row) {
      this.$emit('current-change', row)
    }
  }

}
</script>
