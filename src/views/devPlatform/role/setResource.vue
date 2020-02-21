<template>
  <div>
    <el-tree ref="tree" :data="tree.data" show-checkbox node-key="id" :default-checked-keys="checkedData" @check-change="handleCheckChange" />
  </div>
</template>

<script>
import * as api from '@/api/resourceDirectory'
import { listResourceIdByRole } from '@/api/resource'
export default {
  name: 'SetResource',
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
      this.listResource()
    }
  },
  mounted() {
    this.getList()
    this.listResourceIdByRole()
  },
  methods: {
    getList() {
      api.listTree().then(res => {
        this.tree.data = res.data
      })
    },
    listResourceIdByRole() {
      listResourceIdByRole({ roleId: this.roleId }).then(res => {
        this.checkedData = res.data
      })
    },
    getCheckedData() {
      return this.checkedData
    },
    handleCheckChange(data, checked, childCheck) {
      if (data.type === 1) {
        return
      }
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
