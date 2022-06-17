<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="33%">
      <template slot="footer">
        <a-button @click="handlerCancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <page-form
        ref="pageForm"
        :formItem="form_item_copy"
        :formData="formData"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <!-- <template slot="time" v-if="showRange">
          <a-row>
            <a-col :span="8"></a-col>
            <a-col :span="16"> <a-range-picker v-model="formData.rangeTime" /></a-col>
          </a-row>
        </template> -->
      </page-form>
    </a-modal>
  </div>
</template>

<script>
import * as dayjs from 'dayjs'
import moment from 'moment'
import pageForm from '@/components/page-form'
import { modalFormConfig } from './config/modal.config'
import { editDateForSearch } from '@/utils/util'
import { teacherApi } from '@/api/teacher.js'
import { formatDate } from '@/utils/util'
export default {
  components: {
    pageForm,
  },
  data() {
    return {
      //modalData
      ...modalFormConfig,
      confirmLoading: false,
      visible: false,
      title: '',
      showRange: true,
      formData_copy: {},
    }
  },
  mounted() {},
  watch: {
    'formData.time': {
      handler(newValue) {
        this.showRange = newValue == '永久' ? false : true
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    loadSearchData() {
      const data = this.form_item_copy.filter((item) => item.label == '所属学校')
      data[0].option = [...this.$store.state.common.schoolList]
      console.log('data', data)
    },
    async add() {
      this.form_item_copy = this.form_item
      this.loadSearchData()
      this.visible = true

      // await this.reset()
    },
    async edit(record) {
      for (let key in this.formData) {
        if (record[key]) {
          this.formData[key] = record[key]
        }
      }
      // this.formData = { ...record }
      // this.formData_copy = { ...record }
      // console.log('this.formData', this.formData)
      // this.formData.time = this.formData.time == '永久' ? '永久' : '自定义'
      this.form_item_copy = this.form_item.filter((item) => item.name != 'account')
      this.form_item.forEach(item => {
        if(item.name == 'schoolId') this.$set(item, 'disabled', true)
      })
      console.log(this.form_item)
      // this.form_item_copy = this.form_item.filter((item) => item.label != '有效期')
      this.loadSearchData()
      // this.formData.rangeTime = [this.formData.startTime, this.formData.endTime]

      // this.formData.startTime = record.startValidTime
      // this.formData.endTime = record.endValidTime
      this.formData.startValidDate = moment(formatDate(this.timeFilter(record.startValidTime), 'yyyy-MM-dd'))
      this.formData.endValidDate = moment(formatDate(this.timeFilter(record.endValidTime), 'yyyy-MM-dd'))
      this.formData.rangeTime = [this.formData.startValidDate, this.formData.endValidDate]
      this.formData_copy = JSON.parse(JSON.stringify(this.formData))
      this.visible = true
    },

    timeFilter(dataStr, pattern = 'YYYY-MM-DD') {
      // console.log(dataStr, 'dataStr')
      ;(dataStr + '').length == 10 && (dataStr *= 1000)
      return dayjs(dataStr).format(pattern)
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
      this.formData.time = '自定义'
      // this.formData.beginTime = undefined
      // this.formData.endTime = undefined
      this.formData.schoolId = undefined
      this.formData.rangeTime = []
    },
    async handlerCancel() {
      this.visible = false
      this.form_item.forEach(item => {
        if(item.disabled) this.$set(item, 'disabled', false)
      })
      await this.reset()
    },
    ok() {
      this.$refs.pageForm.$refs.formRef.validate((valid) => {
        if (valid) {
          this.title == '新增' ? this.addModal() : this.editModal()
        }
      })
    },
    checkTime() {
      // console.log('this.formData', this.formData.rangeTime)
      let time = {
        beginTime: this.formData.rangeTime[0],
        endTime: this.formData.rangeTime[1],
      }
      let isTimeTrue = editDateForSearch(time)
      if (!isTimeTrue) {
        this.$message.error('开始时间不能晚于结束时间！')
        return
      } else {
        return time
      }
    },
    async addModal() {
      const time = this.checkTime()
      if (!time) {
        return
      }
      let params = {
        account: this.formData.account,
        beginTime: time.beginTime,
        endTime: time.endTime,
        name: this.formData.name,
        phone: this.formData.phone,
        schoolId: this.formData.schoolId,
      }

      this.confirmLoading = true

      try {
        const res = await teacherApi.addTeacher(params)
        if (res.code == 200) {
          this.$message.success('新增成功')
          this.confirmLoading = false
          this.$emit('update')
          await this.handlerCancel()
        } else {
          // this.$message.error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
      this.confirmLoading = false
    },
    async editModal() {
      const time = this.checkTime()
      if (!time) {
        return
      }
      let params = {
        id: this.formData.id,
        name: this.formData.name,
        phone: this.formData.phone,
        schoolId: this.formData.schoolId,
        startValidDate: time.beginTime,
        endValidDate: time.endTime,
      }

      this.confirmLoading = true

      if (JSON.stringify(this.formData) != JSON.stringify(this.formData_copy)) {
        try {
          const res = await teacherApi.updateTeacher(params)
          if (res.code == 200) {
            this.$message.success('编辑成功')
            this.confirmLoading = false
            this.$emit('update')
            await this.handlerCancel()
          } else {
            // this.$message.error(res.message)
          }
        } catch (e) {
          console.log(e)
        }
      }
      this.form_item = this.form_item_copy
      this.confirmLoading = false
      await this.handlerCancel()
    },
  },
}
</script>

<style lang="scss" scoped></style>
