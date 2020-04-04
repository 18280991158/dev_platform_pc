<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>使用指南目录</span>
          </div>
          <div class="text item" style="height:915px;overflow: auto">
            <div class="filter-container">
              <el-select v-model="table.query.roleId" placeholder="角色" clearable class="filter-item" @change="getList">
                <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
              </el-select>
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
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>[{{ currRow === null ? '暂无':currRow.name }}]-使用指南内容</span>
          </div>
          <div v-if="showContent" class="text item">

            <el-form ref="form" label-position="top" :model="form.data" :rules="form.rules">

              <el-form-item label="目录名称">
                <el-input readonly :value="currRow.name" />
              </el-form-item>

              <el-form-item label="使用指南视频">
                <upload-video ref="uploadVideo" :form-data="form.data" folder="helpDescription" field-name="video" />
                <el-button v-if="form.data.video !== undefined" type="primary" icon="fas fa-play-circle" @click="dialogPreviewVisible = true">播放视频</el-button>
              </el-form-item>

              <el-form-item label="使用指南内容">
                <Tinymce ref="editor" v-model="form.data.content" :height="400" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
              </el-form-item>
            </el-form>

          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="20%">
      <el-form ref="form" label-position="top" :model="form.data" :rules="form.rules">
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="form.data.name" :disabled="dialogStatus === 'look'" />
        </el-form-item>
        <el-form-item label="上级目录" prop="parentId">
          <el-cascader v-model="form.selectParent" :disabled="dialogStatus === 'look'" clearable :options="table.data" :props="{checkStrictly: true,value:'id',label:'name'}" @change="handleSelectParentChange" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="dialogStatus === 'look'" :loading="loading.save" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="使用指南视频播放" :close-on-click-modal="false" :visible.sync="dialogPreviewVisible">
      <video v-if="dialogPreviewVisible" width="900px" controls :src="$store.getters.fileServerUrl+'/file/helpDescription/'+form.data.video" />
    </el-dialog>

  </div>
</template>

<script>
import * as api from '@/api/helpDescription'
import Tinymce from '@/components/Tinymce'
import { list as listRole } from '@/api/role'
import UploadVideo from '../../upload/uploadVideo'
export default {
  components: {
    Tinymce, UploadVideo
  },
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
          id: null,
          name: '',
          parentId: null,
          content: null,
          video: undefined

        },
        data: {
          id: null,
          name: '',
          parentId: null,
          content: null,
          video: undefined
        },
        rules: {
          name: { required: true, message: '请输入使用指南目录名称', trigger: 'blur' },
          parentId: { validator: this.validateParentId, trigger: 'blur' }
        },
        selectParent: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑使用指南目录',
        create: '创建指南目录',
        look: '查看使用指南目录',
        editContent: '编辑使用指南内容成功'
      },
      roles: [],
      currRow: null,
      dialogPreviewVisible: false,
      showContent: false

    }
  },
  mounted() {
    this.listRole()
  },
  methods: {
    getList() {
      this.loading.getList = true
      api.list({ roleId: this.table.query.roleId }).then(res => {
        this.loading.getList = false
        this.table.data = res.data
      }).catch(() => {
        this.loading.getList = false
      })
    },
    handleCreate() {
      Object.assign(this.form.data, this.form.defData)
      this.dialogStatus = 'create'
      this.form.selectParent = []
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleUpdate(row) {
      Object.assign(this.form.data, this.form.defData)
      Object.assign(this.form.data, row)

      this.form.selectParent = []

      api.listParents({ id: row.id, joinItself: false }).then(res => {
        this.form.selectParent = res.data
      })

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
          this.form.data.roleId = this.table.query.roleId
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
          this.$emit('delete')
          this.getList()
        })
      })
    },
    validateParentId(rule, value, callback) {
      if (this.form.selectParent.length === 0 || this.form.data.id === null) {
        callback()
        return
      }

      var filter = this.form.selectParent.filter(item => item === this.form.data.id)

      if (filter.length > 0) {
        callback(new Error('不能选择此上级类型'))
      }
    },
    handleSelectParentChange(val) {
      this.form.data.parentId = null
      if (val.length > 0) {
        this.form.data.parentId = val[val.length - 1]
      }
    },
    listRole() {
      listRole().then(res => {
        this.roles = res.data
        this.table.query.roleId = this.roles[0].id
        this.getList()
      })
    },
    handleCurrentChange(row) {
      if (this.$refs.uploadVideo !== undefined) {
        this.$refs.uploadVideo.handleFileRemove()
      }
      if (row.children === undefined) {
        this.currRow = row
        this.showContent = true
        this.dialogStatus = 'editContent'
        Object.assign(this.form.data, this.form.defData)
        Object.assign(this.form.data, row)
        this.$refs.editor.setContent(row.content)
      } else {
        this.showContent = false
      }
    }
  }

}
</script>

<style>

</style>
