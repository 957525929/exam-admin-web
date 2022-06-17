export const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  // {
  //   title: '英文名称',
  //   dataIndex: 'eName'
  // },
  {
    title: '所属场景',
    dataIndex: 'scene',
    scopedSlots: { customRender: 'scene' }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' }
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export const tableData = []
