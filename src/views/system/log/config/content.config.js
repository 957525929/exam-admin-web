export const contentTableConfig = {
  data: [
    {
      key: '1',
      account: 'test1',
      name: '教师A',
      type: '登录',
      ip: '172.16.1.146',
      status: '0',
      path:'com.zongtu.ss.api',
      createTime: '2022-03-04 23:14:06',
    },
    {
      key: '2',
      account: 'test2',
      name: '教师A',
      type: '新增试卷',
      ip: '172.16.1.146',
      status: '1',
      createTime: '2022-03-03 05:20:33',
    },
    {
      key: '3',
      account: 'test3',
      name: '教师A',
      type: '新增学生',
      ip: '172.16.1.146',
      status: '1',
      createTime: '2022-03-02 18:45:00',
    },
    {
      key: '4',
      account: 'test4',
      name: '教师A',
      type: '禁用教师',
      status: '1',
      ip: '172.16.1.146',
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
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      width: '20%',
      scopedSlots: { customRender: 'createTime' },
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '操作类型',
      dataIndex: 'operation',
    },
    // {
    //   title: '路径',
    //   dataIndex: 'path',
    // },
    {
      title: '结果',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' },
    }
  ],
}
