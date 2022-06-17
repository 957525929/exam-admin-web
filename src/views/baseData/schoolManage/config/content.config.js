export const contentTableConfig = {
  data: [
    {
      key: '1',
      name: '校区A',
      class: '5',
      teacher: '10',
      createTime: '2022-03-01 23:14:06',
    },
    {
      key: '2',
      name: '校区B',
      class: '5',
      teacher: '10',
      createTime: '2022-03-02 05:20:33',
    },
    {
      key: '3',
      name: '校区C',
      class: '2',
      teacher: '10',
      createTime: '2022-03-02 08:45:00',
    },
    {
      key: '4',
      name: '校区D',
      class: '3',
      teacher: '5',
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
      title: '省份',
      dataIndex: 'province'
    },
    {
      title: '学校名称',
      dataIndex: 'schoolName',
    },
    {
      title: '教师数量',
      dataIndex: 'teacherNum',
    },
    {
      title: '班级数量',
      dataIndex: 'classNum',
    },
    {
      title: '账号数量',
      dataIndex: 'accountNum'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      scopedSlots: { customRender: 'createTime' },
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ],
  page: '',
  pageSize: '',
  loading: false,
}
