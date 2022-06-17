<template>
  <div>
    <a-card>
      <a-row :gutter="16">
        <!-- <a-col :span="8">
          <span>试卷名称：试卷001</span>
        </a-col> -->
        <a-col :span="6" style="text-align: center">
          <a-statistic title="单选" :value="radio" style="margin-right: 50px"> </a-statistic>
        </a-col>
        <a-col :span="6" style="text-align: center">
          <a-statistic title="判断" :value="judge" class="demo-class"> </a-statistic>
        </a-col>
        <a-col :span="6" style="text-align: center">
          <a-statistic title="多选" :value="checkbox" class="demo-class"> </a-statistic>
        </a-col>
        <a-col :span="6" style="text-align: center">
          <a-statistic title="合计" :value="total" class="demo-class"> </a-statistic>
        </a-col>
      </a-row>
    </a-card>
    <div class="ele-page">
      <div class="left-card">
        <a-tooltip placement="left">
          <template slot="title">
            <span>点击刷新</span>
          </template>
          <a-icon class="icon" type="redo" @click="reload" />
        </a-tooltip>
        <!-- 左侧树 -->
        <a-card style="height: 100%; overflow: auto">
          <a-tree style="height: 100%" :tree-data="tree" :default-expanded-keys="['1']">
            <template slot="custom" slot-scope="item">
              <div style="width: 100%" @click="getItem(item)">
                {{ item.title }}
              </div>
            </template>
          </a-tree>
        </a-card>
      </div>
      <!-- 右侧 -->
      <div class="right-card">
        <a-card style="height: 100%">
          <a-alert message="请点击左侧菜单,显示详细数据" banner closable />
          <br />
          <test-resource
            v-if="selectKey"
            :selectKey="selectKey"
            :getData="getData"
            @updateState="updateState"
            @updateGetData="updateGetData"
          />
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import { tree } from './data/base_tree'
import testResource from './testResource/index.vue'

export default {
  inject: ['reload'],
  components: {
    testResource,
  },
  data() {
    return {
      treeData: [{ title: '知识单元', key: '1', scopedSlots: { title: 'custom' } }],
      selectKey: null,
      getData: '',
      radio: 0, //单选
      judge: 0, //判断
      checkbox: 0, //多选
      total: 0, //合计
      tree,
    }
  },

  methods: {
    // 懒加载获取树节点
    // onLoadData(treeNode) {
    //   console.log(treeNode)
    //   if (treeNode.dataRef.key != -1) {
    //     return new Promise((resolve) => {
    //       if (treeNode.dataRef.children) {
    //         resolve()
    //         return
    //       }
    //       setTimeout(() => {
    //         if (treeNode.eventKey == 1) {
    //           treeNode.dataRef.children = tree
    //         }
    //         this.treeData = [...this.treeData]
    //         resolve()
    //       }, 1000)
    //     })
    //   }
    // },
    // 获取所点击树的内容
    getItem(v) {
      this.selectKey = v.key
      this.getData = v

      // console.log('this.getData', this.getData)
    },
    //统计数值的回调
    updateState(value) {
      const radioData = value.filter((item) => item.type == '0').length
      const checkBoxData = value.filter((item) => item.type == '1').length
      const judgeData = value.filter((item) => item.type == '2').length
      // const { radioData, judgeData, checkBoxData } = value
      this.radio = radioData
      this.judge = judgeData
      this.checkbox = checkBoxData
      this.total = this.radio + this.judge + this.checkbox
    },
    //当前选择的总数回调
    updateGetData(value) {
      this.getData.total = value.length
      this.getData.title = this.getData.name + '（' + value.length + '）'
      if (this.getData.isLeaf) {
        const tree = this.handlerData(this.tree, this.getData.pathNode)
        this.tree = tree
      }
    },
    //递归改父节点的值
    handlerData(params, key) {
      return params.map((item) => {
        item = Object.assign({}, item)
        if (item.key == key) {
          let sonTotalNum = 0
          item.children.map((item) => item.total && (sonTotalNum += item.total))
          item.total = sonTotalNum
          item.title = item.name + '（' + sonTotalNum + '）'
        } else if (item.children) {
          item.children = this.handlerData(item.children, key)
        }
        return item
      })
    },
  },
}
</script>

<style lang="less" scoped>
.ele-page {
  display: flex;
  justify-content: center;
  height: 70vh;
}
.left-card {
  position: relative;
  flex: 1;
}
.icon {
  position: absolute;
  right: 20px;
  top: 30px;
  z-index: 999;
  font-size: 20px;
  color: #08c;
}
.icon:hover {
  color: orange;
}
.right-card {
  flex: 3;
}
</style>
<style lang="less">
.tip_style {
  .ant-tooltip-inner {
    background-color: grey !important;
  }
  .ant-tooltip-arrow::before {
    background-color: grey !important;
  }
}
</style>
