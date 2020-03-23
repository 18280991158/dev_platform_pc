<template>
  <div>
    <el-tree ref="tree" style="height:400px;overflow: auto" :data="tree.data" show-checkbox node-key="id" />
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
      }
    }
  },
  watch: {
    roleId() {
      this.listResourceIdByRole()
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
        this.$refs.tree.setCheckedKeys(res.data)
      })
    },
    getCheckedData() {
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      checkedNodes = checkedNodes.filter(item => item.type === 2)
      const data = []
      for (const node of checkedNodes) {
        data.push(node.id)
      }
      return data
    }
  }

}
</script>

<style>

</style>
