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
        <a-tree style="height: 100%" :tree-data="treeData" :default-expanded-keys="[1]" :defaultSelectedKeys="[1]">
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
      <a-card class="tabs" style="height: 100%">
        <a-alert message="请点击左侧菜单,显示详细数据" banner closable />
        <br />
        <div v-if="getData.key">
          <a-tabs v-model="tabsKey" @change="changeCurrent">
            <a-tab-pane key="1" tab="知识管理"> <resources ref="resources" :getData="getData" @update="loadData()" /> </a-tab-pane>
            <a-tab-pane key="2" tab="学习资源"> <learn-resource ref="learnResourceCopy" :getData="getData" /> </a-tab-pane>
            <a-tab-pane key="3" tab="关联试题"><test-resource ref="testResourceCopy" :getData="getData" @update="loadData()" /> </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
import { tree } from './data/base_tree'
import resources from './resources/index.vue'
import learnResource from './learnResource'
import testResource from './testResource'
import { konwApi } from '@/api/know.js'

export default {
  inject: ['reload'],
  components: {
    resources,
    learnResource,
    testResource,
  },
  data() {
    return {
      treeData: [{ title: '知识单元', key: 1, parentId: 0, scopedSlots: { title: 'custom' }, children: [] }],
      selectKey: null,
      getData: {
        key: 1,
      },
      tabsKey: '1',
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      const params = {
        count: true,
      }

      konwApi
        .getKnowList(params)
        .then((res) => {
          // console.log('res', res.data.children)
          // if(res)
          if (res.code == 200) {
            const data = this.handlerTreeData(res.data.children)
            this.treeData[0].children = data
            // console.log('this.treeData', this.treeData)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    handlerTreeData(data) {
      return data.map((item) => {
        if (item.children != 0) {
          return {
            title: item.name,
            key: item.unitId,
            parentId: item.parentId,
            children: this.handlerTreeData(item.children),
            scopedSlots: { title: 'custom' },
          }
        } else {
          return {
            title: item.name,
            key: item.unitId,
            parentId: item.parentId,
            children: item.children,
            scopedSlots: { title: 'custom' },
          }
        }
      })
    },
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
    changeCurrent(key) {
      console.log(key)
      if(key == 1) {
        this.$refs.resources.changeCurrent()
      } else if(key == 2) {
        this.$nextTick(() => {
          this.$refs.learnResourceCopy.changeCurrent()
        })
      } else if(key == 3) {
        this.$nextTick(() => {
          this.$refs.testResourceCopy.changeCurrent()
        })
      }
    },
    // 获取所点击树的内容
    getItem(v) {
      // this.selectKey = v.key
      this.$refs.resources.changeCurrent()
      this.getData = v
      this.tabsKey = '1'
      // console.log('this.getData', this.getData)
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
  width: 20%;
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
  width: 80%;
  .tabs {
    overflow: auto;
  }
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
