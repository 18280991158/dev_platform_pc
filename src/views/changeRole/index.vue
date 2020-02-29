<template>
  <div class="app-container">
    <el-form label-width="100px">
      <el-form-item label="角色">
        <el-select v-model="selectRole">
          <el-option v-for="item in $store.getters.roles" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" :disabled="currRole === selectRole" type="primary" @click="setCurrRole">确定切换</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCurrRole, setCurrRole } from '@/api/user'
export default {
  data() {
    return {
      loading: false,
      currRole: null,
      selectRole: null
    }
  },
  mounted() {
    this.getCurrRole()
  },
  methods: {
    getCurrRole() {
      getCurrRole().then(res => {
        this.currRole = res.data
        this.selectRole = this.currRole
      })
    },
    setCurrRole() {
      this.loading = true
      setCurrRole({ role: this.selectRole }).then(res => {
        this.loading = false
        location.reload(true)
      }).then(res => {
        this.loading = false
      })
    }
  }

}
</script>

<style>

</style>
