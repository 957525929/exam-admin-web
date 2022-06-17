<template>
  <div>
    <a-card title="班级管理">
      <!-- 查询功能 -->
      <page-search ref="search" :searchFormConfig="searchFormConfig" :formHandler="form_handler">
        <template slot="year">
          <a-date-picker
            format="YYYY"
            mode="year"
            :open="open"
            @openChange="openChange"
            @panelChange="panelChange"
            v-model="form_data.year"
            placeholder="请选择年份"
          />
        </template>
        <template slot="import">
          <a-button style="margin-right: 10px" @click="downloadTemplate"> 模板下载 </a-button>
        </template>
      </page-search>
      <!-- 表格 -->
      <br />
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="{
          total: ipagination.total,
          current: ipagination.current,
          pageSize: 6,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        }"
        @change="handleTableChange"
        :loading="loading"
      >
        <template slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-upload :showUploadList="false" :customRequest="imgRequest">
            <a @click="setRecord(record)">导入学生</a>
          </a-upload>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item key="1">
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item key="2">
                <a @click="goToCreate(record)">生成账号</a>
              </a-menu-item>
              <a-menu-item key="3">
                <a @click="handleAppoint(record)">指定试卷</a>
              </a-menu-item>
              <a-menu-item key="4">
                <a @click="goToDetail(record)">查看学生</a>
              </a-menu-item>
              <a-menu-item key="5">
                <a @click="exportStudent(record)">导出学生</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(index) + 1 }}
        </template>
        <template slot="exam" slot-scope="text, record">
          <j-ellipsis
            :value="(record.paperVOS.length > 0 && record.paperVOS.map((item) => item.paperName).join('、')) || '暂无'"
            :length="10"
          />
        </template>
        <template slot="time" slot-scope="text, record">
          {{ record.startValidTime | dayjsYMD }}~{{ record.endValidTime | dayjsYMD }}
        </template>
        <template slot="createTime" slot-scope="text">
          {{ text | dayjs }}
        </template>
      </a-table>
      <modal ref="modalForm" @update-data="loadData" />
    </a-card>
  </div>
</template>

<script>
import pageSearch from '@/components/page-search'
import modal from './modal.vue'
import JEllipsis from '@/components/jeecg/JEllipsis'
import * as dayjs from 'dayjs'
import { editDateForSearchCopy } from '@/utils/util'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { studentApi } from '@/api/student'
import { export2Excel } from '@/assets/Excel/excelexport'
import { getAction } from '@/api/manage'

