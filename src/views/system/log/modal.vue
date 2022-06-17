<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="25%">
      <template slot="footer">
        <a-button @click="handlerCancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <page-search
        ref="pageSearch"
        :formItem="form_item"
        :formData="formData"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      />
    </a-modal>
  </div>
</template>

<script>
import pageSearch from '@/components/page-form'
import { modalFormConfig } from './config/modal.config'
export default {
  components: {
    pageSearch,
  },
  data() {
    return {
      //modalData
      ...modalFormConfig,
      confirmLoading: false,
      visible: false,
      title: '',
    }
  },
  mounted() {},
  methods: {
    async add() {
      this.visible = true

      await this.reset()
    },
    async edit(record) {
      this.formData = { ...record }
      this.visible = true
    },
    async look(record) {
      this.visible = true
      this.formData = { ...record }
    },
    reset() {
      for (let key in this.formData) {
        this.formData[key] = ''
      }
      this.formData.school = undefined
    },
    handlerCancel() {
      this.visible = false
      this.reset()
    },
    ok() {
      this.$refs.pageSearch.$refs.form.validate((valid) => {
        if (valid) {
          this.title == '新增' ? this.addModal() : this.editModal()
        }
      })
    },
    async addModal() {
      // this.confirmLoading = true
      // let params = {
      //   parentNode: 'root',
      //   pid: 0,
      //   name: this.formData.name,
      //   nameEng: this.formData.eName,
      //   description: this.formData.description,
      // }
      // addScene(params)
      //   .then((res) => {
      //     if (res.code == 200) {
      //       this.$message.success('添加成功')
      //     }
      //     this.confirmLoading = false
      //     this.$emit('updateData', this.title, data)
      //   })
      //   .catch((e) => {
      //     this.confirmLoading = false
      //     console.log(e)
      //   })
      await this.handlerCancel()
    },
    async editModal() {
      // console.log(this.rowData)
      // this.confirmLoading = true
      // let params = {
      //   id: this.rowData.id,
      //   pathNodeId: this.rowData.pathNodeId,
      //   name: this.formData.name,
      //   description: this.formData.description,
      // }
      // if (this.rowData.name != this.formData.name || this.rowData.description != this.formData.description) {
      //   updateScene(params)
      //     .then((res) => {
      //       if (res.code == 200) {
      //         this.$message.success('修改成功')
      //       }
      //       this.confirmLoading = false
      //       this.$emit('updateData')
      //     })
      //     .catch((e) => {
      //       this.confirmLoading = false
      //       console.log(e)
      //     })
      // }
      await this.handlerCancel()
      // this.confirmLoading = false
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
