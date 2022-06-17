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
      />
      <!-- 表格 -->
      <br />
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="{
          total: data.length,
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
          <j-ellipsis :value="text" :length="20" />
        </template>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + parseInt(index) + 1 }}
        </template>
        <template slot="type" slot-scope="text, record">
          {{ record.type == '0' ? '单选' : record.type == '1' ? '多选' : '判断' }}
        </template>
        <template slot="lv" slot-scope="text, record">
          {{ record.lv == '0' ? '难' : record.lv == '1' ? '中' : '易' }}
        </template>
      </a-table>
      <modal ref="modalForm" />
    </a-card>
  </div>
</template>

<script>
const selectionRowsPlus = []
import Vue from 'vue'
import { ROUTER_PARAMS } from '@/store/mutation-types'
import { editDateForSearch } from '@/utils/util'
import pageSearch from '@/components/page-form'
import { searchFormConfig } from './config/search.config'
import { contentTableConfig } from './config/content.config'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import modal from './modal.vue'
import JEllipsis from '@/components/jeecg/JEllipsis'

export default {
  mixins: [JeecgListMixin],
  props: ['selectKey'],
  components: {
    pageSearch,
    modal,
    JEllipsis
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
      ],
      // 表格
      ...contentTableConfig,
      tableData: [],
      //路由传参的值
      rowData: [],
      //多选的key
      selectedRowKeys: [],
      //记录选择
      selectionRowsPlus,
    }
  },
  mounted() {
    this.loadData()
  },
  watch: {
    selectKey: {
      handler() {
        this.loadData()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    //初始化数据
    loadData() {
      Vue.ls.get(ROUTER_PARAMS) && (this.rowData = JSON.parse(Vue.ls.get(ROUTER_PARAMS)))
      if (this.selectKey == '1-1') {
        this.tableData = this.data
      } else {
        this.tableData = this.data.filter((item) => item.pathNode == this.selectKey)
      }

      // console.log('this.rowD11ata', this.selectKey)
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
    //多选框回调
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },

    onCheckChange(record, selected, selectedRows) {
      selected
        ? this.selectionRowsPlus.push(record)
        : this.selectionRowsPlus.splice(
            this.selectionRowsPlus.findIndex((x) => x.id === record.key),
            1
          )
      this.$emit('updateState', this.selectionRowsPlus)
      this.$emit('updateGetData', selectedRows)
    },
    onSelectAll(selected, selectedRows, changeRows) {
      this.selectionRowsPlus = selected
        ? this.selectionRowsPlus.concat(changeRows)
        : this.selectionRowsPlus.filter((x) => !changeRows.find((i) => i.id === x.id))
      this.$emit('updateState', this.selectionRowsPlus)
      this.$emit('updateGetData', selectedRows)
    },
  },
}
</script>

<style lang="less" scoped></style>
