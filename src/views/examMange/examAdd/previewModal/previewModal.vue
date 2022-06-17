<template>
  <div>
    <a-modal title="预览" :visible="visible" @cancel="handlerCancel" width="60%">
      <div class="preview-tabs">
        <a-tabs default-active-key="1" @change="changeKey">
          <a-tab-pane key="1" :tab="randomCount">
            <div class="table-wrapper">
              <a-table rowKey="quesId" :data-source="data" :columns="columns" :pagination="false" :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }">
                <template slot="content" slot-scope="text">
                  <j-ellipsis :value="text.replaceAll(/<p>|<\/p>/gim, '')" :length="20" />
                </template>
                <template slot="action" slot-scope="text, record">
                  <a @click="handleDelete(record, 1)">删除</a>
                </template>
                <template slot="quesType" slot-scope="text, record">
                  {{ record.quesType == 1 ? '单选' : record.quesType == 2 ? '多选' : '判断' }}
                </template>
                <template slot="difficulty" slot-scope="text, record">
                  {{ record.difficulty == 3 ? '难' : record.difficulty == 2 ? '中' : '易' }}
                </template>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="optionalCount" force-render>
            <div class="table-wrapper">
              <a-table rowKey="quesId" :data-source="optionalList" :columns="columns" :pagination="false"
                :row-selection="{
                selectedRowKeys: optionalSelectedRowKeys,
                onChange: optionalSelectChange,
              }">
                <template slot="content" slot-scope="text">
                  <j-ellipsis :value="text.replaceAll(/<p>|<\/p>/gim, '')" :length="20" />
                </template>
                <template slot="action" slot-scope="text, record">
                  <a @click="handleDelete(record, 2)">删除</a>
                </template>
                <template slot="quesType" slot-scope="text, record">
                  {{ record.quesType == 1 ? '单选' : record.quesType == 2 ? '多选' : '判断' }}
                </template>
                <template slot="difficulty" slot-scope="text, record">
                  {{ record.difficulty == 3 ? '难' : record.difficulty == 2 ? '中' : '易' }}
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template slot="footer">
        <div class="footer-content">
          <div class="left-wrap">
            <a-button @click="deleteSelect">删除选中</a-button>
          </div>
          <div class="right-wrap">
            <!-- <a-button @click="handlerCancel">取消</a-button>
            <a-button type="primary" :loading="confirmLoading">确定 </a-button> -->
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
  import {
    contentTableConfig
  } from './config/content.config'
  import {
    konwApi
  } from '@/api/know.js'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  export default {
    components: {
      JEllipsis,
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        ...contentTableConfig,
        value: undefined,
        selectedRowKeys: [],
        optionalSelectedRowKeys: [],
        key: 0,
        dataCopy: [],
        rowKeys: [],
      }
    },
    props: {
      optionalList: {
        type: Array,
        defalult: [],
      },
    },
    destroyed() {
      this.data.splice(0)
    },
    watch: {
      '$store.state.preview.randomData'(newVal) {
        this.data.splice(0)
        newVal.forEach((item) => {
          item.knowledge = item.unitName
          this.data.push(item)
        })
      },
    },
    computed: {
      randomCount() {
        return `随机（${this.data.length}）`
      },
      optionalCount() {
        return `自选（${this.optionalList.length}）`
      }
    },
    methods: {
      showModal() {
        this.visible = true
      },
      changeKey() {
        this.key == 0 ? (this.key = 1) : (this.key = 0)
      },
      async handlerCancel() {
        this.visible = false
        this.confirmLoading = false
        // await this.reset()
      },
      deleteSelect() {
        let rowKeys = []
        let data = []
        this.key == 0 ? (rowKeys = this.selectedRowKeys) : (rowKeys = this.optionalSelectedRowKeys)
        this.key == 0 ? (data = this.data) : (data = this.optionalList)
        if (rowKeys.length <= 0) return
        // let recordArr = data.filter((item) => rowKeys.includes(item.quesId))
        rowKeys.forEach((id) => {
          data.some((item, i) => {
            if (item.quesId == id) {
              data.splice(i, 1)
              return true
            }
          })
        })
        let allData = []
        if (this.key == 0) {
          allData = data.concat(this.optionalList)
          this.selectedRowKeys = []
        } else {
          allData = data.concat(this.data)
          this.optionalSelectedRowKeys = []
        }
        this.rowKeys = []
        allData.forEach((item) => {
          this.rowKeys.push(item.quesId)
        })
        //剩下的表格数据
        this.$store.commit('CHANGE_ROWKEYS', this.rowKeys)
        this.$store.commit('CHANGE_SELECTION', allData)
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        console.log('selectedRowKeys', selectedRowKeys, selectedRows)
        this.selectedRowKeys = selectedRowKeys
      },
      optionalSelectChange(selectedRowKeys, selectedRows) {
        console.log('selectedRowKeys', selectedRowKeys, selectedRows)
        this.optionalSelectedRowKeys = selectedRowKeys
      },
      reset() {
        this.data = JSON.parse(JSON.stringify(this.dataCopy))
        this.addId = 1
        this.questionSum = 0
        this.selectedRowKeys = []
      },
      handleDelete(record, key) {
        let data = []
        let selectKey = []
        key == 1 ? (selectKey = this.selectedRowKeys) : (selectKey = this.optionalSelectedRowKeys)
        key == 1 ? (data = this.data) : (data = this.optionalList)
        data.some((item, i) => {
          if (item.quesId == record.quesId) {
            data.splice(i, 1)
            return true
          }
        })
        selectKey.some((item, i) => {
          if (item == record.quesId) {
            selectKey.splice(i, 1)
            return true
          }
        })
        //合并随机与自选的数据
        let allData = this.data.concat(this.optionalList)
        //自选与随机总的id数组
        let rowKeys = []
        allData.forEach(item => {
          rowKeys.push(item.quesId)
        })
        console.log(rowKeys, '_________________')
        this.$store.commit('CHANGE_ROWKEYS', rowKeys)
        this.$store.commit('CHANGE_SELECTION', allData)
      },
    },
  }
</script>
<style lang="less" scoped>
  .all-count {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .table-wrapper{
    overflow: hidden;
    overflow-y: scroll;
    max-height: 500px;
  }
</style>