export const contentTableConfig = {
  data: [
    {
      key: '1',
      name: '班级A',
      studentNum: '30',
      year: '2022',
      createTime: '2022-03-01 23:14:06',
    },
    {
      key: '2',
      name: '班级B',
      studentNum: '59',
      year: '2022',
      createTime: '2022-03-02 05:20:33',
    },
    {
      key: '3',
      name: '班级C',
      studentNum: '30',
      year: '2022',
      createTime: '2022-03-02 08:45:00',
    },
    {
      key: '4',
      name: '班级D',
      studentNum: '54',
      year: '2021',
      createTime: '2022-03-02 14:29:56',
    },
  ],
  columns: [
    {
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' },
    },
    {
      title: '班级名称',
      dataIndex: 'name',
    },
    {
      title: '年份',
      dataIndex: 'year',
    },
    {
      title: '学生数',
      dataIndex: 'studentNum',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ],
}
