<template>
  <div>
    <a-card title="学习资源">
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
        <template slot="type" slot-scope="text, record">
          {{ record.resType == '0' ? 'html' : '其他资源' }}
        </template>
        <template slot="action" slot-scope="text, record">
          <a v-if="record.resType === '0'" @click="look(0, record)">查看</a>
          <a v-if="record.resType != '0'" @click="look(1, record)">查看</a>
          <a-divider type="vertical" />
          <a v-if="record.resType === '0'" @click="edit(0, record)">编辑</a>
          <a v-if="record.resType != '0'" @click="edit(1, record)">上传</a>
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
        <template slot="descr" slot-scope="text">
          <j-ellipsis :value="text" :length="10" />
        </template>
      </a-table>
      <modal ref="modalForm" :getData="getData" @update="loadData()" />
    </a-card>
  </div>
</template>

<script>
import pageSearch from '@/components/page-form'
import modal from './modal.vue'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { editDateForSearchCopy } from '@/utils/util'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  mixins: [JeecgListMixin],
  props: ['getData'],
  components: {
    pageSearch,
    modal,
    JEllipsis,
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
      form_item_copy: null,
      form_data_copy: null,
      tableData: [],
      url: {
        list: '/api/learnResource',
        delete: '/api/learnResource/',
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
      await (this.queryParam.unitId = value.key)
      await this.loadData()
    },
    changeCurrent() {
      this.$set(this.ipagination, 'current', 1)
    },
    resetData() {
      this.form_data = JSON.parse(JSON.stringify(this.form_data_copy))
      this.form_item = JSON.parse(JSON.stringify(this.form_item_copy))
      this.$set(this.ipagination, 'current', 1)
      this.searchData()
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
      this.queryParam.resourceName = this.form_data.resourceName
      this.loadData(1)
    },

    edit(index, record) {
      this.$refs.modalForm.edit(index, record)
    },
    look(index, record) {
      this.$refs.modalForm.look(index, record)
    },
  },
}
</script>

<style lang="less" scoped></style>
