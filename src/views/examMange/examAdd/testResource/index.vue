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
          <!-- <a-button style="margin-right: 10px;" @click="downloadTemplate">
            模板下载
          </a-button>
          <a-upload :showUploadList="false" :customRequest="imgRequest">
            <a-button type="dashed"> 导入 </a-button>
          </a-upload> -->
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
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          onSelect: onCheckChange,
          onSelectAll: onSelectAll,
        }"
        @change="handleTableChange"
        :loading="loading"
      >
        <template slot="content" slot-scope="text">
          <j-ellipsis :value="text.replaceAll(/<p>|<\/p>/gim, '')" :length="20" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleLook(record)">查看</a>
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
// let selectionRowsPlus = []
export default {
  mixins: [JeecgListMixin],
  props: ['getData', 'quesIdList'],
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
          type: 'slot',
          slotName: 'import',
        },
      ],
      // 表格
      ...contentTableConfig,
      tableData: [],
      optionalList: [],
      //路由传参的值
      rowData: [],
      form_item_copy: null,
      form_data_copy: null,
      url: {
        list: '/api/question',
        delete: '/api/question/',
      },
      //多选的key
      selectedRowKeys: [],
      //记录选择
      selectionRowsPlus: [],
    }
  },
  mounted() {
    this.selectionRowsPlus = JSON.parse(JSON.stringify(this.quesIdList))
    this.form_data_copy = JSON.parse(JSON.stringify(this.queryParam))
    this.form_item_copy = JSON.parse(JSON.stringify(this.form_item))
  },
  watch: {
    'getData.key': {
      handler(newVal) {
        // console.log('n4442322222ewVal', newVal)
        this.createStart = false
        this.loadTableData(newVal)
      },
      immediate: true,
      deep: true,
    },
    '$store.state.preview.optionalRowKeys'(newVal) {
      this.selectedRowKeys = newVal
      console.log(this.selectedRowKeys, newVal)
    },
    '$store.state.preview.selectionRowsPlus'(newVal) {
      this.selectionRowsPlus = newVal
      this.$emit('updateState', this.selectionRowsPlus)
      this.$emit('updateGetData', this.selectionRowsPlus)
    },
    quesIdList: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.selectedRowKeys = newVal.map((item) => item.quesId)
        }
      },
      immediate: true,
      deep: true,
    },
    // quseList: {
    //   handler(newVal) {
    //     if (newVal && newVal.length > 0) {
    //       this.selectionRowsPlus = newVal
    //       console.log('newValnewValnewVal', this.selectionRowsPlus)
    //     }
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  methods: {
    //初始化数据
    async loadTableData(value) {
      for (const key in this.form_data) {
        this.form_data[key] = undefined
      }
      this.queryParam = {}
      await (this.queryParam.unitId = value)
      await this.loadData(1)
      // await this.hdd()
    },
    handleLook(record) {
      this.$refs.modalForm_test.look(record)
    },
    resetData() {
      this.queryParam = JSON.parse(JSON.stringify(this.form_data_copy))
      this.form_item = JSON.parse(JSON.stringify(this.form_item_copy))
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
      const url = './templateExecl/questionTemplate.xlsx'
      a.href = url
      a.download = 'questionTemplate.xlsx'
      a.click()
    },
    //多选框回调
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('调用了change')
      this.selectedRowKeys = selectedRowKeys
      //只要改变就调用
      //在选中状态的id
      console.log(this.selectedRowKeys)
    },

    onCheckChange(record, selected, selectedRows) {
      console.log('调用了select')
      selected
        ? this.selectionRowsPlus.push(record)
        : this.selectionRowsPlus.splice(
            this.selectionRowsPlus.findIndex((x) => x.quesId === record.quesId),
            1
          )
      console.log(this.selectionRowsPlus)
      console.log(selectedRows)
      this.changePreviewList()
      //单选时调用
      //在选中状态的表格数据
      this.$emit('updateState', this.selectionRowsPlus)
      //在选中状态的表格数据
      this.$emit('updateGetData', selectedRows)
    },
    onSelectAll(selected, selectedRows, changeRows) {
      console.log('调用了selectAll')
      this.selectionRowsPlus = selected
        ? this.selectionRowsPlus.concat(changeRows)
        : this.selectionRowsPlus.filter((x) => !changeRows.find((i) => i.quesId === x.quesId))
      console.log(this.selectionRowsPlus, selectedRows)
      this.changePreviewList()
      this.$emit('updateState', this.selectionRowsPlus)
      this.$emit('updateGetData', selectedRows)
    },
    changePreviewList() {
      //筛选在quseList没有而optionalList里有的项,并删除
      let ignoreOptionlList = []
      this.optionalList.forEach((ele, index) => {
        let isHave = this.selectionRowsPlus.some((item) => {
          if(ele.quesId == item.quesId) return true
        })
        if(!isHave) ignoreOptionlList.push(ele.quesId)
      })
      ignoreOptionlList.forEach(item => {
        this.optionalList.forEach((ele, index) => {
          if(ele.quesId == item) this.optionalList.splice(index, 1)
        })
      })
      //随机题目数据
      let randomData = this.$store.state.preview.randomData
      let randomDataCopy = []
      //记录随机题目与选中重合的题目
      this.selectionRowsPlus.forEach(item => {
        let isHave
        this.optionalList.forEach(ele => {
          if(ele.quesId == item.quesId) {
            isHave = true
          }
        })
        randomData.forEach(ele => {
          if(ele.quesId == item.quesId) {
            randomDataCopy.push(ele)
            isHave = true
          }
        })
        if (!isHave) {
          this.optionalList.push({
            ...item,
            knowledge: this.$store.state.preview.getData.name
          })
        }
      })
      this.optionalList.map(item => {
        if (!item.knowledge) item.knowledge = this.$store.state.preview.getData.name
      })
      this.$store.commit('CHANGE_RANDOM_DATA', randomDataCopy)
      this.$emit('changeOptional', this.optionalList)
    },
  },
}
</script>

<style lang="less" scoped></style>
