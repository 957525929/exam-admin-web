<template>
  <div>
    <a-card title="知识管理">
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
        rowKey="unitId"
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
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.unitId)">
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
      <modal ref="modalForm" :getData="getData" @update="updateData()" />
    </a-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { editDateForSearchCopy } from '@/utils/util'
import pageSearch from '@/components/page-form'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import modal from './modal.vue'
import { konwApi } from '@/api/know'

export default {
  mixins: [JeecgListMixin],
  props: ['getData'],
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
          label: '重置',
          handler: () => this.resetData()
        },
        {
          label: '新增',
          key: 'add',
          handler: () => this.handleAdd(),
        },
      ],
      // 表格
      ...contentTableConfig,
      tableData: [],
      form_item_copy: null,
      form_data_copy: null,
      url: {
        list: '/api/knowlUnit/paging',
        delete: '/api/knowlUnit/',
      },
    }
  },
  mounted() {
    this.form_data_copy = JSON.parse(JSON.stringify(this.form_data))
    this.form_item_copy = JSON.parse(JSON.stringify(this.form_item))
  },
  watch: {
    getData: {
      handler(newVal) {
        this.createStart = false
        this.loadTableData(newVal)
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    //初始化数据
    async loadTableData(value) {
      for (const key in this.form_data) {
        this.form_data[key] = undefined
      }
      this.queryParam = {}
      await (this.queryParam.parentId = value.key)
      await this.loadData()
    },
    resetData() {
      this.form_data = JSON.parse(JSON.stringify(this.form_data_copy))
      this.form_item = JSON.parse(JSON.stringify(this.form_item_copy))
      this.$set(this.ipagination, 'current', 1)
      this.searchData()
    },
    changeCurrent() {
      this.$set(this.ipagination, 'current', 1)
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
      this.queryParam.beginTime = time.beginTime
      this.queryParam.endTime = time.endTime
      this.queryParam.nameLk = this.form_data.nameLk
      this.loadData()
    },
    updateData() {
      this.loadData()
      this.$emit('update')
    },
    handleDelete(id) {
      konwApi
        .deletKnow(id)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.$emit('update')
            this.loadData()
          } else {
            that.$message.warning(res.message)
          }
        })
        .catch((res) => {
          console.log(res)
        })
    },
  },
}
</script>

<style lang="less" scoped></style>
