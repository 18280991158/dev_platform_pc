<template>
  <div>
    <div class="filter-container">
      <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
    </div>
    <el-tree ref="tree" :data="tree.data" :expand-on-click-node="expandOnClickNode" :filter-node-method="filterNode" :props="{label:'name'}" @node-click="handleNodeClick" />
  </div>
</template>

<script>
import * as api from '@/api/organization'
export default {
  name: 'OrganizationTree',
  props: {
    expandOnClickNode: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tree: {
        data: []
      },
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      api.list().then(res => {
        this.tree.data = res.data
        this.$emit('load-data', res.data)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.$emit('node-click', data)
    }
  }

}
</script>

<style>

</style>
