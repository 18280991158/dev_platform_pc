<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane label="个人信息">
        <el-form ref="form" label-width="100px" :model="form.data" :rules="form.rules">
          <el-form-item label="用户名">
            <el-input v-model="form.data.userName" readonly />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.data.name" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.data.email" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.data.email" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        data: {},
        rules: {}
      }
    }
  }

}
</script>

<style>

</style>
