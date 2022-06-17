<template>
  <div>
    <a-card title="学校管理">
      <!-- 查询功能 -->
      <page-search ref="search" :searchFormConfig="searchFormConfig" :formHandler="form_handler" />
      <br />
      <page-table
        v-bind="contentTableConfig"
        :url="url"
        :dataSource="dataSource"
        :ipagination="ipagination"
        :rowKey="rowKey"
      >
        <template slot="action" slot-scope="row">
          <a @click="handleEdit(row.record)">修改</a>
          <a-divider type="vertical" />
          <a @click="goToDetail(row.record)">班级信息</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(row.record.id)">
            <a>删除</a>
          </a-popconfirm>
        </template>
        <template slot="num" slot-scope="row">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(row.index) + 1 }}
        </template>
        <template slot="createTime" slot-scope="row">
          {{ row.record.createTime | dayjs }}
        </template>
      </page-table>
      <modal ref="modalForm" @update="loadData" />
    </a-card>
  </div>
</template>

<script>
import pageSearch from '@/components/page-search'
import pageTable from '@/components/page-table'
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
    pageTable,
    modal,
  },
  beforeMount() {},
  data() {
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
          key: 'reset',
          handler: () => this.resetData(),
        },
        {
          label: '新增',
          key: 'add',
          handler: () => this.handleAdd(),
        },
        {
          label: '导出',
          key: 'export',
          handler: () => this.exportStudent(),
        },
      ],
      // 表格
      contentTableConfig,
      url: {
        list: '/api/school/paging',
        delete: '/api/school/',
      },
      rowKey: 'id',
    }
  },
  methods: {
    resetData() {
      this.$refs.search.resetData()
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
      const data = this.$refs.search.searchData()
      this.form_data = data
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
