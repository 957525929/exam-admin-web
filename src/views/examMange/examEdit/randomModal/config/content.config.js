export const contentTableConfig = {
  data: [{
    questionCount: 0,
    id: 1,
    selectItem: []
  }],
  columns: [
    {
      title: '知识单元',
      dataIndex: 'knowledge',
      width:'40%',
      scopedSlots: {
        customRender: 'knowledge'
      },
    },
    {
      title: '出题数',
      dataIndex: 'questionCount',
      scopedSlots: {
        customRender: 'questionCount'
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: {
        customRender: 'action'
      },
    }
  ],
}