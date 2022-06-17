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
        <!-- <template v-slot:footer>
          <a-alert
            v-if="title == '新增' && formData.teacher"
            :message="`当前账号可分配账号${15 + Number(formData.teacher)}个`"
            banner
          />
        </template> -->
      </page-form>
    </a-modal>
  </div>
</template>

<script>
import * as dayjs from 'dayjs'
import pageForm from '@/components/page-form'
import moment from 'moment'
import { modalFormConfig } from './config/modal.config'
import { editDateForSearch } from '@/utils/util'
import { studentApi } from '@/api/student'
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
      showRange: false,
      form_item_copy: [],
      formData_copy: {},
    }
  },
  mounted() {},
  watch: {
    'formData.schoolId': {
      handler(newVal) {
        const data = {
          key: 2,
          id: newVal,
        }
        newVal && this.$store.dispatch('getTeacherList', data)
        // this.formData.classId = newVal
        this.formData.teacherId = undefined
        this.formData.classId = undefined
      },
    },
    'formData.teacherId': {
      handler(newVal) {
        const data = {
          key: 2,
          id: newVal,
        }
        newVal && this.$store.dispatch('getClassList', data)
        this.formData.classId = undefined
      },
    },
    '$store.state.common.teacherList_modal'(newVal) {
      this.loadTeacherData(newVal)
    },
    '$store.state.common.classList_modal'(newVal) {
      this.loadClassData(newVal)
    },
  },
  methods: {
    async add() {
      this.visible = true
      this.loadModalData()
      // await this.reset()
    },
    loadModalData() {
      const data = {
        key: 2,
      }
      this.form_item_copy = this.form_item
      this.loadSchoolData()
      this.$store.dispatch('getTeacherList', data)
      this.$store.dispatch('getClassList', data)
    },
    loadSchoolData() {
      const data = this.form_item_copy.filter((item) => item.label == '所属学校')
      data[0].option = this.$store.state.common.schoolList
      if (this.formData.schoolName) {
        this.formData.schoolId = this.$store.state.common.schoolList.filter(
          (item) => item.label == this.formData.schoolName
        )[0].value
        this.formData_copy = JSON.parse(JSON.stringify(this.formData))
      }
    },
    loadTeacherData(newVal) {
      const data1 = this.form_item_copy.filter((item) => item.label == '负责教师')
      data1 && data1.length > 0 && (data1[0].option = newVal)
      if (this.formData.teacherName) {
        let data = this.$store.state.common.teacherList_modal.filter(
          (item) => {
            return item.label == this.formData.teacherName
          }
        )
        if(data.length > 0) {
          this.formData.teacherId = data[0].value
        }
        this.formData_copy = JSON.parse(JSON.stringify(this.formData))
      }
    },
    loadClassData(newVal) {
      const data2 = this.form_item_copy.filter((item) => item.label == '所属班级')
      data2 && data2.length > 0 && (data2[0].option = newVal)
      if (this.formData.className) {
        let data = this.formData.classId = this.$store.state.common.classList_modal.filter(
          (item) => {
            return item.label == this.formData.className
          }
        )
        if(data.length > 0) {
          this.formData.classId = data[0].value
        }
        this.formData_copy = JSON.parse(JSON.stringify(this.formData))
      }
    },
    async edit(record) {
      for (let key in this.formData) {
        if (record[key]) {
          this.formData[key] = record[key]
        }
      }
      this.formData.startTime = record.startValidDate
      this.formData.endTime = record.endValidDate
      // this.loadModalData()
      this.form_item_copy = this.form_item.filter((item) => item.name != 'account')
      this.form_item.forEach(item => {
        if(item.label == '所属学校' || item.label == '负责教师' || item.label == '所属班级') {
          this.$set(item, 'disabled', true)
        }
      })
      this.loadSchoolData()
      this.formData.startValidDate = moment(formatDate(this.timeFilter(this.formData.startTime), 'yyyy-MM-dd'))
      this.formData.endValidDate = moment(formatDate(this.timeFilter(this.formData.endTime), 'yyyy-MM-dd'))
      this.formData.rangeTime = [this.formData.startValidDate, this.formData.endValidDate]
      console.log('this.formData', this.formData)
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
        this.formData[key] = undefined
      }
      // this.formData.time = '自定义'
      this.formData.rangeTime = []
    },
    async handlerCancel() {
      this.visible = false
      this.form_item.forEach(item => {
        if(item.disabled) this.$set(item, 'disabled', false)
      })
      this.reset()
    },
    ok() {
      this.$refs.pageForm.$refs.formRef.validate((valid) => {
        if (valid) {
          this.title == '新增' ? this.addModal() : this.editModal()
        }
      })
    },
    checkTime() {
      console.log('this.formData', this.formData.rangeTime)
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
        classId: this.formData.classId,
        name: this.formData.name,
        phone: this.formData.phone,
        schoolId: this.formData.schoolId,
        studentNumber: this.formData.studentNumber,
        teacherId: this.formData.teacherId,
        startValidDate: time.beginTime,
        endValidDate: time.endTime,
      }

      this.confirmLoading = true

      try {
        const res = await studentApi.addStudent(params)
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
        classId: this.formData.classId,
        name: this.formData.name,
        phone: this.formData.phone,
        studentNumber: this.formData.studentNumber,
        schoolId: this.formData.schoolId,
        teacherId: this.formData.teacherId,
        // startValidDate: time.beginTime,
        // endValidDate: time.endTime,
      }

      if (JSON.stringify(this.formData) != JSON.stringify(this.formData_copy)) {
        this.confirmLoading = true

        try {
          const res = await studentApi.updateStudent(params)
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
        this.confirmLoading = false
      }
      await this.handlerCancel()
    },
  },
}
</script>

<style lang="scss" scoped></style>
