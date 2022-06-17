<template>
  <div>
    <page-form ref="search" v-bind="searchFormConfig" :formHandler="formHandler" v-model="formData"> </page-form>
  </div>
</template>

<script>
import pageForm from '@/components/page-form'
export default {
  components: {
    pageForm,
  },
  props: {
    searchFormConfig: {
      type: Object,
      reuqired: true,
    },
    formHandler: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formOriginData: {},
      formData: {},
      bntClickEvent: {
        submit: 'searchData',
        reset: 'resetData',
        add: 'handleAdd',
        export: 'exportStudent',
      },
    }
  },
  created() {
    const formItems = this.searchFormConfig.form_item
    this.formOriginData = {}
    for (const item of formItems) {
      if (item.name) {
        this.formOriginData[item.name] = undefined
      } else {
        this.formOriginData.startTime = undefined
        this.formOriginData.endTime = undefined
      }
    }
    this.formData = JSON.parse(JSON.stringify(this.formOriginData))
  },
  methods: {
    resetData() {
      this.formData = this.formOriginData
    },
    searchData() {
      return this.formData
    },
  },
  watch: {},
}
</script>

<style lang="less"></style>
