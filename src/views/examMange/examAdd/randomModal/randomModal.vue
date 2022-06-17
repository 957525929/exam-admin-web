
<template>
  <div>
    <a-modal title="随机" :visible="visible" @cancel="handlerCancel" width="60%">
      <div class="all-count">
        <div class="left-wrap">
          <!-- <p class="left-text">当前选中题数：{{ questionSum }}</p> -->
          <p class="right-text">当前自选题数：{{ optionalList.length }}</p>
        </div>
        <a-button type="primary" @click="add">增加</a-button>
      </div>
      <a-table
        rowKey="id"
        :data-source="data"
        :columns="columns"
        :pagination="false"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          // onSelect: onCheckChange,
          // onSelectAll: onSelectAll,
        }"
      >
        <template slot="action" slot-scope="text, record">
          <a @click="handleDelete(record.id)">删除</a>
        </template>
        <template slot="knowledge" slot-scope="text, record">
          <a-cascader
            :options="treeData"
            :value="record.selectItem"
            @click="recordId(record)"
            change-on-select
            placeholder="请选择知识单元"
            @change="selectChange"
          />
        </template>
        <template slot="questionCount" slot-scope="text, record">
          <a-input-number :min="0" :value="record.questionCount" @focus="focus(record)" @change="changeNumber" />
        </template>
      </a-table>
      <template slot="footer">
        <div class="footer-content">
          <div class="left-wrap">
            <a-button @click="deleteSelect">删除选中</a-button>
          </div>
          <div class="right-wrap">
            <a-button @click="handlerCancel">取消</a-button>
            <a-button type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { contentTableConfig } from './config/content.config'
import { postAction } from '@/api/manage'
import { konwApi } from '@/api/know.js'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      ...contentTableConfig,
      selectedRowKeys: [],
      value: undefined,
      addId: 1,
      //多选的key
      questionSum: 0,
      curId: '',
      treeData: [{ label: '知识单元', value: 1, children: [{ label: '建筑', value: 2 }] }],
    }
  },
  props: {
    optionalList: {
      type: Array,
      defalult: [],
    },
    quesCount: {
      defalult: 0
    }
  },
  created() {
    this.loadData()
  },
  destroyed() {
    this.reset()
  },
  methods: {
    showModal() {
      this.visible = true
    },
    add() {
      console.log(this.addId, this.questionSum, this.data)
      this.addId++
      this.data.push({
        questionCount: 0,
        id: this.addId,
        selectItem: [],
      })
    },
    selectChange(value, option) {
      // value = value.filter(item => item != 1)
      console.log(value, option)
      let curI
      this.data.some((item, i) => {
        if (item.id == this.curId) {
          curI = i
          console.log(this.data[i].selectItem)
          this.data[i].selectItem = []
          this.data[i].selectItem.push(...value)
          return true
        }
      })
    },
    changeNumber(value) {
      if (value && typeof value != 'number') {
        this.$message.error('请输入数字！')
        return
      }
      let oldVal = ''
      this.data.forEach((item, index) => {
        if (item.id == this.curId) {
          oldVal = this.data[index].questionCount
          this.$set(this.data[index], 'questionCount', value)
        }
      })
    },
    deleteSelect() {
      if (this.selectedRowKeys.length <= 0) return
      this.selectedRowKeys.forEach((id) => {
        this.data.some((item, i) => {
          if (item.id == id) {
            this.data.splice(i, 1)
            this.questionSum = this.questionSum - item.questionCount
            return true
          }
        })
      })
    },
    recordId(record) {
      this.curId = record.id
    },
    focus(record) {
      this.curId = record.id
    },
    async handlerCancel() {
      this.visible = false
      this.confirmLoading = false
      // await this.reset()
    },
    ok() {
      this.updateRandom()
    },
    judgeCount() {
      if(!(Number(this.quesCount) > 0)) {
        this.$message.error('请先输入试卷总出题数！')
        return false
      }
      this.questionSum = this.data.reduce((prev, cur) => {
        return prev + Number(cur.questionCount)
      }, 0)
      if((this.questionSum + this.optionalList.length) > this.quesCount) {
        this.$message.error('出题数大于试卷总出题数！')
        return false
      }
      return true
    },
    updateRandom() {
      let params = []
      let isEmpty = false
      this.data.some((item) => {
        if (item.selectItem.length == 0) {
          isEmpty = true
          this.$message.error('未选择知识单元！')
          return true
        }
        if (!item.questionCount) {
          isEmpty = true
          this.$message.error('出题数不能为空！')
          return true
        }
      })
      if(isEmpty) return
      //判断数量
      if(!this.judgeCount()) return
      this.data.forEach((item, index) => {
        params.push({
          number: item.questionCount,
          unitId: item.selectItem[item.selectItem.length - 1],
        })
      })
      postAction('/api/paper/random', params).then((res) => {
        this.$message.success(res.message)
        this.optionalList.forEach(item => {
          res.data.some((ele, index) => {
            if(ele.quesId == item.quesId) {
              res.data.splice(index, 1)
              return true
            }
          })
        })
        this.$store.commit('CHANGE_RANDOM_DATA', res.data)
        //合并随机与自选的数据
        let allData = res.data.concat(this.optionalList)
        //自选与随机总的id数组
        let rowKeys = []
        allData.forEach(item => {
          rowKeys.push(item.quesId)
        })
        //让数据回显
        this.$store.commit('CHANGE_ROWKEYS', rowKeys)
        this.$store.commit('CHANGE_SELECTION', allData)
      })
      this.visible = false
      this.confirmLoading = false
      // this.reset()
    },
    reset() {
      this.addId = 1
      this.questionSum = 0
      this.selectedRowKeys = []
      this.data.splice(0)
      this.data.push({
        questionCount: 0,
        id: '',
        selectItem: [],
      })
    },
    loadData() {
      const params = {
        count: true,
      }
      konwApi
        .getKnowList(params)
        .then((res) => {
          if (res.code == 200) {
            const data = this.handlerTreeData(res.data.children)
            this.treeData = data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    handlerTreeData(data) {
      return data.map((item) => {
        if (item.children.length != 0) {
          return {
            label: item.name,
            value: item.unitId,
            children: this.handlerTreeData(item.children),
          }
        } else {
          return {
            label: item.name,
            value: item.unitId,
          }
        }
      })
    },
    handleDelete(id) {
      this.data.some((item, i) => {
        if (item.id == id) {
          this.data.splice(i, 1)
          this.questionSum = this.questionSum - item.questionCount
          return true
        }
      })
    },
    //多选框回调
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys', selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
    },
    onCheckChange(record, selected, selectedRows) {},
    onSelectAll(selected, selectedRows, changeRows) {
      console.log('onSelectAll')
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
  .left-wrap {
    display: flex;
    align-items: center;
    // .right-text {
    //   margin-left: 40px;
    // }
  }
}
.footer-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>