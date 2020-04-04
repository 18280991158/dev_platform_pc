<template>
  <div>
    <svg-icon icon-class="tutorial" @click="drawer = true" />
    <el-drawer title="使用指南" :visible.sync="drawer">
      <div style="margin-left: 30px;">
        <div v-if="tree.currData!== null && drawer">
          <video width="530px" controls :src="$store.getters.fileServerUrl+'/file/HelpDescription/'+tree.currData.video" />

          <b>{{ tree.currData.name }}</b>
          <div v-html="tree.currData.content" />

        </div>

        <el-divider />
        <el-tree :data="tree.data" accordion :props="{label:'name'}" @node-click="handleNodeClick" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import * as api from '@/api/helpDescription'
export default {
  data() {
    return {
      drawer: false,
      tree: {
        data: [],
        currData: null
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      api.list({ roleId: this.$store.getters.currRole.id }).then(res => {
        this.tree.data = res.data
      })
    },
    handleNodeClick(data) {
      if (data.children === undefined) {
        this.tree.currData = data
      }
    }
  }
}
</script>

<style>

</style>
