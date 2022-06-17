export const contentTableConfig = {
  data: [
    {
      key: '1',
      name: '试卷A',
      class: '22级班级A、22级班级B',
      total: '100',
      createTime: '2022-03-01 23:14:06',
    },
  ],
  columns: [
    {
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' },
    },
    {
      title: '试卷名称',
      dataIndex: 'paperName',
    },
    {
      title: '出卷人',
      dataIndex: 'name',
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
    },
    // {
    //   title: '指定班级',
    //   dataIndex: 'class',
    //   scopedSlots: { customRender: 'class' },
    // },
    {
      title: '出卷时间',
      dataIndex: 'createTime',
      scopedSlots: { customRender: 'createTime' },
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ],
}
