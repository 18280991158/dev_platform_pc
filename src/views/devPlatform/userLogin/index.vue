<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="table.query.userName" style="width: 200px;" placeholder="用户名" class="filter-item" />
      <el-select v-model="table.query.loginType" placeholder="登录类型" clearable class="filter-item" @change="handleFilter">
        <el-option v-for="item in loginTypes" :key="item.id" :label="item.name" :value="item.value" />
      </el-select>
      <el-select v-model="table.query.loginStatus" placeholder="登录状态" clearable class="filter-item" @change="handleFilter">
        <el-option v-for="item in loginStatusData" :key="item.id" :label="item.name" :value="item.value" />
      </el-select>
      <el-button :loading="loading.getList" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table v-loading="loading.getList" :data="table.data" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="登录用户名" prop="userName" />
      <el-table-column label="登录时间" prop="loginTime" />
      <el-table-column label="登录类型">
        <template slot-scope="{row}">
          <dictionary v-if="loginTypes.length !== 0" :dictionary-item="loginTypes " :value="row.loginType" />
        </template>
      </el-table-column>
      <el-table-column label="登录状态">
        <template slot-scope="{row}">
          <dictionary v-if="loginStatusData.length !== 0" :dictionary-item="loginStatusData " :value="row.loginStatus" />
        </template>
      </el-table-column>
      <el-table-column label="登录IP" prop="loginIp" />
      <el-table-column label="浏览器" prop="loginBrowser" />
      <el-table-column label="登陆信息" prop="loginRemark" />
      <el-table-column label="登陆UA" prop="loginUa" />
    </el-table>
    <pagination v-show="table.total>0" :total="table.total" :page.sync="table.query.current" :limit.sync="table.query.size" @pagination="getList" />

  </div>
</template>

<script>
import * as api from '@/api/userLogin'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: {
    Pagination
  },
  data() {
    return {
      loading: {
        getList: false
      },
      table: {
        data: [],
        query: {
          size: 10,
          current: 1
        },
        total: 0
      },
      loginTypes: [],
      loginStatusData: []
    }
  },
  mounted() {
    this.getList()
    this.getloginTypes()
    this.getLoginStatusData()
  },
  methods: {
    getList() {
      this.table.getList = true
      api.listPage(this.table.query).then(res => {
        this.table.getList = false
        this.table.data = res.data.records
        this.table.total = res.data.total
      }).catch(() => {
        this.table.getList = false
      })
    },
    handleFilter() {
      this.table.query.current = 1
      this.getList()
    },
    getloginTypes() {
      this.$listDictionaryItem({ code: 'login_type' }).then(res => {
        this.loginTypes = res.data
      })
    },
    getLoginStatusData() {
      this.$listDictionaryItem({ code: 'login_status' }).then(res => {
        this.loginStatusData = res.data
      })
    }

  }

}
</script>

<style>

</style>
