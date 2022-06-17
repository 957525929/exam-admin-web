<template>
  <div>
    <a-card title="学生管理">
      <a-form layout="inline" v-if="getData">
        <a-form-item label="所属校区"> {{ getData.schoolName }} </a-form-item>
        <a-form-item label="所属班级"> {{ getData.name }} </a-form-item>
        <a-form-item label="负责教师"> {{ getData.teacherName }} </a-form-item>
      </a-form>
      <!-- 查询功能 -->
      <page-search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="form_data"
        :formLayout="formLayout"
      >
        <template slot="import">
          <a-upload :showUploadList="false" :customRequest="imgRequest">
            <a-button type="dashed"> 导入 </a-button>
          </a-upload>
        </template>
      </page-search>
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
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </template>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(index) + 1 }}
        </template>
        <template slot="createTime" slot-scope="text">
          {{ text | dayjs }}
        </template>
        <template slot="time" slot-scope="text, record">
          {{ record.startValidDate | dayjsYMD }}~{{ record.endValidDate | dayjsYMD }}
        </template>
      </a-table>
      <modal ref="modalForm" @update-data="loadRouteData()" :getData="getData" />
    </a-card>
  </div>
</template>

<script>
import { editDateForSearch } from '@/utils/util'
import pageSearch from '@/components/page-form'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { editDateForSearchCopy } from '@/utils/util'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import modal from './modal.vue'
import { studentApi } from '@/api/student'

export default {
  mixins: [JeecgListMixin],
  components: {
    pageSearch,
    modal,
  },
  mounted() {
    this.$set(this.form_data, 'startTime', null)
    this.$set(this.form_data, 'endTime', null)
    this.$set(this.form_data, 'nameLk', '')
    if (this.$route.params.schoolId && this.$route.params.teacherId) {
      this.getData = this.$route.params
    } else {
      this.getData = JSON.parse(this.$ls.get('getData'))
    }
    this.$ls.set('getData', JSON.stringify(this.getData))
    if (this.getData) {
      this.loadRouteData()
    }
    console.log('触发了mounted')
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
        {
          label: '新增',
          key: 'add',
          handler: () => this.handleAdd(),
        },
        { type: 'slot', slotName: 'import' },
      ],
      // 表格
      ...contentTableConfig,
      getData: undefined,
      form_item_copy: null,
      form_data_copy: null,
      //mixin
      url: {
        list: '/api/student',
        delete: '/api/student/',
      },
    }
  },
  methods: {
    imgRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('classId', this.getData.id)
      this.confirmLoading = true
      studentApi
        .importStudent(formData)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('导入成功')
            this.confirmLoading = false
            this.loadRouteData()
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
      this.$set(this.form_data, 'startTime', null)
      this.$set(this.form_data, 'endTime', null)
      this.$set(this.form_data, 'nameLk', '')
      this.form_item = JSON.parse(JSON.stringify(this.form_item_copy))
      this.$set(this.ipagination, 'current', 1)
      this.loadRouteData()
    },
    loadRouteData() {
      console.log('调用了loadRoute')
      this.form_data.classIdEQ = this.getData.id
      this.searchData()
    },
    searchData(key) {
      let time = {
        beginTime: this.form_data.startTime,
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
      this.queryParam.nameLk = this.form_data.nameLk
      this.queryParam.beginTime = time.beginTime
      this.queryParam.endTime = time.endTime
      console.log(this.queryParam)
      if (!key) {
        this.loadData(1)
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
