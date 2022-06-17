export const contentTableConfig = {
  data: [],
  optionalData: [{
    content: '1 + 1 = 2',
    quseType: '单选',
    difficuty: '易',
    quesId: '1',
    knowledge: '建筑'
  }],
  columns: [
    {
      title: '知识单元',
      dataIndex: 'knowledge',
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      scopedSlots: {
        customRender: 'content'
      },
    },
    {
      title: '试题类型',
      dataIndex: 'quesType',
      scopedSlots: {
        customRender: 'quesType'
      },
    },
    {
      title: '试题难度',
      dataIndex: 'difficulty',
      scopedSlots: {
        customRender: 'difficulty'
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