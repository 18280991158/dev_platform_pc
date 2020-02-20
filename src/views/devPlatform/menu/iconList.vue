<template>
  <div class="icons-container">
    <div class="grid">
      <div v-for="item of svgIcons" :key="item">
        <div class="icon-item" @click="handleClick(item)">
          <svg-icon :icon-class="item.code" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/menuIcon'
export default {
  name: 'IconList',
  data() {
    return {
      svgIcons: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      api.list().then(res => {
        this.svgIcons = res.data
      })
    },
    handleClick(item) {
      this.$emit('confirm-select', item)
    }
  }

}
</script>

<style lang="scss" scoped>

.icons-container {
  background-color: silver;
  margin: 10px 20px 0;
  overflow: hidden;
  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }
  .disabled {
    pointer-events: none;
  }
}

</style>
