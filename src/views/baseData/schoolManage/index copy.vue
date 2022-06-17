<template>
  <div>
    <a-card title="学校管理">
      <!-- 查询功能 -->
      <page-search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="form_data"
        :formLayout="formLayout"
      />
      <!-- 表格 -->
      <br />
      <a-table
        :columns="columns"
        :data-source="dataSource"
        rowKey="id"
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
          <a @click="goToDetail(record)">班级信息</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </template>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(index) + 1 }}
        </template>
        <template slot="createTime" slot-scope="text, record">
          {{ record.createTime | dayjs }}
        </template>
      </a-table>
      <modal ref="modalForm" @update="loadData" />
    </a-card>
  </div>
</template>

<script>
import pageSearch from '@/components/page-form'
import modal from './modal.vue'
import * as dayjs from 'dayjs'
import { editDateForSearchCopy } from '@/utils/util'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { export2Excel } from '@/assets/Excel/excelexport'
import { getAction } from '@/api/manage'

export default {
  mixins: [JeecgListMixin],
  components: {
    pageSearch,
    modal,
  },
  beforeMount() {
    this.form_data_copy = JSON.parse(JSON.stringify(this.form_data))
    console.log(this.form_data_copy)
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
          label: '导出',
          handler: () => this.exportStudent(),
        },
      ],
      // 表格
      ...contentTableConfig,
      url: {
        list: '/api/school/paging',
        delete: '/api/school/',
      },
    }
  },
  methods: {
    resetData() {
      this.form_data = JSON.parse(JSON.stringify(this.form_data_copy))
      this.$set(this.ipagination, 'current', 1)
      this.searchData()
    },
    goToDetail(record) {
      // this.form_data_copy = JSON.parse(JSON.stringify(this.form_data))
      this.$router.push({ name: 'class-manage', params: record })
    },
    exportStudent() {
      let params = {
        pageNo: 1,
        pageSize: 999,
      }
      getAction('/api/school/paging', params).then((res) => {
        this.exportModel(res.data.list)
      })
    },
    exportModel(data) {
      const sheetName = ['学校信息']
      const fileName = `学校信息`
      const list = [[['省份', '学校名称', '教师数量', '班级数量', '账号数量', '创建时间']]]
      for (let i = 0; i < data.length; i++) {
        list[0].push([
          data[i].province,
          data[i].schoolName,
          data[i].teacherNum,
          data[i].classNum,
          data[i].accountNum,
          this.timeFilter(data[i].createTime),
        ])
      }
      export2Excel(sheetName, list, fileName)
    },
    timeFilter(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
      ;(dataStr + '').length == 10 && (dataStr *= 1000)
      return dayjs(dataStr).format(pattern)
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
      this.$set(this.ipagination, 'current', 1)
      console.log(this.ipagination)
      this.queryParam.beginTime = time.beginTime
      this.queryParam.endTime = time.endTime
      this.queryParam.province = this.form_data.province
      this.queryParam.schoolNameLK = this.form_data.schoolNameLK
      this.loadData(1)
    },
  },
}
</script>

<style lang="less" scoped></style>
