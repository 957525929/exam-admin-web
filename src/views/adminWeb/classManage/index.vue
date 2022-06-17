<template>
  <div>
    <a-card title="班级管理">
      <!-- 查询功能 -->
      <page-search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="queryParam"
        :formLayout="formLayout"
      />
      <!-- 表格 -->
      <br />
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="{
          total: data.length,
          pageSize: 6,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        }"
        @change="handleTableChange"
        :loading="loading"
      >
        <template slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)">删除</a>
        </template>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(index) + 1 }}
        </template>
      </a-table>
      <modal ref="modalForm" />
    </a-card>
  </div>
</template>

<script>
import { editDateForSearch } from '@/utils/util'
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
          label: '新增',
          key: 'add',
          handler: () => this.handleAdd(),
        },
        { type: 'dashed', label: '导入', key: 'add', handler: () => this.handleAdd() },
      ],
      // 表格
      ...contentTableConfig,
      //mixin
      url: {
        list: '',
      },
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
  },
}
</script>

<style lang="less" scoped></style>
