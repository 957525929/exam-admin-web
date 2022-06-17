export const contentTableConfig = {
  data: [
    {
      key: '1',
      name: '校区A',
      createTime: '2022-03-01 23:14:06',
    },
    {
      key: '2',
      name: '校区B',
      createTime: '2022-03-02 05:20:33',
    },
    {
      key: '3',
      name: '校区C',
      createTime: '2022-03-02 08:45:00',
    },
    {
      key: '4',
      name: '校区D',
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
      title: '校区名称',
      dataIndex: 'name',
      width: '20%',
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
  page: '',
  pageSize: '',
  loading: false,
}