export default {
  mixins: [JeecgListMixin],
  components: {
    pageSearch,
    modal,
    JEllipsis,
  },
  data() {
    const { form_data } = searchFormConfig
    return {
      // 查询
      searchFormConfig,
      form_handler: [
        {
          type: 'primary',
          label: '查询',
          key: 'submit',
          loading: this.loading,
          handler: () => this.searchData(),
        },
        {
          label: '重置',
          handler: () => this.resetData(),
        },
        {
          label: '新增',
          key: 'add',
          handler: () => this.handleAdd(),
        },
        {
          type: 'slot',
          slotName: 'import',
        },
        // { type: 'dashed', label: '导入班级', key: 'import', handler: () => this.goToImport() },
      ],
      // 表格
      ...contentTableConfig,
      record: null,
      getData: undefined,
      form_data_copy: null,
      open: false,
      //mixin
      url: {
        list: '/api/learnClass',
        delete: '/api/learnClass/',
      },
      form_data,
    }
  },
  mounted() {
    for (const key in this.form_data) {
      this.form_data[key] = undefined
    }
    this.form_data.schoolId = ' '
    this.form_data.teacherId = ' '
    // this.form_data_copy = JSON.parse(JSON.stringify(this.form_data))
    // const data = {
    //   key: 1,
    // }
    // this.getData = this.$route.params
    // this.$store.dispatch('getSchoolList')
    // if (Object.keys(this.getData).length == 0) {
    //   this.$store.dispatch('getTeacherList', data)
    // } else {
    //   this.loadRouteData(this.getData)
    // }

    // this.loadSearchData()
  },
  watch: {
    '$store.state.common.schoolList'(newVal) {
      this.loadSearchData()
    },
    '$store.state.common.teacherList_search'(newVal) {
      this.loadTeacherData()
    },
    'form_data.schoolId'(newVal, value) {
      const data = {
        key: 1,
        id: newVal,
      }
      if (newVal) this.$store.dispatch('getTeacherList', data)
      else this.$store.dispatch('getTeacherList', { key: 1 })
      this.form_data.teacherId = ' '
    },
  },
  methods: {
    async loadSearchData() {
      const data = this.form_item.filter((item) => item.label == '所属学校')
      const list = [
        {
          label: '全部',
          value: ' ',
        },
      ]
      data[0].option = [...list, ...this.$store.state.common.schoolList]
      if (this.getData && this.getData.schoolId) {
        // console.log('this.getData.schoolId', this.getData.schoolId)
        this.form_data.schoolId = JSON.parse(JSON.stringify(this.getData.schoolId))
        this.getData.schoolId = ' '
      }
    },
    async loadTeacherData() {
      const data = this.form_item.filter((item) => item.label == '负责教师')
      const list = [
        {
          label: '全部',
          value: ' ',
        },
      ]
      data[0].option = [...list, ...this.$store.state.common.teacherList_search]
      if (this.getData && this.getData.id && this.getData.account) {
        this.form_data.teacherId = JSON.parse(JSON.stringify(this.getData.id))
        this.getData.id = ''
        // this.searchData('1')
      }
    },
    // changeYear(date) {
    //   console.log(date)
    //   if(!date) {
    //     this.form_data.year = date
    //     console.log(this.form_data.year)
    //   }
    // },
    exportStudent(record) {
      let params = {
        pageNo: 1,
        pageSize: 999,
        classIdEQ: record.id,
      }
      getAction('/api/student', params).then((res) => {
        this.exportModel(res.data.list, record)
      })
    },
    exportModel(data, record) {
      const sheetName = ['学生信息']
      const fileName = `${record.name}学生信息`
      const list = [[['学生姓名', '电话', '学号', '账号', '有效期开始时间', '有效期结束时间']]]
      for (let i = 0; i < data.length; i++) {
        list[0].push([
          data[i].name,
          data[i].phone,
          data[i].studentNumber,
          data[i].account,
          this.timeFilter(data[i].startValidDate),
          this.timeFilter(data[i].endValidDate),
        ])
      }
      export2Excel(sheetName, list, fileName)
    },
    timeFilter(dataStr, pattern = 'YYYY-MM-DD') {
      // console.log(dataStr, 'dataStr')
      ;(dataStr + '').length == 10 && (dataStr *= 1000)
      return dayjs(dataStr).format(pattern)
    },
    resetData() {
      this.form_data = JSON.parse(JSON.stringify(this.form_data_copy))
      this.$set(this.ipagination, 'current', 1)
      this.searchData(5)
    },
    handleSubmit(e) {
      // 验证时间段是否正确
      let time = {
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
      }
      let isTimeTrue = editDateForSearch(time)
      if (!isTimeTrue) {
        this.$message.error('开始时间不能晚于结束时间！')
        return
      }
    },
    downloadTemplate() {
      const a = document.createElement('a')
      const url = './template/student.xlsx'
      a.href = url
      a.download = 'student.xlsx'
      a.click()
    },
    goToDetail(record) {
      this.$router.push({
        name: 'student-manage',
        params: record,
      })
    },
    goToImport(record) {
      this.$router.push({
        name: 'data-import',
        params: {
          record: record ? record : {},
        },
      })
    },
    goToCreate(record) {
      this.$refs.modalForm.create(record)
    },
    loadRouteData(record) {
      if (record.account) {
        this.form_data.schoolId = record.schoolId
        this.form_data.teacherId = record.id
      } else {
        this.form_data.schoolId = record.id
      }
      this.searchData('1')
    },
    searchData(key) {
      // 验证时间段是否正确
      let time = {
        beginTime: this.form_data.beginTime,
        endTime: this.form_data.endTime,
      }
      this.$set(this.ipagination, 'current', 1)
      let isTimeTrue = editDateForSearchCopy(time)
      if (!isTimeTrue) {
        this.$message.error('开始时间不能晚于结束时间！')
        return
      }

      for (const key in this.form_data) {
        if (this.form_data[key]) {
          this.queryParam[key] = this.form_data[key]
        }
      }
      this.queryParam.classNameLk = this.form_data.classNameLk
      this.queryParam.beginTime = time.beginTime
      this.queryParam.endTime = time.endTime
      if (key == 5) {
        this.queryParam.year = null
        this.loadData(1)
      } else {
        if (this.form_data.year) {
          let newYear = new Date(this.form_data.year._d).getFullYear()
          this.queryParam.year = newYear
        } else {
          this.queryParam.year = ''
        }
      }
      if (!key) {
        this.loadData(1)
      }
    },
    setRecord(record) {
      this.record = record
    },
    imgRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('classId', this.record.id)
      this.confirmLoading = true
      studentApi
        .importStudent(formData)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('导入成功')
            this.confirmLoading = false
            this.loadData()
            // this.$emit('update')
          } else {
            return false
          }
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },
    openChange(status) {
      if (status) {
        this.open = true
      } else {
        this.open = false
      }
    },
    panelChange(value) {
      this.form_data.year = value
      this.open = false
    },
  },
}
</script>

<style lang="less" scoped></style>
