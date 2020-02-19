<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="table.filterType" style="width: 120px" class="filter-item">
        <el-option v-for="item in filterTypes" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="table.filterValue" style="width: 200px;" placeholder="请输入你要搜索的内容" class="filter-item" />
      <el-select v-model="table.query.roleId" placeholder="用户角色" clearable class="filter-item" @change="handleFilter">
        <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
      </el-select>
      <el-select v-model="table.query.status" placeholder="用户状态" clearable class="filter-item" @change="handleFilter">
        <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.value" />
      </el-select>
      <el-select v-model="table.query.locke" placeholder="是否锁定" clearable class="filter-item" @change="handleFilter">
        <el-option v-for="item in lockes" :key="item.id" :label="item.name" :value="item.value" />
      </el-select>
      <el-button v-waves :loading="loading.getList" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <br>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="fas fa-plus" @click="handleCreate">
        创建用户
      </el-button>
    </div>
    <el-table v-loading="loading.getList" :data="table.data" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" :selectable="checkSelectable" width="55" />
      <el-table-column label="头像" width="70">
        <template slot-scope="{row}">
          <img :src="$store.getters.fileServerUrl+'/avatar/'+row.avatar" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="userName" />
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="电话" prop="phone" />
      <el-table-column label="是否锁定">
        <template slot-scope="{row}">
          <dictionary v-if="lockes.length !== 0" :dictionary-item="lockes " :value="row.locke" />
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <dictionary v-if="statusList.length !== 0" :dictionary-item="statusList " :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="有效时间" prop="expirationDate" />
      <el-table-column label="所属角色">
        <template slot-scope="{row}">
          <p v-for="item in row.roles" :key="item.id">{{ item.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button :disabled="$store.getters.id === row.id" :title="$store.getters.id === row.id?'不能编辑自己':''" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button :disabled="$store.getters.id === row.id" :title="$store.getters.id === row.id?'不能删除自己':''" size="mini" type="danger" @click="del(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="table.total>0" :total="table.total" :page.sync="table.query.current" :limit.sync="table.query.size" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="form" label-position="top" inline :model="form.data" :rules="form.rules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.data.userName" style="width: 300px" :readonly="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="姓名" style="width: 300px" prop="name">
          <el-input v-model="form.data.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.data.email" style="width: 300px" />
        </el-form-item>
        <el-form-item label="电话" prop="phoneNum">
          <el-input v-model="form.data.phoneNum" style="width: 300px" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.data.status" style="width: 300px">
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号有效期" prop="expirationDate">
          <el-date-picker v-model="form.data.expirationDate" style="width: 300px" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" />
        </el-form-item>
        <el-form-item label="所属角色">
          <el-checkbox-group v-model="form.selectRole">
            <el-checkbox v-for="item in roles" :key="item.id" :value="item.id" :label="item.name" name="type" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading.save" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/user'
import { list as listRole } from '@/api/role'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
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
          current: 1,
          selectRole: true
        },
        total: 0,
        filterType: 'userName',
        filterValue: ''
      },
      filterTypes: [
        { label: '按用户名', value: 'userName' },
        { label: '按姓名', value: 'name' },
        { label: '按邮箱', value: 'email' },
        { label: '按手机', value: 'phone' }
      ],
      form: {
        defData: {
          id: undefined,
          userName: '',
          avatar: '',
          name: '',
          email: '',
          phoneNum: '',
          locke: '',
          status: '',
          expirationDate: ''
        },
        data: {
          id: undefined,
          userName: '',
          avatar: '',
          name: '',
          email: '',
          phoneNum: '',
          locke: '',
          status: '',
          expirationDate: ''
        },
        rules: {
          name: { required: true, message: '请输入用户姓名', trigger: 'blur' },
          code: { required: true, message: '请输入角色标识', trigger: 'blur' }
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '创建用户'
      },
      lockes: [],
      statusList: [],
      roles: []
    }
  },
  mounted() {
    this.getList()
    this.getLockes()
    this.getStatusList()
    this.getRoles()
  },
  methods: {
    getList() {
      this.loading.getList = true
      for (const filterType of this.filterTypes) {
        this.table.query[filterType.value] = undefined
      }
      this.table.query[this.table.filterType] = this.table.filterValue
      api.listPage(this.table.query).then(res => {
        this.loading.getList = false
        this.table.data = res.data.records
        this.table.total = res.data.total
      }).catch(() => {
        this.loading.getList = false
      })
    },
    getLockes() {
      this.$listDictionaryItem({ code: 'account_locke' }).then(res => {
        this.lockes = res.data
      })
    },
    getStatusList() {
      this.$listDictionaryItem({ code: 'account_state' }).then(res => {
        this.statusList = res.data
      })
    },
    checkSelectable(row) {
      return this.$store.getters.id !== row.id
    },
    getRoles() {
      listRole().then(res => {
        this.roles = res.data
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
    }
  }

}
</script>

<style scoped>
  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

 .el-form .el-input{
    width:300px
  }
 .el-form .el-select{
    width:300px
  }
</style>
