<template>
  <span>{{ label }}</span>
</template>

<script>
export default {
  name: 'Index',
  props: {
    dictionaryItem: {
      required: true,
      type: Array
    },
    value: {
      required: true,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      label: ''
    }
  },
  watch: {
    value() {
      this.getLabel()
    }
  },
  mounted() {
    this.getLabel()
  },
  methods: {
    getLabel() {
      const filters = this.dictionaryItem.filter(item => item.value === this.value)
      if (filters.length !== 0) {
        this.label = filters[0].name
      }
    }
  }
}
</script>

<style scoped>

</style>
