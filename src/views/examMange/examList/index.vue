<template>
  <div>
    <a-card title="试卷列表">
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
        :pagination="{
          total: ipagination.total,
          current: ipagination.current,
          pageSize: 6,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        }"
        @change="handleTableChange"
        :loading="loading"
        rowKey="paperId"
      >
        <template slot="action" slot-scope="text, record">
          <a @click="previewExam(record)">预览</a>
          <a-divider type="vertical" />
          <a @click="goToExam(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.paperId)">
            <a>删除</a>
          </a-popconfirm>
        </template>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(index) + 1 }}
        </template>
        <template slot="class" slot-scope="text, record">
          <j-ellipsis
            :value="(record.className && record.className.length > 0 && record.className.join('、')) || '暂无'"
            :length="20"
          />
        </template>
        <template slot="createTime" slot-scope="text">
          {{ text | dayjs }}
        </template>
      </a-table>
      <preview-modal ref="previewModalRef" />
    </a-card>
  </div>
</template>

<script>
import pageSearch from '@/components/page-form'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { editDateForSearchCopy } from '@/utils/util'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import previewModal from './previewModal.vue'

export default {
  mixins: [JeecgListMixin],
  components: {
    pageSearch,
    previewModal,
    JEllipsis,
  },
  watch: {
    $route(newVal, val) {
      if (newVal.params.fromExam) this.searchData()
    },
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
          handler: () => this.goToExam(),
        },
      ],
      form_item_copy: null,
      form_data_copy: null,
      // 表格
      ...contentTableConfig,
      //mixin
      url: {
        list: '/api/paper',
        delete: '/api/paper/',
      },
    }
  },
  mounted() {
    console.log(this.$route.query, '调用了mounted')
    for (const key in this.form_data) {
      this.form_data[key] = undefined
    }
    this.form_data_copy = JSON.parse(JSON.stringify(this.form_data))
    this.form_item_copy = JSON.parse(JSON.stringify(this.form_item))
  },
  methods: {
    resetData() {
      for (const key in this.form_data) {
        this.$set(this.form_data, key, null)
      }
      console.log(this.form_data)
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
      console.log('time', time)
      if (!isTimeTrue) {
        this.$message.error('开始时间不能晚于结束时间！')
        return
      }
      this.$set(this.ipagination, 'current', 1)
      for (const key in this.queryParam) {
        this.queryParam[key] = null
      }
      for (const key in this.form_data) {
        if (this.form_data[key]) {
          this.queryParam[key] = this.form_data[key]
        }
      }
      this.queryParam.beginTime = time.beginTime
      this.queryParam.endTime = time.endTime
      this.loadData(1)
    },
    previewExam(record) {
      this.$refs.previewModalRef.look(record)
    },
    goToExam(record) {
      if (record) {
        this.$router.push({ name: 'examMange-examEdit', params: { id: record.paperId } })
      } else {
        this.$router.push({ name: 'examMange-examAdd' })
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
