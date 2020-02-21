<template>
  <div>
    <el-tree ref="tree" :data="tree.data" show-checkbox node-key="id" :default-checked-keys="checkedData" :props="{label:'metaTitle'}" @check-change="handleCheckChange" />
  </div>
</template>

<script>
import * as api from '@/api/menu'

export default {
  name: 'SetMenu',
  props: {
    roleId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      tree: {
        data: []
      },
      checkedData: []

    }
  },
  watch: {
    roleId() {
      this.listMenuIdByRole()
    }
  },
  mounted() {
    this.getList()
    this.listMenuIdByRole()
  },
  methods: {
    getList() {
      api.list().then(res => {
        this.tree.data = res.data
      })
    },
    listMenuIdByRole() {
      api.listMenuIdByRole({ roleId: this.roleId }).then(res => {
        this.checkedData = res.data
      })
    },
    getCheckedData() {
      return this.checkedData
    },
    handleCheckChange(data, checked, childCheck) {
      const index = this.checkedData.indexOf(data.id)
      if (index === -1 && checked) {
        this.checkedData.push(data.id)
      }
      if (index !== -1 && !checked) {
        this.checkedData.splice(index, 1)
      }
    }
  }

}
</script>

<style>

</style>
