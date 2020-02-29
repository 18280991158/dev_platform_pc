<template>
  <div>
    <el-tree ref="tree" style="height:400px;overflow: auto" :data="tree.data" show-checkbox node-key="id" :props="{label:'metaTitle'}">
      <span slot-scope="{ node,data}" class="custom-tree-node">
        <span>{{ node.label+(data.component === undefined?'': '-'+data.component) }}</span>
      </span>
    </el-tree>
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
      }

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
        this.$refs.tree.setCheckedKeys(res.data)
      })
    },
    getCheckedData() {
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      checkedNodes = checkedNodes.filter(item => item.children === undefined)
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
