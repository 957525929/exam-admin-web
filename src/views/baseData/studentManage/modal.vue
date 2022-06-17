<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="33%">
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
      >
        <template v-slot:footer>
          <a-alert
            v-if="title == '新增' && formData.teacher"
            :message="`当前账号可分配账号${15 + Number(formData.teacher)}个`"
            banner
          />
        </template>
        <template slot="time" v-if="showRange">
          <a-row>
            <a-col :span="8"></a-col>
            <a-col :span="16"> <a-range-picker v-model="formData.rangeTime" /></a-col>
          </a-row>
        </template>
      </page-search>
    </a-modal>
  </div>
</template>

<script>
import * as dayjs from 'dayjs'
import moment from 'moment'
import pageSearch from '@/components/page-form'
import { modalFormConfig } from './config/modal.config'
import { formatDate } from '@/utils/util'
import { studentApi } from '@/api/student'
import { editDateForSearch } from '@/utils/util'
import { isMobile } from '@/utils/validate.js'
let validatePass = (rule, value, callback) => {
  if (!value) {
    console.log('value', value)
    callback(new Error('请输入电话号码'))
  } else if (!isMobile(value)) {
    console.log('value', value)
    callback(new Error('请输入正确的电话号码格式'))
  } else {
    callback()
  }
}
export default {
  components: {
    pageSearch,
  },
  props: {
    getData: {
      type: Object
    }
  },
  data() {
    return {
      //modalData
      ...modalFormConfig,
      // form_item: [],
      confirmLoading: false,
      visible: false,
      form_data_copy: {},
      form_item_copy: [],
      title: '',
      showRange: false,
    }
  },
  mounted() {
    this.form_item_copy = JSON.parse(JSON.stringify(this.form_item))
  },
  watch: {
    'formData.time': {
      handler(newValue) {
        this.showRange = newValue == '永久' ? false : true
      },
      immediate: true,
      deep: true,
    },
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
      this.loadClassData()
    },
  },
  methods: {
    async add() {
      this.$store.dispatch('getClassList', {})
      if(this.getData.name) {
        this.formData.className = this.getData.name
        this.loadClassData()
      }
      this.visible = true
      this.loadModalData()
      // await this.reset()
    },
    loadModalData() {
      const data = {
        key: 2,
      }
      this.form_item = this.form_item.filter((item) => item.name != 'teacherId' && item.name != 'schoolId' && item.name != 'classId')
      this.loadSchoolData()
    },
    async edit(record) {
      console.log(record)
      for (let key in this.formData) {
        if (record[key]) {
          this.formData[key] = record[key]
        }
      }
      this.formData.number = record.studentNumber
      this.formData.startTime = record.startValidDate
      this.formData.endTime = record.endValidDate
      this.formData.id = record.id
      this.form_item = this.form_item.filter((item) => item.name != 'account'
      && item.name != 'teacherId' && item.name != 'schoolId' && item.name != 'classId')
      this.loadSchoolData()
      this.formData.startValidDate = moment(formatDate(this.timeFilter(this.formData.startTime), 'yyyy-MM-dd'))
      this.formData.endValidDate = moment(formatDate(this.timeFilter(this.formData.endTime), 'yyyy-MM-dd'))
      this.formData.rangeTime = [this.formData.startValidDate, this.formData.endValidDate]
      this.form_data_copy = JSON.parse(JSON.stringify(this.formData))
      this.visible = true
    },
    timeFilter(dataStr, pattern = 'YYYY-MM-DD') {
      ;(dataStr + '').length == 10 && (dataStr *= 1000)
      return dayjs(dataStr).format(pattern)
    },
    async look(record) {
      this.visible = true
      this.formData = { ...record }
    },
    reset() {
      this.$refs.pageSearch.$refs.formRef.clearValidate()
      for (let key in this.formData) {
        this.formData[key] = undefined
      }
      this.formData.time = '自定义'
      this.formData.rangeTime = []
    },
    handlerCancel() {
      this.visible = false
      this.reset()
      this.form_item = JSON.parse(JSON.stringify(this.form_item_copy))
      this.form_item.forEach(element => {
        if(element.label == '电话号码') {
          for(let val of element.validator) {
            this.$set(val, 'validator', validatePass)
          }
        }
      });
      // this.form_item = JSON.parse(JSON.stringify(modalFormConfig.form_items))
      console.log(this.form_item)
    },
    ok() {
      this.$refs.pageSearch.$refs.formRef.validate((valid) => {
        if (valid) {
          this.title == '新增' ? this.addModal() : this.editModal()
        }
      })
    },
    loadSchoolData() {
      // const data = this.form_item.filter((item) => item.label == '所属校区')
      // data[0].option = this.$store.state.common.schoolList
      if (this.formData.schoolName) {
        let data = this.$store.state.common.schoolList.filter(
          (item) => item.label == this.formData.schoolName
        )
        if(data) {
          this.formData.schoolId = [0].value
        }
        this.form_data_copy = JSON.parse(JSON.stringify(this.formData))
      }
    },
    loadTeacherData(newVal) {
      // const data1 = this.form_item.filter((item) => item.label == '负责教师')
      // data1 && data1.length > 0 && (data1[0].option = newVal)
      if (this.formData.teacherName) {
        let data = this.$store.state.common.teacherList_modal.filter(
          (item) => {
            return item.label == this.formData.teacherName
          }
        )
        if(data.length > 0) {
          this.formData.teacherId = data[0].value
        }
        this.form_data_copy = JSON.parse(JSON.stringify(this.formData))
      }
    },
    loadClassData() {
      if (this.formData.className) {
        let data = this.$store.state.common.classList_modal.find(
          (item) => {
            return item.label == this.formData.className
          }
        )
        if(data) {
          this.formData.classId = data.value
          this.form_data_copy = JSON.parse(JSON.stringify(this.formData))
        }
      }
    },
    checkTime() {
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
      // const time = this.checkTime()
      // if (!time) {
      //   return
      // }
      let params = {
        classId: this.formData.classId,
        name: this.formData.name,
        phone: this.formData.phone,
        account: this.formData.account,
        studentNumber: this.formData.number,
        schoolId: this.getData.schoolId,
        teacherId: this.getData.teacherId,
        // startValidDate: time.beginTime,
        // endValidDate: time.endTime,
      }
      if (JSON.stringify(this.formData) != JSON.stringify(this.form_data_copy)) {
        this.confirmLoading = true

        try {
          const res = await studentApi.addStudent(params)
          if (res.code == 200) {
            this.$message.success('新增成功')
            this.confirmLoading = false
            this.$emit('update-data')
            await this.handlerCancel()
          } else {
            // this.$message.error(res.message)
          }
        } catch (e) {
          console.log(e)
        }
        this.confirmLoading = false
      }
    },
    async editModal() {
      // const time = this.checkTime()
      // if (!time) {
      //   return
      // }
      let params = {
        id: this.formData.id,
        classId: this.formData.classId,
        name: this.formData.name,
        phone: this.formData.phone,
        studentNumber: this.formData.number,
        schoolId: this.formData.schoolId,
        teacherId: this.formData.teacherId,
        // startValidDate: time.beginTime,
        // endValidDate: time.endTime,
      }
      if (JSON.stringify(this.formData) != JSON.stringify(this.form_data_copy)) {
        this.confirmLoading = true

        try {
          const res = await studentApi.updateStudent(params)
          if (res.code == 200) {
            this.$emit('update-data')
            this.$message.success('编辑成功')
            this.confirmLoading = false
            this.$emit('update')
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
