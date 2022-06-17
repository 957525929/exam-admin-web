<template>
  <div>
    <a-card title="日志管理">
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
        rowKey="id"
        :data-source="dataSource"
        :pagination="{
          total: ipagination.total,
          pageSize: 6,
          current: ipagination.current,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        }"
        @change="handleTableChange"
        :loading="loading"
      >
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(index) + 1 }}
        </template>
        <template slot="status" slot-scope="text, record">
          <a-tag :color="record.status == '1' ? 'green' : 'red'"> {{ record.status == '1' ? '成功' : '失败' }} </a-tag>
        </template>
        <template slot="createTime" slot-scope="text">
          {{ text | dayjs }}
        </template>
      </a-table>
      <modal ref="modalForm" />
    </a-card>
  </div>
</template>

<script>
import { editDateForSearchCopy } from '@/utils/util'
import pageSearch from '@/components/page-form'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import modal from './modal.vue'

export default {
  mixins: [JeecgListMixin],
  components: {
    pageSearch,
    modal,
  },
  mounted() {
    this.form_data_copy = JSON.parse(JSON.stringify(this.form_data))
    this.form_item_copy = JSON.parse(JSON.stringify(this.form_item))
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
      ],
      // 表格
      ...contentTableConfig,
      //mixin
      url: {
        list: '/api/log',
      },
      form_item_copy: null,
      form_data_copy: null,
    }
  },
  methods: {
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
    resetData() {
      this.form_data = JSON.parse(JSON.stringify(this.form_data_copy))
      this.form_item = JSON.parse(JSON.stringify(this.form_item_copy))
      this.$set(this.ipagination, 'current', 1)
      this.searchData()
    },
    searchData(key) {
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
      for (const key in this.form_data) {
        if (this.form_data[key]) {
          this.queryParam[key] = this.form_data[key]
        }
      }
      this.queryParam.account = this.form_data.account
      this.queryParam.beginTime = time.beginTime
      this.queryParam.endTime = time.endTime

      if (!key) {
        this.loadData(1)
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
