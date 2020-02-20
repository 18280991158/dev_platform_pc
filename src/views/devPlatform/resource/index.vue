<template>
  <div class="app-container" />
</template>

<script>
import * as api from '@/api/resource'
export default {
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
        total: 0
      },

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
        userName: { required: true, validator: this.validateUserName, trigger: 'blur' },
        name: { required: true, message: '请输入资源名称', trigger: 'blur' },
        status: { required: true, message: '请选择用户状态', trigger: 'blur' },
        roleIds: { required: true, message: '请选择角色', trigger: 'blur' }
      }
    }
  },
  mounted() {

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
    }
  }

}
</script>

<style>

</style>
