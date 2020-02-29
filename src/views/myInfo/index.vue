<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane label="个人信息">
        <el-form ref="infoForm" label-width="100px" :model="form.data" :rules="form.rules">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              :action="uploadAction"
              :show-file-list="false"
              accept=".jpeg,.gif"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img :src="$store.getters.fileServerUrl+'/file/avatar/'+$store.getters.avatar" class="avatar">
            </el-upload>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="form.data.userName" readonly />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.data.name" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.data.email" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.data.phoneNum" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading.save" type="primary" @click="save">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="second">
        <el-form ref="pwdForm" label-width="100px" :model="pwdForm.data" :rules="pwdForm.rules">
          <el-form-item label="原密码" prop="oldPwd">
            <el-input v-model="pwdForm.data.oldPwd" type="password" />
          </el-form-item>

          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="pwdForm.data.newPwd" type="password" />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input v-model="pwdForm.data.confirmPwd" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading.save" type="primary" @click="updatePwd">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as api from '@/api/user'
export default {
  data() {
    return {
      loading: {
        save: false
      },
      form: {
        data: {},
        rules: {
          name: { required: true, message: '请输入姓名', trigger: 'blur' }
        }
      },
      pwdForm: {
        defData: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        data: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        rules: {
          oldPwd: { required: true, message: '请输入原密码', trigger: 'blur' },
          newPwd: { required: true, message: '请输入新密码', trigger: 'blur' },
          confirmPwd: { required: true, validator: this.validateConfirmPwd, trigger: 'blur' }
        }
      },
      uploadAction: this.$store.getters.fileServerUrl + '/upload?folder=/avatar'
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      api.getInfo().then(res => {
        this.form.data = res.data
      })
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.form.data.avatar = res.data
        api.editMyAvatar({ avatar: res.data }).then(res => {
          this.form.data.avatar = res.data
          this.$store.dispatch('user/getInfo')
          this.$notify({ title: '成功', message: '上传头像成功', type: 'success', duration: 2000 })
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG和GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    save() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.loading.save = true
          api.editMyInfo(this.form.data).then(() => {
            this.loading.save = false
            this.$notify({ title: '成功', message: '修改个人信息成功', type: 'success', duration: 2000
            })
          }).catch(() => {
            this.loading.save = false
          })
        }
      })
    },
    validateConfirmPwd(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入确认密码'))
        return
      }
      console.info(value)
      if (value !== this.pwdForm.data.newPwd) {
        callback(new Error('两次密码输入不一致'))
      }
      callback()
    },
    updatePwd() {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          this.loading.save = true
          api.editMyPassword(this.pwdForm.data).then(() => {
            this.loading.save = false
            this.$notify({ title: '成功', message: '修改密码成功，下次登录生效', type: 'success', duration: 2000
            })
            Object.assign(this.pwdForm.data, this.pwdForm.defData)
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
