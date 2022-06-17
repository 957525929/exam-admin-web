<template>
  <div>
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
      <span v-for="item in columns" :key="item.dataIndex" :slot="item.dataIndex" slot-scope="text, record, index">
        <template v-if="item.scopedSlots">
          <slot :name="item.dataIndex" :text="text" :record="record" :index="index"></slot>
        </template>
      </span>
    </a-table>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  mixins: [JeecgListMixin],
  components: {},
  props: ['columns'],
  data() {
    return {
      formOriginData: {},
      formData: {},
      slotsProp: [],
      url: {
        list: '/api/school/paging',
        delete: '/api/school/',
      },
    }
  },
  created() {},
  methods: {},
  watch: {},
}
</script>

<style lang="less"></style>
