<template>
  <div>
    <!-- <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="25%"> -->
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel">
      <template slot="footer">
        <a-button @click="handlerCancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <page-form ref="pageForm" v-bind="modalFormConfig" v-model="formData" />
    </a-modal>
  </div>
</template>

<script>
import pageForm from '@/components/page-form'
import { modalFormConfig } from './config/modal.config'
import { schoolApi } from '@/api/school.js'
import { provinceArr } from '@/api/province'
import { message } from 'ant-design-vue'
export default {
  components: {
    pageForm,
  },
  data() {
    const { formData, formData_copy } = modalFormConfig
    return {
      //modalData
      modalFormConfig,
      confirmLoading: false,
      visible: false,
      title: '',
      formData,
      formData_copy,
    }
  },
  methods: {
    async add() {
      this.visible = true

      // await this.reset()
    },
    async edit(record) {
      console.log(record)
      this.formData = {
        id: record.id,
        province: record.province,
        schoolName: record.schoolName,
      }
      this.formData_copy = JSON.parse(JSON.stringify(this.formData))
      console.log('this.formData_copy', this.form_item)
      this.visible = true
    },
    async look(record) {
      this.visible = true
      this.formData = { ...record }
    },
    async reset() {
      this.$refs.pageForm.$refs.formRef.clearValidate()
      for (let key in this.formData) {
        this.formData[key] = ''
      }
      this.confirmLoading = false
    },
    async handlerCancel() {
      this.visible = false
      this.reset()
    },
    ok() {
      // console.log('this.$refs.pageSearch.$refs.form', this.$refs.pageForm.$refs.formRef)
      // return
      this.$refs.pageForm.$refs.formRef.validate((valid) => {
        if (valid) {
          this.title == '新增' ? this.addModal() : this.editModal()
        }
      })
    },
    async addModal() {
      this.confirmLoading = true
      // console.log(this.formData, 'this.formData')
      let params = { ...this.formData }

      schoolApi
        .addSchool(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('添加成功')
            this.$emit('update')
            this.handlerCancel()
          } else {
            // this.$message.error(res.message)
          }
        })
        .catch((e) => {
          this.confirmLoading = false
          console.log(e)
        })
      this.confirmLoading = false
    },
    async editModal() {
      // console.log(this.rowData)
      let params = {
        id: this.formData.id,
        province: this.formData.province,
        schoolName: this.formData.schoolName,
      }
      console.log(this.formData, this.formData_copy)
      if (JSON.stringify(this.formData) != JSON.stringify(this.formData_copy)) {
        schoolApi
          .updateSchool(params)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success('修改成功')
            }
            this.confirmLoading = false
            this.$emit('update')
            this.handlerCancel()
          })
          .catch((e) => {
            this.confirmLoading = false
            console.log(e)
          })
      }
      this.handlerCancel()
      this.confirmLoading = false
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
