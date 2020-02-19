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
      type: String
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
      if (this.value !== '' && this.value !== undefined && this.dataDictionarys.length !== 0) {
        this.label = this.dataDictionarys.filter(item => item.value === this.value)[0].label
      }
    }
  }
}
</script>

<style scoped>

</style>
