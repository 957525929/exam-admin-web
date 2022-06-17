<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="30%">
      <template slot="footer">
        <a-button @click="handlerCancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <div v-if="title == '生成账号'" style="display: flex; justify-content: space-between; margin-bottom: 20px">
        <span>所属学校：{{ formData.schoolName }}</span>
        <span>所属班级：{{ formData.name }}</span>
        <span>负责教师：{{ formData.teacherName }}</span>
      </div>
      <page-form
        ref="pageForm"
        :formItem="form_item_data"
        :formData="formData"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <template slot="year">
          <a-date-picker
            format="YYYY"
            mode="year"
            :open="open"
            @openChange="openChange"
            @panelChange="panelChange"
            v-model="formData.year"
            placeholder="请选择考核年份"
          />
        </template>
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
import { classApi } from '@/api/class'
import { paperApi } from '@/api/paper'
import { getAction } from '@/api/manage'
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
      form_item_data: [],
      copy_form_data: null,
      showRange: true,
      open: false,
      examData: null,
    }
  },
  mounted() {
    this.$store.dispatch('getTeacherList', {})
  },
  watch: {
    // 'formData.time': {
    //   handler(newValue) {
    //     this.showRange = newValue == '永久' ? false : true
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    '$store.state.common.schoolList'(newVal) {
      this.loadSearchData()
    },
    '$store.state.common.teacherList_modal'(newVal) {
      this.loadTeacherData()
    },
    'formData.school'(newVal, value) {
      this.$store.dispatch('getTeacherList', { id: newVal })
      if (value && newVal !== value) {
        this.formData.teacher = undefined
      }
    },
  },
  methods: {
    async add() {
      this.visible = true
      this.form_item_data = this.form_item.filter((item) => item.label != '指定试卷' && item.key != 'create')
      this.loadSearchData()
      // await this.reset()
    },
    async edit(record) {
      this.form_item_data = this.form_item.filter((item) => item.label != '指定试卷' && item.key != 'create')
      for (let key in this.formData) {
        if (record[key]) {
          this.formData[key] = record[key]
        }
      }
      this.$set(this.formData, 'school', record.schoolId)
      this.$set(this.formData, 'teacher', record.teacherId)
      this.formData.year = moment(record.year, 'YYYY')
      this.form_item.forEach((item) => {
        if (item.name == 'school' || item.name == 'teacher') this.$set(item, 'disabled', true)
      })
      this.formData.startValidDate = moment(formatDate(this.timeFilter(record.startValidTime), 'yyyy-MM-dd'))
      this.formData.endValidDate = moment(formatDate(this.timeFilter(record.endValidTime), 'yyyy-MM-dd'))
      this.formData.rangeTime = [this.formData.startValidDate, this.formData.endValidDate]
      this.copy_form_data = JSON.parse(JSON.stringify(this.formData))
      this.visible = true
    },
    create(record) {
      this.$store.dispatch('getClassList', { id: record.teacherId })
      console.log(record)
      // this.formData = { ...record }
      for (let key in record) {
        this.formData[key] = record[key]
      }
      this.formData.time = '自定义'
      // console.log('this.formData', this.formData)
      this.title = '生成账号'
      this.visible = true
      this.form_item_data = this.form_item.filter((item) => item.key == 'create')
    },
    async appoint(record) {
      this.formData.id = record.id
      if (record.paperVOS.length > 0) {
        record.paperVOS.forEach((item) => {
          this.formData.exam.push(item.paperId)
        })
        // this.$set(this.formData, 'exam', record.paperVOS[0].paperName)
      }
      this.examData = JSON.parse(JSON.stringify(this.formData.exam))
      this.getPaper(record)
      this.visible = true
    },
    getPaper(record) {
      let params = {
        pageNo: 1,
        pageSize: 999,
      }
      getAction('/api/paper', params).then((res) => {
        this.form_item_data = this.form_item.filter((item) => item.label == '指定试卷')
        this.form_item_data[0].option.splice(0)
        res.data.list.forEach((ele, index) => {
          let optionInfo = {
            label: ele.paperName,
            value: ele.paperId,
          }
          this.form_item_data[0].option.push(optionInfo)
        })
        console.log(this.formData.exam)
      })
    },
    async loadSearchData() {
      const data = this.form_item.filter((item) => item.label == '所属学校')
      data[0].option = this.$store.state.common.schoolList
    },
    async loadTeacherData() {
      const data = this.form_item.filter((item) => item.label == '负责教师')
      data[0].option = this.$store.state.common.teacherList_modal
    },
    timeFilter(dataStr, pattern = 'YYYY-MM-DD') {
      // console.log(dataStr, 'dataStr')
      ;(dataStr + '').length == 10 && (dataStr *= 1000)
      return dayjs(dataStr).format(pattern)
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
    reset() {
      this.$refs.pageForm.$refs.formRef.clearValidate()
      for (let key in this.formData) {
        this.formData[key] = ''
      }
      this.formData.school = undefined
      this.formData.teacher = undefined
      this.formData.year = undefined
      this.formData.rangeTime = []
      this.formData.exam = []
      this.formData.time = '自定义'
    },
    handlerCancel() {
      this.visible = false
      this.form_item.forEach((item) => {
        if (item.disabled) this.$set(item, 'disabled', false)
      })
      this.reset()
    },
    ok() {
      this.$refs.pageForm.$refs.formRef.validate((valid) => {
        if (valid) {
          switch (this.title) {
            case '新增':
              this.addModal()
              break
            case '编辑':
              this.editModal()
              break
            case '生成账号':
              this.createModal()
              break
            case '指定试卷':
              this.paperModal()
          }
        }
      })
    },
    async addModal() {
      const time = this.checkTime()
      if (!time) {
        return
      }
      this.confirmLoading = true
      let params = {
        accountNum: 0,
        name: this.formData.name,
        year: moment(this.formData.year).format('YYYY'),
        teacherId: this.formData.teacher,
        schoolId: this.formData.school,
        startValidDate: time.beginTime,
        endValidDate: time.endTime,
      }
      classApi
        .addClass(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('添加成功')
          }
          this.$emit('update-data')
          this.confirmLoading = false
        })
        .catch((e) => {
          this.confirmLoading = false
          console.log(e)
        })
      await this.handlerCancel()
    },
    async editModal() {
      const time = this.checkTime()
      if (!time) {
        return
      }
      if (JSON.stringify(this.formData) != JSON.stringify(this.copy_form_data)) {
        this.confirmLoading = true
        let params = {
          id: this.formData.id,
          name: this.formData.name,
          year: moment(this.formData.year).format('YYYY'),
          teacherId: this.formData.teacher,
          schoolId: this.formData.school,
          startValidDate: time.beginTime,
          endValidDate: time.endTime,
        }
        classApi
          .updateClass(params)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success('修改成功')
            }
            this.$emit('update-data')
            this.confirmLoading = false
          })
          .catch((e) => {
            this.confirmLoading = false
            console.log(e)
          })
      }
      await this.handlerCancel()
      // this.confirmLoading = false
    },
    async createModal() {
      let data = this.$store.state.common.classList_modal.find((item) => (item.label = this.formData.name))
      this.formData.classId = data.value
      let params = {
        accountNum: Number(this.formData.account),
        classId: this.formData.classId,
        schoolId: this.formData.schoolId,
        teacherId: this.formData.teacherId,
        accountFront: this.formData.accountFront,
      }
      console.log('params', params)
      classApi
        .addAccount(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('生成成功')
          }
          this.$emit('update-data')
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.confirmLoading = false
        })
      await this.handlerCancel()
    },
    async paperModal() {
      let params = {
        classId: this.formData.id,
        paperId: this.formData.exam,
      }
      if (JSON.stringify(this.formData.exam) == JSON.stringify(this.examData)) {
        await this.handlerCancel()
        return
      }
      paperApi
        .updatePaperRelate(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('指定成功')
            this.$emit('update-data')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.confirmLoading = false
        })
      await this.handlerCancel()
    },
    openChange(status) {
      if (status) {
        this.open = true
      } else {
        this.open = false
      }
    },
    panelChange(value) {
      this.formData.year = value
      this.open = false
    },
  },
}
</script>
