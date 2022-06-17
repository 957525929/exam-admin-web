<template>
  <div>
    <a-card title="试题资源">
      <!-- 查询功能 -->
      <page-search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="queryParam"
        :formLayout="formLayout"
      >
        <template slot="import">
          <a-button style="margin-right: 10px" @click="downloadTemplate"> 模板下载 </a-button>
          <a-upload :showUploadList="false" :customRequest="imgRequest">
            <a-button type="dashed"> 导入 </a-button>
          </a-upload>
        </template>
      </page-search>
      <!-- 表格 -->
      <br />
      <a-table
        rowKey="quesId"
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
        <template slot="content" slot-scope="text">
          <j-ellipsis :value="text.replaceAll(/<p>|<\/p>/gim, '')" :length="20" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleLook(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <!-- <a @click="handleDelete(record)">删除</a> -->
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.quesId)">
            <a>删除</a>
          </a-popconfirm>
        </template>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(index) + 1 }}
        </template>
        <template slot="quesType" slot-scope="text, record">
          {{ record.quesType == 1 ? '单选' : record.quesType == 2 ? '多选' : '判断' }}
        </template>
        <template slot="external" slot-scope="text, record">
          {{ record.external == 1 ? '混合' : '文字' }}
        </template>
        <template slot="difficulty" slot-scope="text, record">
          {{ record.difficulty == 3 ? '难' : record.difficulty == 2 ? '中' : '易' }}
        </template>
        <template slot="descr" slot-scope="text">
          <j-ellipsis :value="text" :length="10" />
        </template>
        <template slot="createTime" slot-scope="text, record">
          {{ record.createTime | dayjs }}
        </template>
      </a-table>
      <modal ref="modalForm" :getData="getData" @update="loadData" />
      <test-modal ref="modalForm_test" />
    </a-card>
  </div>
</template>

<script>
import pageSearch from '@/components/page-form'
import modal from './modal.vue'
import JEllipsis from '@/components/jeecg/JEllipsis'
import testModal from './testModal.vue'
import { editDateForSearch } from '@/utils/util'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { questionApi } from '@/api/question'
// import muban from '@/assets/test/muban.xlsx'

export default {
  mixins: [JeecgListMixin],
  props: ['getData'],
  components: {
    pageSearch,
    modal,
    JEllipsis,
    testModal,
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
        {
          type: 'slot',
          slotName: 'import',
        },
      ],
      // 表格
      ...contentTableConfig,
      form_item_copy: null,
      form_data_copy: null,
      tableData: [],
      //路由传参的值
      rowData: [],
      url: {
        list: '/api/question',
        delete: '/api/question/',
      },
    }
  },
  mounted() {
    this.form_data_copy = JSON.parse(JSON.stringify(this.queryParam))
    this.form_item_copy = JSON.parse(JSON.stringify(this.form_item))
    // this.loadData()
    // this.hdd()
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
      await this.loadData(1)
      // await this.hdd()
    },
    changeCurrent() {
      this.$set(this.ipagination, 'current', 1)
    },
    resetData() {
      this.queryParam = JSON.parse(JSON.stringify(this.form_data_copy))
      this.form_item = JSON.parse(JSON.stringify(this.form_item_copy))
      this.$set(this.ipagination, 'current', 1)
      this.searchData()
    },
    handleLook(record) {
      this.$refs.modalForm_test.look(record)
    },
    searchData() {
      // 验证时间段是否正确
      let time = {
        beginTime: this.form_data.beginTime,
        endTime: this.form_data.endTime,
      }
      let isTimeTrue = editDateForSearch(time)
      if (!isTimeTrue) {
        this.$message.error('开始时间不能晚于结束时间！')
        return
      }
      this.$set(this.ipagination, 'current', 1)
      this.queryParam.beginTime = time.beginTime
      this.queryParam.endTime = time.endTime
      // this.queryParam.content = this.form_data.content
      for (const key in this.form_data) {
        if (this.form_data[key]) {
          this.queryParam[key] = this.form_data[key]
        }
      }
      this.loadData(1)
    },
    async imgRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      this.confirmLoading = true
      try {
        const res = await questionApi.batchQues(formData)
        if (res.code == 200) {
          this.$message.success('导入成功')
          this.confirmLoading = false
          this.loadData()
          this.$emit('update')
        } else {
          this.$message.error(res.message)
          this.confirmLoading = false
        }
      } catch (e) {
        console.log(e)
        this.confirmLoading = false
      }
    },
    downloadTemplate() {
      const a = document.createElement('a')
      const url = './template/questionTemplate.xlsx'
      a.href = url
      a.download = 'questionTemplate.xlsx'
      a.click()
    },
  },
}
</script>

<style lang="less" scoped></style>
