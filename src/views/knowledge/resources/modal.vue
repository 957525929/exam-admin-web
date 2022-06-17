<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="25%">
      <template slot="footer">
        <a-button @click="handlerCancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <page-form
        ref="pageForm"
        :formItem="form_item"
        :formData="formData"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      />
    </a-modal>
  </div>
</template>

<script>
import pageForm from '@/components/page-form'
import { modalFormConfig } from './config/modal.config'
import { konwApi } from '@/api/know'
export default {
  components: {
    pageForm,
  },
  props: ['getData'],
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

      // await this.reset()
    },
    async edit(record) {
      this.formData = { ...record }
      this.defaultData = { ...record }
      this.visible = true
    },
    async look(record) {
      this.visible = true
      this.formData = { ...record }
    },
    reset() {
      this.$refs.pageForm.$refs.formRef.clearValidate()
      for (let key in this.formData) {
        this.formData[key] = ''
      }
    },
    handlerCancel() {
      this.visible = false
      this.reset()
    },
    ok() {
      this.$refs.pageForm.$refs.formRef.validate((valid) => {
        if (valid) {
          this.title == '新增' ? this.addModal() : this.editModal()
        }
      })
    },
    async addModal() {
      this.confirmLoading = true
      const params = {
        unitName: this.formData.unitName,
        parentId: this.getData.key,
      }

      konwApi
        .addKnow(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('添加成功')
            this.$emit('update')
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((e) => {
          this.confirmLoading = false
          console.log(e)
        })
      this.confirmLoading = false
      await this.handlerCancel()
    },
    async editModal() {
      const params = {
        unitName: this.formData.unitName,
        unitId: this.formData.unitId,
      }
      if (this.defaultData.unitName == this.formData.unitName) {
        await this.handlerCancel()
        return
      }
      konwApi
        .updateKnow(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('编辑成功')
            this.$emit('update')
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((e) => {
          this.confirmLoading = false
          console.log(e)
        })
      this.confirmLoading = false
      await this.handlerCancel()
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
