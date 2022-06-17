<template>
  <div>
    <a-card title="教师管理">
      <!-- 查询功能 -->
      <page-search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="form_data"
        :formLayout="formLayout"
      >
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
            <a @click="setRecord(record)">导入班级</a>
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
                <a @click="goToDetail(record, 1)">查看班级</a>
              </a-menu-item>
              <a-menu-item key="3">
                <a @click="goToDetail(record, 2)">查看学生</a>
              </a-menu-item>
              <a-menu-item key="4">
                <a @click="exportStudent(record)">导出学生</a>
              </a-menu-item>
              <a-menu-item key="5">
                <a-popconfirm title="是否确认重置密码?" @confirm="resetPsw(record)">
                  <a>重置密码</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(index) + 1 }}
        </template>
        <template slot="hasRight" slot-scope="text, record">
          <a-switch
            :defaultChecked="record.state == 1 ? true : false"
            @change="onChange_state(record)"
            :loading="record.id == loading_state"
          />
        </template>
        <template slot="schoolId" slot-scope="text">
          {{
            $store.state.common.schoolList.filter((item) => item.value == text).length > 0
              ? $store.state.common.schoolList.filter((item) => item.value == text)[0].label
              : ''
          }}
        </template>
        <template slot="createTime" slot-scope="text">
          {{ text | dayjs }}
        </template>
        <template slot="time" slot-scope="text, record">
          {{ record.startValidTime | dayjsYMD }}~{{ record.endValidTime | dayjsYMD }}
        </template>
      </a-table>
      <modal ref="modalForm" @update="loadData" />
    </a-card>
  </div>
</template>

<script>
import pageSearch from '@/components/page-form'
import modal from './modal.vue'
import { editDateForSearchCopy } from '@/utils/util'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { teacherApi } from '@/api/teacher'
import { classApi } from '@/api/class'
import { psdApi } from '@/api/password'
import { export2Excel } from '@/assets/Excel/excelexport'
import { getAction } from '@/api/manage'
import * as dayjs from 'dayjs'

export default {
  mixins: [JeecgListMixin],
  components: {
    pageSearch,
    modal,
  },
  mounted() {
    for (const key in this.form_data) {
      this.form_data[key] = undefined
    }
    this.form_data.schoolId = ' '
    this.$store.dispatch('getSchoolList')
    this.form_data_copy = JSON.parse(JSON.stringify(this.form_data))
    this.form_item_copy = JSON.parse(JSON.stringify(this.form_item))
    // this.loadSearchData()
  },
  data() {
    return {
      // 查询
      ...searchFormConfig,
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
      ],
      // 表格
      ...contentTableConfig,
      loading_state: '',
      record: null,
      //mixin
      url: {
        list: '/api/teacher/getTeacherBySearch',
        delete: '/api/teacher/',
      },
      form_item_copy: null,
      form_data_copy: null,
    }
  },
  watch: {
    '$store.state.common.schoolList'(newVal) {
      this.loadSearchData()
    },
  },
  methods: {
    loadSearchData() {
      console.log('调用了loadSearch____________')
      const list = [
        {
          label: '全部',
          value: ' ',
        },
      ]
      let data = [...list, ...this.$store.state.common.schoolList]
      this.form_item[0].option.splice(0)
      data.forEach(item => {
        this.form_item[0].option.push(item)
      })
      console.log(this.form_item)
    },

    //禁启用
    async onChange_state(record) {
      this.loading_state = record.id

      const params = {
        id: record.accountId,
        status: record.state == 1 ? false : true,
      }
      try {
        let res = await teacherApi.disableTeacher(params)
        if (res.code == 200) {
          this.loading_state = ''
          this.$message.success('修改成功')
        } else {
          this.loading_state = ''
          this.$message.error(res.message)
        }
      } catch (e) {
        this.loading_state = ''
        console.log(e)
      }
      this.loadData()
    },
    exportStudent(record) {
      let params = {
        pageNo: 1,
        pageSize: 999,
        teacherIdEQ: record.id,
      }
      console.log(record)
      getAction('/api/student', params).then((res) => {
        this.exportModel(res.data.list, record)
      })
    },
    exportModel(data, record) {
      const sheetName = ['学生信息']
      const fileName = `${record.name}教师学生信息`
      const list = [[['班级名', '学生姓名', '电话', '学号', '账号', '有效期开始时间', '有效期结束时间']]]
      console.log('data', data)
      for (let i = 0; i < data.length; i++) {
        list[0].push([
          data[i].className,
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
    downloadTemplate() {
      const a = document.createElement('a')
      const url = './template/class.xlsx'
      a.href = url
      a.download = 'class.xlsx'
      a.click()
    },
    resetPsw(record) {
      psdApi
        .resetPassword({
          account: record.account,
        })
        .then((res) => {
          if (res.code == 200) this.$message.success('重置成功')
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
    resetData() {
      this.form_data = JSON.parse(JSON.stringify(this.form_data_copy))
      console.log(this.form_data)
      this.form_item = JSON.parse(JSON.stringify(this.form_item_copy))
      this.$set(this.ipagination, 'current', 1)
      this.loadSearchData()
      this.searchData()
    },
    setRecord(record) {
      this.record = record
    },
    imgRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('teacherId', this.record.id)
      this.confirmLoading = true
      classApi
        .importClass(formData)
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
    //查看学生详情
    goToDetail(record, key) {
      // console.log('record', record)

      key == 1
        ? this.$router.push({
            name: 'class-manage',
            params: record,
          })
        : this.$router.push({
            name: 'accountManage-student',
            params: {
              record,
            },
          })
    },
    searchData() {
      // 验证时间段是否正确
      let time = {
        beginTime: this.form_data.beginTime,
        endTime: this.form_data.endTime,
      }
      let isTimeTrue = editDateForSearchCopy(time)
      if (!isTimeTrue) {
        this.$message.error('开始时间不能晚于结束时间！')
        return
      }
      console.log('time', time)
      this.$set(this.ipagination, 'current', 1)
      // this.queryParam.content = this.form_data.content
      for (const key in this.form_data) {
        if (this.form_data[key]) {
          this.queryParam[key] = this.form_data[key]
        }
      }
      this.queryParam.teacherNameLk = this.form_data.teacherNameLk
      this.queryParam.beginTime = time.beginTime
      this.queryParam.endTime = time.endTime
      this.queryParam.account = this.form_data.account
      console.log(' this.queryParam', this.queryParam)
      this.loadData(1)
    },
  },
}
</script>

<style lang="less" scoped></style>
