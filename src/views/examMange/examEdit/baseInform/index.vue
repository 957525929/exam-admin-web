<template>
  <div class="page">
    <div class="pageLeft">
      <page-form
        ref="pageForm"
        :formItem="form_item"
        :formData="formData"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      />
    </div>
    <div class="pageRight">
      <a-tree
        :load-data="onLoadData"
        style="height: 100%"
        :tree-data="treeData"
        checkable
        :default-expanded-keys="['1']"
      >
        <template slot="custom" slot-scope="item">
          <div style="width: 100%" @click="getItem(item)">
            {{ item.title }}
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script>
import pageForm from '@/components/page-form'
import { formConfig } from './config/form.config'
import { treeConfig } from './config/tree.config'
export default {
  components: {
    pageForm,
  },
  data() {
    return {
      ...formConfig,
      ...treeConfig,
      treeData: [{ title: '指定班级(不选则代表全部)', key: '1', scopedSlots: { title: 'custom' } }],
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
              treeNode.dataRef.children = this.tree
            }
            this.treeData = [...this.treeData]
            resolve()
          }, 1000)
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.page {
  display: flex;
  justify-content: space-around;
  height: 60vh;
  width: 100%;
  //   .pageLeft {
  //     flex: 1;
  //   }
  //   .pageRight {
  //     flex: 2;
  //   }
}
</style>
