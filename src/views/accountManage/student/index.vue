<template>
  <div>
    <a-card title="学生管理">
      <!-- 查询功能 -->
      <page-search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="form_data"
        :formLayout="formLayout"
      >
        <!-- <template slot="import">
          <a-upload :showUploadList="false" :customRequest="imgRequest">
            <a-button type="dashed"> 导入 </a-button>
          </a-upload>
        </template> -->
      </page-search>
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
        rowKey="id"
      >
        <template slot="action" slot-scope="text, record">
          <a-popconfirm title="是否确认重置密码?" @confirm="resetPsw(record)">
            <a>重置密码</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
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
        <template slot="time" slot-scope="text, record">
          {{ record.startValidDate | dayjsYMD }}~{{ record.endValidDate | dayjsYMD }}
        </template>
        <template slot="createTime" slot-scope="text">
          {{ text | dayjs }}
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
import { studentApi } from '@/api/student'
import { psdApi } from '@/api/password'

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
      tableData: [],
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
  mounted() {
    for (const key in this.form_data) {
      this.form_data[key] = undefined
    }
    this.form_data.schoolIdEQ = ' '
    this.form_data.classIdEQ = ' '
    this.form_data.teacherIdEQ = ' '
    this.form_data_copy = JSON.parse(JSON.stringify(this.form_data))
    this.form_item_copy = JSON.parse(JSON.stringify(this.form_item))
    const data = {
      key: 1,
    }
    this.getData = this.$route.params.record
    this.$store.dispatch('getSchoolList')
    if (!this.getData) {
      this.$store.dispatch('getTeacherList', data)
      this.$store.dispatch('getClassList', data)
    } else {
      this.loadRouteData(this.getData)
    }
    // console.log('this.$route.params.record', this.$route.params.record)
  },
  watch: {
    '$store.state.common.schoolList'(newVal) {
      console.log('this.getData', !this.getData)
      this.loadSearchData()
    },
    '$store.state.common.teacherList_search'(newVal) {
      this.loadTeacherData()
    },
    '$store.state.common.classList_search'(newVal) {
      this.loadClassData()
    },
    'form_data.schoolIdEQ': {
      handler(newVal) {
        console.log('newVal', newVal)
        const data = {
          key: 1,
          id: newVal,
        }
        if(newVal) this.$store.dispatch('getTeacherList', data)
        else this.$store.dispatch('getTeacherList', {key: 1})
        this.form_data.teacherIdEQ = ' '
        this.form_data.classIdEQ = ' '
      },
    },
    'form_data.teacherIdEQ': {
      handler(newVal) {
        // console.log('newValnewVal', newVal)
        const data = {
          key: 1,
          id: newVal,
        }
        if(newVal) this.$store.dispatch('getClassList', data)
        else this.$store.dispatch('getClassList', {key: 1})
        // typeof newVal == 'number' && this.$store.dispatch('getClassList', data)
        this.form_data.classIdEQ = ' '
      },
    },
    // getData: {
    //   handler(newValue) {
    //     newValue && this.loadRouteData(newValue)
    //   },
    //   deep: true,
    // },
  },
  methods: {
    //初始化数据
    // loadData() {
    //   let teacherName = ''
    //   if (this.$route.params.record) {
    //     teacherName = this.$route.params.record.name || undefined
    //   }

    //   // console.log('teacherName', teacherName)
    //   this.tableData = teacherName ? this.data.filter((item) => item.teacher == teacherName) : this.data
    // },
    async imgRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      this.confirmLoading = true
      try {
        const res = await studentApi.importStudent(formData)
        if (res.code == 200) {
          this.$message.success('导入成功')
          this.confirmLoading = false
        } else {
          this.$message.error(res.message)
          this.confirmLoading = false
        }
      } catch (e) {
        console.log(e)
        this.confirmLoading = false
      }
    },
    async loadSearchData() {
      const data = this.form_item.filter((item) => item.label == '所属学校')
      const list = [
        {
          label: '全部',
          value: ' ',
        },
      ]
      data[0].option = [...list, ...this.$store.state.common.schoolList]
      if (this.getData && this.getData.schoolId) {
        this.form_data.schoolIdEQ = JSON.parse(JSON.stringify(this.getData.schoolId))
        this.getData.schoolId = ''
      }
    },
    async loadTeacherData() {
      const data = this.form_item.filter((item) => item.label == '负责教师')
      const list = [
        {
          label: '全部',
          value: ' ',
        },
      ]
      data[0].option = [...list, ...this.$store.state.common.teacherList_search]
      if (this.getData && this.getData.id) {
        // this.form_data.teacherIdEQ = this.getData.id
        this.form_data.teacherIdEQ = JSON.parse(JSON.stringify(this.getData.id))
        this.getData.id = ''
      }
    },
    async loadClassData() {
      const data = this.form_item.filter((item) => item.label == '所属班级')
      const list = [
        {
          label: '全部',
          value: ' ',
        },
      ]
      data[0].option = [...list, ...this.$store.state.common.classList_search]
    },
    resetPsw(record) {
      psdApi
        .resetPassword({ account: record.account })
        .then((res) => {
          if (res.code == 200) this.$message.success('重置成功')
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
    resetData() {
      this.form_data = JSON.parse(JSON.stringify(this.form_data_copy))
      this.form_item = JSON.parse(JSON.stringify(this.form_item_copy))
      this.$store.dispatch('getSchoolList')
      const data = {
        key: 1,
      }
      this.$store.dispatch('getTeacherList', data)
      this.$store.dispatch('getClassList', data)
      this.$set(this.ipagination, 'current', 1)
      this.searchData()
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
    //禁启用
    async onChange_state(record) {
      this.loading_state = record.id

      const params = {
        id: record.accountId,
        status: record.state == 1 ? false : true,
      }
      try {
        let res = await studentApi.disableStudent(params)
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
    loadRouteData(record) {
      // console.log('record', record)

      this.form_data.schoolIdEQ = record.schoolId
      this.form_data.teacherIdEQ = record.id
      this.searchData('1')
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
      // this.queryParam.content = this.form_data.content
      for (const key in this.form_data) {
        if (this.form_data[key]) {
          this.queryParam[key] = this.form_data[key]
        }
      }
      this.queryParam.nameLk = this.form_data.nameLk
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
