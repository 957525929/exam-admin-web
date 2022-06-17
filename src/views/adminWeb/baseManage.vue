<template>
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
        <a-tree :load-data="onLoadData" style="height: 100%" show-line :tree-data="treeData">
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
        <school-manage v-if="selectKey == 1" />
        <class-manage v-if="getData.status == 'school'" />
        <student-manage v-if="getData.status == 'class'" />
      </a-card>
    </div>
  </div>
</template>

<script>
import { tree } from './data/base_tree'
import schoolManage from './schoolManage/index.vue'
import classManage from './classManage/index.vue'
import studentManage from './studentManage/index.vue'

export default {
  inject: ['reload'],
  components: {
    schoolManage,
    classManage,
    studentManage,
  },
  data() {
    return {
      treeData: [{ title: '学校管理', key: '1', scopedSlots: { title: 'custom' } }],
      selectKey: null,
      getData: '',
    }
  },

  methods: {
    // 懒加载获取树节点
    onLoadData(treeNode) {
      console.log(treeNode)
      if (treeNode.dataRef.key != -1) {
        return new Promise((resolve) => {
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            if (treeNode.eventKey == 1) {
              treeNode.dataRef.children = tree
            }
            this.treeData = [...this.treeData]
            resolve()
          }, 1000)
        })
      }
    },
    // 获取所点击树的内容
    getItem(v) {
      this.selectKey = v.key
      this.getData = v
      console.log('this.getData', this.getData)
    },
  },
}
</script>

<style lang="less" scoped>
.ele-page {
  display: flex;
  justify-content: center;
  height: 80vh;
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
