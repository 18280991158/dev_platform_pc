<template>
  <div>
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="uploadAction"
      multiple
      :accept="accept"
      :limit="1"
      :on-success="handleUploadSuccess"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传mp4文件，且不超过2G</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: false
    },
    folder: {
      type: String,
      required: true
    },
    fieldName: {
      type: String,
      required: true
    },
    accept: {
      type: String,
      required: false,
      default: '.mp4'
    }
  },
  data() {
    return {
      uploadAction: this.$store.getters.fileServerUrl + '/upload?folder=/' + this.folder
    }
  },
  watch: {
    visible() {
      this.handleFileRemove()
    }
  },
  mounted() {
  },
  methods: {
    handleUploadSuccess(res) {
      if (res.code === 200) {
        this.formData[this.fieldName] = res.data
      } else {
        this.$notify.error({
          title: '错误',
          message: res.msg
        })
      }
    },
    handleFileRemove() {
      this.$refs.upload.clearFiles()
    }
  }

}
</script>

<style>

</style>
